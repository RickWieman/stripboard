// Fill in your airport data here
var AIRPORT = 'EHAM';
var AIRPORT_LAT = 52.3081;
var AIRPORT_LON = 4.7642;

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

	$.each(results, function(id, flight) {
		if($("#" + flight[0]).length == 0) {
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

// Creates and adds a strip to the board
function createStrip(data) {
	if(data[11] == AIRPORT) {
		createStripOutbound(data);
	}
	else if(data[13] == AIRPORT) {
		createStripInbound(data);
	}

	$("#" + data[0] + " div.callsign").on("click", function() {
		$(this).toggleClass('strike');
	});

	$("#" + data[0] + " div.arr_airport").on("click", function() {
		$(this).toggleClass('check');
	});
}

// Updates a strip by filling in new data
function updateStrip(data) {
	var route;

	if(data[11] == AIRPORT) {
		var routeSegments = data[30].split(' ').slice(0, 3);
		route = routeSegments.join(' ');
	}
	else if(data[13] == AIRPORT) {
		var time = calculateArrivalTime(parseFloat(data[5]), parseFloat(data[6]), data[8]);
		$("#" + data[0] + " .eobt").html(time);

		route = data[30].split(' ').pop();
	}

	var aircraft = data[9].match(/([A-Z]*\/)?([A-Z0-9\-]*)(\/[A-Z]*)?/)[2];
	$("#" + data[0] + " .aircraft").html(aircraft);

	$("#" + data[0] + " .dep_airport").html(data[11]);
	$("#" + data[0] + " .arr_airport").html(data[13]);
	$("#" + data[0] + " .route").html(route);
	$("#" + data[0] + " .sq_id").html(data[17]);
}

// Creates a strip for an inbound flight
function createStripInbound(data) {
	var aircraft = data[9].match(/([A-Z]*\/)?([A-Z0-9\-]*)(\/[A-Z]*)?/)[2];
	var route = data[30].split(' ').pop();
	var time = calculateArrivalTime(parseFloat(data[5]), parseFloat(data[6]), data[8]);

	var strip = '<li id="'+data[0]+'" class="inbound">' +
		'<div class="column col1"><textarea></textarea></div>' + 
		'<div class="column col2"><div class="gate"><input placeholder="GATE"></div><div class="inputs"><input class="gate"></div><div class="eobt">'+time+'</div></div>' + 
		'<div class="column col3"><div class="aircraft">'+aircraft+'</div><div class="callsign">'+data[0]+'</div><div class="runway"><span>27</span></div>' +
		'<div class="inputs"><input class="origin"> <input class="callsign"> <input class="destination"></div>' +
		'<div class="dep_airport">'+data[11]+'</div><div class="arr_airport">'+data[13]+'</div></div>' +
		'<div class="column col4"><div class="route">'+route+'</div><div class="sq_mode">C</div>' +
		'<div class="inputs"><input class="route"></div><div class="sq_id">'+data[17]+'</div></div></li>';

	$(".gridster ul").gridster().data('gridster').add_widget(strip, 2, 1, 1, 1);
}

// Creates a strip for an outbound flight
function createStripOutbound(data) {
	var aircraft = data[9].match(/([A-Z]*\/)?([A-Z0-9\-]*)(\/[A-Z]*)?/)[2];
	var routeSegments = data[30].split(' ').slice(0, 3);
	var route = routeSegments.join(' ');

	var strip = '<li id="'+data[0]+'" class="outbound">' +
		'<div class="column col1"><div class="gate"><input placeholder="GATE"></div><div class="inputs"><input class="gate"></div><div class="eobt">1800</div></div>' +
		'<div class="column col2"><div class="aircraft">'+aircraft+'</div><div class="callsign">'+data[0]+'</div><div class="runway"><span>24</span></div>' +
		'<div class="inputs"><input class="origin"> <input class="callsign"> <input class="destination"></div>' +
		'<div class="dep_airport">'+data[11]+'</div><div class="arr_airport">'+data[13]+'</div></div>' +
		'<div class="column col3"><div class="rfl">'+data[12]+'</div><div class="sid">VAL1S</div>' + 
		'<div class="inputs"><input class="rfl"> <input class="sid"></div><div class="sq_mode">C</div><div class="sq_id">'+data[17]+'</div></div>' +
		'<div class="column col4"><div class="route">'+route+'</div><div class="inputs"><input class="route"></div></div></li>';


	$(".gridster ul").gridster().data('gridster').add_widget(strip, 2, 1, 5, 1);
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
