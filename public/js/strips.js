// Runway selection. Will be set dynamically via a dropdown menu.
var RUNWAY_INBOUND, RUNWAY_OUTBOUND, RANGE_INBOUND, RANGE_OUTBOUND;

// Creates and adds a strip to the board
function createStrip(flight) {
	if(flight.origin == AIRPORT && flight.distanceToAirport < RANGE_OUTBOUND) {
		createStripOutbound(flight);

		$("#" + flight.callsign + " div.callsign").on("click", function() {
			if($(this).data('dragging')) {
				return;
			}
			
			$(this).toggleClass('strike');
		});

		$("#" + flight.callsign + " div.arr_airport").on("click", function() {
			$(this).toggleClass('check');
		});
	}
	else if(flight.destination == AIRPORT && flight.distanceToAirport < RANGE_INBOUND) {
		createStripInbound(flight);

		$("#" + flight.callsign + " div.col1").on("click", function() {
			var element = $(this);

			if(element.hasClass('initial')) {
				element.toggleClass('cleared');
				element.toggleClass('initial');
			}
			else if(element.hasClass('cleared')) {
				element.toggleClass('cleared');
			}
			else {
				element.toggleClass('initial');
			}
		});
	}	
}

// Occupies a runway by creating the appropriate strip (once)
function occupyRunway(type) {
	var runway;

	switch(type) {
		case 'landing':
			runway = RUNWAY_INBOUND;
			break;
		case 'takeoff':
			runway = RUNWAY_OUTBOUND;
			break;
	}

	if($("#occupied" + runway).length == 0) {
		createOccupiedStrip(runway);
	}

	$("#occupied" + runway + ' div.remove').on("click", function() {
		$(".gridster ul").gridster().data('gridster').remove_widget($("#occupied" + runway));
	});
}

// Creates a strip for an occupied runway
function createOccupiedStrip(runway) {
	var strip = '<li id="occupied'+runway+'" class="occupied"><div class="remove">X</div>RUNWAY '+runway+'</li>';

	$(".gridster ul").gridster().data('gridster').add_widget(strip, 2, 1, 3, 1);
}

// Updates a strip by filling in new data
function updateStrip(flight) {
	var route;
	var runway;

	if(flight.origin == AIRPORT) {
		$("#" + flight.callsign + " .sid").html(createSID(RUNWAY_OUTBOUND, flight.route));

		route = createOutboundRoute(flight.route);
		runway = RUNWAY_OUTBOUND;
	}
	else if(flight.destination == AIRPORT) {
		$("#" + flight.callsign + " .eobt").html(flight.eta);

		route = createInboundRoute(flight.route);
		runway = RUNWAY_INBOUND;
	}

	$("#" + flight.callsign + " .aircraft").html(flight.aircraft);
	$("#" + flight.callsign + " .dep_airport").html(flight.origin);
	$("#" + flight.callsign + " .arr_airport").html(flight.destination);
	$("#" + flight.callsign + " .route").html(route);
	$("#" + flight.callsign + " .runway span").html(runway);
	$("#" + flight.callsign + " .sq_id").html(flight.squawk);
}

// Creates a strip for an inbound flight
function createStripInbound(flight) {
	var strip = '<li id="'+flight.callsign+'" class="inbound">' +
		'<div class="column col1"></div>' + 
		'<div class="column col2"><div class="gate"><input placeholder="GATE"></div><div class="inputs"><input class="gate"></div><div class="eobt">'+flight.eta+'</div></div>' + 
		'<div class="column col3"><div class="aircraft">'+flight.aircraft+'</div><div class="callsign">'+flight.callsign+'</div><div class="runway"><span>'+RUNWAY_INBOUND+'</span></div>' +
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
	var sid = createSID(RUNWAY_OUTBOUND, flight.route);

	var strip = '<li id="'+flight.callsign+'" class="outbound">' +
		'<div class="column col1"><div class="gate"><input placeholder="GATE"></div><div class="inputs"><input class="gate"></div><div class="eobt">N/A</div></div>' +
		'<div class="column col2"><div class="aircraft">'+flight.aircraft+'</div><div class="callsign">'+flight.callsign+'</div><div class="runway"><span>'+RUNWAY_OUTBOUND+'</span></div>' +
		'<div class="inputs"><input class="origin"> <input class="callsign"> <input class="destination"></div>' +
		'<div class="dep_airport">'+flight.origin+'</div><div class="arr_airport">'+flight.destination+'</div></div>' +
		'<div class="column col3"><div class="rfl">'+flight.rfl+'</div><div class="sid">'+sid+'</div>' + 
		'<div class="inputs"><input class="rfl"> <input class="sid"></div><div class="sq_mode">C</div><div class="sq_id">'+flight.squawk+'</div></div>' +
		'<div class="column col4"><div class="route">'+route+'</div><div class="inputs"><input class="route"></div></div></li>';


	$(".gridster ul").gridster().data('gridster').add_widget(strip, 2, 1, 5, 1);
}