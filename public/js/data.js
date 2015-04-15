// This file handles regular data updates from VATSIM.
// It provides the data as flight objects for the strip handler.

// Converts a number into radians
Number.prototype.toRad = function() {
	return this * Math.PI / 180;
}

// Adds leading zeroes to a number
// Thanks to http://stackoverflow.com/a/11187738/2137833
Number.prototype.pad = function(size) {
	var s = String(this);
	while (s.length < (size || 2)) {s = "0" + s;}
	return s;
}

// Callback for CSV parser; adds new strips for new flightplans
function parseData(data, file) {
	var results = $.grep(data.data, function(val) {
		return val[3] == 'PILOT' && (val[11] == AIRPORT || val[13] == AIRPORT);
	});

	$.each(results, function(id, data) {
		var flight = createFlightObject(data);

		if($("#" + flight.callsign).length == 0) {
			createStrip(flight);
		}
	});
}

// Calculates great-circle distance between aircraft and airport
// Thanks to http://www.movable-type.co.uk/scripts/latlong.html
function calculateRemainingDistance(lat, lon) {
	var R = 6371; // km
	var fi1 = AIRPORT_LAT.toRad();
	var fi2 = lat.toRad();
	var deltafi = (lat-AIRPORT_LAT).toRad();
	var deltalambda = (lon-AIRPORT_LON).toRad();

	var a = Math.sin(deltafi/2) * Math.sin(deltafi/2) +
	        Math.cos(fi1) * Math.cos(fi2) *
	        Math.sin(deltalambda/2) * Math.sin(deltalambda/2);
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

	return R * c * 0.5399568; // NM
}

// Calculates ETA, based on remaining distance and speed
function calculateArrivalTime(lat, lon, speed) {
	var timeRemaining = calculateRemainingDistance(lat, lon) / speed * 60 * 60 * 1000; // milliseconds
	var date = new Date((new Date()).valueOf() + timeRemaining);

	return "" + date.getUTCHours().pad() + date.getUTCMinutes().pad();
}

// Updates the data by using a CSV parser on the VATSIM data
function updateData() {
	$("#airport").html(AIRPORT);
	
	Papa.parse('/data/vatsim-data.txt', {
		download: true,
		delimiter: ':',
		comments: ';',
		fastMode: true,
		complete: parseData
	});
}

// Turns the raw data array of a VATSIM flight into an object (and performs some checks/enhancements)
function createFlightObject(rawData) {
	var flight = {
		callsign: rawData[0],
		lat: parseFloat(rawData[5]),
		lon: parseFloat(rawData[6]),
		alt: parseInt(rawData[7]),
		groundspeed: rawData[8],
		aircraft: rawData[9].match(/([A-Z]*\/)?([A-Z0-9\-]*)(\/[A-Z]*)?/)[2],
		origin: rawData[11],
		rfl: rawData[12],
		destination: rawData[13],
		squawk: rawData[17],
		route: rawData[30],
		dtg: null,
		eta: null
	};
	flight.rfl = (flight.rfl.indexOf("FL") == -1 && parseInt(flight.rfl) >= 1000) ? 'FL' + parseInt(flight.rfl.substring(0, flight.rfl.length-2)).pad(3) : flight.rfl;
	flight.dtg = calculateRemainingDistance(flight.lat, flight.lon);
	flight.eta = calculateArrivalTime(flight.lat, flight.lon, flight.groundspeed);

	return flight;
}

/*
VATSIM-data is structured as follows:

callsign
cid
realname
clienttype
frequency
latitude
longitude
altitude
groundspeed
planned_aircraft
planned_tascruise
planned_depairport
planned_altitude
planned_destairport
server
protrevision
rating
transponder
facilitytype
visualrange
planned_revision
planned_flighttype
planned_deptime
planned_actdeptime
planned_hrsenroute
planned_minenroute
planned_hrsfuel
planned_minfuel
planned_altairport
planned_remarks
planned_route
planned_depairport_lat
planned_depairport_lon
planned_destairport_lat
planned_destairport_lon
atis_message
time_last_atis_received
time_logon
heading
QNH_iHg
QNH_Mb
*/
