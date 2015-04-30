var dialog, DIALOG_FLIGHT;

function openDialog(flight, runwayList) {
	DIALOG_FLIGHT = flight;

	$("#dialog-runway").empty();

	var dialogSelected = $("#" + flight).data('forced-runway');
	if(!dialogSelected) {
		$("input[name='runway'][value='default']").click();
	}

	var touchgoSelected = $("#" + flight).data('touchgo');
	if(touchgoSelected) {
		$("input[name='touchgo']").click();
	}

	$.each(runwayList, function(id, runway) {
		var selected = (runway == dialogSelected) ? ' checked="checked"' : '';

		$("#dialog-runway").append('<label><input type="radio" name="runway" value="'+runway+'"'+selected+' />'+runway+'</label>');
	});

	dialog.dialog("open");
}

function dialogUpdateStrip() {
	var runway = $("input[name='runway']:checked").val();
				
	if(runway == 'default') {
		$("#" + DIALOG_FLIGHT).removeData('forced-runway');
	}
	else {
		$("#" + DIALOG_FLIGHT).data('forced-runway', runway);
	}

	var touchgo = $("input[name='touchgo']:checked").val();

	if(touchgo == 'true') {
		$("#" + DIALOG_FLIGHT).data('touchgo', true);
	}
	else {
		$("#" + DIALOG_FLIGHT).removeData('touchgo');
	}

	updateData();
}

$(function() {
	dialog = $("#dialog-form").dialog({
		autoOpen: false,
		height: 250,
		width: 500,
		modal: true,
		buttons: {
			Update: function() {
				dialogUpdateStrip();

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