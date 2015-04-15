$(function() {
	$("#airport").html(AIRPORT);

	$.each(LANDING_RUNWAYS, function(id, runway) {
		$("#landing").append('<option value="'+runway+'">'+runway+'</option>');
	});

	$.each(TAKEOFF_RUNWAYS, function(id, runway) {
		$("#takeoff").append('<option value="'+runway+'">'+runway+'</option>');
	});

	$(".gridster > ul").gridster({
		widget_margins: [5, 5],
		widget_base_dimensions: [230, 60],
		max_cols: 6
	}).data('gridster');

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

	updateData();
});