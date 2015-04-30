var dialog, DIALOG_FLIGHT;

function openDialogInbound(flight) {
	addRunwaysToDialog(flight, RUNWAY_INBOUND, LANDING_RUNWAYS);
	openDialog(flight);	
}

function openDialogOutbound(flight) {
	addRunwaysToDialog(flight, RUNWAY_OUTBOUND, TAKEOFF_RUNWAYS);
	openDialog(flight);	
}

function addRunwaysToDialog(flight, preselect, list) {
	$("#dialog-runway").empty();

	var dialogSelected = $("#" + flight).data('forced-runway');
	if(!dialogSelected) {
		$("input[name='runway'][value='default']").click();
	}

	$.each(list, function(id, runway) {
		var selected = (runway == dialogSelected) ? ' checked="checked"' : '';

		$("#dialog-runway").append('<label><input type="radio" name="runway" value="'+runway+'"'+selected+' />'+runway+'</label>');
	});
}

function openDialog(flight) {
	DIALOG_FLIGHT = flight;

	dialog.dialog("open");
}

$(function() {
	dialog = $("#dialog-form").dialog({
		autoOpen: false,
		height: 200,
		width: 500,
		modal: true,
		buttons: {
			Update: function() {
				var value = $("input[name='runway']:checked").val();

				if(value == 'default') {
					$("#" + DIALOG_FLIGHT).removeData('forced-runway');
				}
				else {
					$("#" + DIALOG_FLIGHT).data('forced-runway', value);
				}

				updateData();
				dialog.dialog("close");
			},
			Cancel: function() {
				dialog.dialog("close");
			}
		},
		close: function() {
			form[0].reset();
		},
		open: function() {
			$("#dialog-flight").html(DIALOG_FLIGHT);
		}
	});

	form = dialog.find( "form" ).on( "submit", function( event ) {
		event.preventDefault();
		addUser();
	});
});