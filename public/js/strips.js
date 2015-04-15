// Creates and adds a strip to the board
function createStrip(flight) {
	if(flight.origin == AIRPORT) {
		createStripOutbound(flight);
	}
	else if(flight.destination == AIRPORT && flight.dtg < RANGE) {
		createStripInbound(flight);
	}

	$("#" + flight.callsign + " div.callsign").on("click", function() {
		$(this).toggleClass('strike');
	});

	$("#" + flight.callsign + " div.arr_airport").on("click", function() {
		$(this).toggleClass('check');
	});
}

// Updates a strip by filling in new data
function updateStrip(flight) {
	var route;

	if(flight.origin == AIRPORT) {
		$("#" + flight.callsign + " .sid").html(createSID('24', flight.route));

		route = createOutboundRoute(flight.route);
	}
	else if(flight.destination == AIRPORT) {
		$("#" + flight.callsign + " .eobt").html(flight.eta);

		route = createInboundRoute(flight.route);
	}

	$("#" + flight.callsign + " .aircraft").html(flight.aircraft);
	$("#" + flight.callsign + " .dep_airport").html(flight.origin);
	$("#" + flight.callsign + " .arr_airport").html(flight.destination);
	$("#" + flight.callsign + " .route").html(route);
	$("#" + flight.callsign + " .sq_id").html(flight.squawk);
}

// Creates a strip for an inbound flight
function createStripInbound(flight) {
	var strip = '<li id="'+flight.callsign+'" class="inbound">' +
		'<div class="column col1"><textarea></textarea></div>' + 
		'<div class="column col2"><div class="gate"><input placeholder="GATE"></div><div class="inputs"><input class="gate"></div><div class="eobt">'+flight.eta+'</div></div>' + 
		'<div class="column col3"><div class="aircraft">'+flight.aircraft+'</div><div class="callsign">'+flight.callsign+'</div><div class="runway"><span>27</span></div>' +
		'<div class="inputs"><input class="origin"> <input class="callsign"> <input class="destination"></div>' +
		'<div class="dep_airport">'+flight.origin+'</div><div class="arr_airport">'+flight.destination+'</div></div>' +
		'<div class="column col4"><div class="route">'+createInboundRoute(flight.route)+'</div><div class="sq_mode">C</div>' +
		'<div class="inputs"><input class="route"></div><div class="sq_id">'+flight.squawk+'</div></div></li>';

	$(".gridster ul").gridster().data('gridster').add_widget(strip, 2, 1, 1, 1);
}

function createOutboundRouteSegments(rawRoute) {
	var exitIndex = 0;
	$.each(rawRoute.split(' '), function(id, val) {
		if($.inArray(val, EXIT_POINTS) > -1) {
			exitIndex = id;
		}
	});

	return rawRoute.split(' ').slice(exitIndex, exitIndex+3);
}

function createOutboundRoute(rawRoute) {
	return createOutboundRouteSegments(rawRoute).join(' ');
}

function createInboundRoute(rawRoute) {
	var routeSegments = rawRoute.split(' ');
	var entryIndex = routeSegments.length-1;

	$.each(routeSegments, function(id, val) {
		if($.inArray(val, ENTRY_POINTS) > -1) {
			entryIndex = id;
		}
	});

	return routeSegments[entryIndex];
}

function createSID(runway, rawRoute) {
	var sid = SIDs[runway][createOutboundRouteSegments(rawRoute)[0]];
	return (sid == undefined) ? 'DIFT' : sid;
}

// Creates a strip for an outbound flight
function createStripOutbound(flight) {
	var route = createOutboundRoute(flight.route);
	var sid = createSID('24', flight.route);

	var strip = '<li id="'+flight.callsign+'" class="outbound">' +
		'<div class="column col1"><div class="gate"><input placeholder="GATE"></div><div class="inputs"><input class="gate"></div><div class="eobt">1800</div></div>' +
		'<div class="column col2"><div class="aircraft">'+flight.aircraft+'</div><div class="callsign">'+flight.callsign+'</div><div class="runway"><span>24</span></div>' +
		'<div class="inputs"><input class="origin"> <input class="callsign"> <input class="destination"></div>' +
		'<div class="dep_airport">'+flight.origin+'</div><div class="arr_airport">'+flight.destination+'</div></div>' +
		'<div class="column col3"><div class="rfl">'+flight.rfl+'</div><div class="sid">'+sid+'</div>' + 
		'<div class="inputs"><input class="rfl"> <input class="sid"></div><div class="sq_mode">C</div><div class="sq_id">'+flight.squawk+'</div></div>' +
		'<div class="column col4"><div class="route">'+route+'</div><div class="inputs"><input class="route"></div></div></li>';


	$(".gridster ul").gridster().data('gridster').add_widget(strip, 2, 1, 5, 1);
}