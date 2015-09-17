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
		widget_margins: [5, 6],
		widget_base_dimensions: [230, 60],
		max_cols: 6,
		collision: {
			wait_for_mouseup: true
		},
		draggable: {
			start: function(e, ui, widget) {
				$(e.toElement).data('dragging', true);
			},

			stop: function(e, ui, widget) {
				window.setTimeout(function() {
					$(e.toElement).data('dragging', false);
				}, 1);
			}
		}
	}).data('gridster');

	RANGE_INBOUND = $("#rangeIn")[0].value;
	$("#rangeIn").on("change", function() {
		RANGE_INBOUND = $(this)[0].value;
		updateData();
	});

	RANGE_OUTBOUND = $("#rangeOut")[0].value;
	$("#rangeOut").on("change", function() {
		RANGE_OUTBOUND = $(this)[0].value;
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