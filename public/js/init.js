$(function() {
	$("#airport").html(AIRPORT);

	$.each(LANDING_RUNWAYS, function(id, runway) {
		var selected = (runway == LANDING_RUNWAYS_DEFAULT) ? ' selected="selected"' : '';

		$("#landing").append('<option value="'+runway+'"'+selected+'>'+runway+'</option>');
	});

	$.each(TAKEOFF_RUNWAYS, function(id, runway) {
		var selected = (runway == TAKEOFF_RUNWAYS_DEFAULT) ? ' selected="selected"' : '';

		$("#takeoff").append('<option value="'+runway+'"'+selected+'>'+runway+'</option>');
	});

	$(".gridster > ul").gridster({
		widget_margins: [5, 5],
		widget_base_dimensions: [230, 60],
		max_cols: 6
	}).data('gridster');

	RANGE = $("#range")[0].value;
	$("#range").on("change", function() {
		RANGE = $(this)[0].value;
		updateData();
	});

	RUNWAY_INBOUND = $("#landing")[0].value;
	$("#landing").on("change", function() {
		RUNWAY_INBOUND = $(this)[0].value;
		updateData();
	});

	RUNWAY_OUTBOUND = $("#takeoff")[0].value;
	$("#takeoff").on("change", function() {
		RUNWAY_OUTBOUND = $(this)[0].value;
		updateData();
	});

	window.setInterval(updateData, UPDATE_FREQUENCY);

	updateData();
});