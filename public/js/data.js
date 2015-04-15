// Fill in your airport here
var AIRPORT = 'EHAM';

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

// Creates and adds a strip to the board
function createStrip(data) {
	if(data[11] == AIRPORT) {
		createStripOutbound(data);
	}
	else if(data[13] == AIRPORT) {
		createStripInbound(data);
	}
}

// Creates a strip for an inbound flight
function createStripInbound(data) {
	var aircraft = data[9].match(/([A-Z]*\/)?([A-Z0-9\-]*)(\/[A-Z]*)?/)[2];
	var route = data[30].split(' ').pop();

	var strip = '<li id="'+data[0]+'" class="inbound">' +
		'<div class="column col1"><textarea></textarea></div>' + 
		'<div class="column col2"><div class="gate">GATE</div><div class="inputs"><input class="gate"></div><div class="eobt">1805</div></div>' + 
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
		'<div class="column col1"><div class="gate">GATE</div><div class="inputs"><input class="gate"></div><div class="eobt">1800</div></div>' +
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
