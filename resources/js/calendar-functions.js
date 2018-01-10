$(function($) {
	$.calendarUtils = {};
	$.calendarUtils.gatherFormData = function () {
	    var formData = new Object();
	    formData.Title = $("#title").val();
		formData.Description = $("#description").val();
		formData.StartDate = $("#starttime").data("DateTimePicker").date().format("YYYY-MM-DD[T]HH:mm:ss");
		formData.EndDate = $("#endtime").data("DateTimePicker").date().format("YYYY-MM-DD[T]HH:mm:ss");
		formData.Id = $("#event-form").data("id");
	    return formData;
	}

	$.calendarUtils.submitFormData = function(formData, success_callback = $.noop, error_callback = $.noop) {
	    var method = (formData.Id == 0) ? "POST" : "PUT";
	    $.ajax({
	        type: method,
	        url: "api/events_proxy",
	        dataType: "json",
	        data: JSON.stringify(formData),
	        success: success_callback,
	        error: error_callback
	    });
	}

	$.calendarUtils.deleteEvent = function (eventId, success_callback = $.noop, error_callback = $.noop) {
	    $.ajax({
	        type: "DELETE",
	        url: "api/events_proxy/" + eventId,
	        success: success_callback,
	        error: error_callback
	    });
	}

	$.calendarUtils.populateFormData = function (id, title, description, start, end) {
	    $("#event-form").data("id", id);
	
	    if (title !== "") {
	        $("#title").val(title);
	    } else {
	        $("#title").val("");
	        $("#title").attr("placeholder", "My New Event");
	    }

	    if (description !== "") {
	        $("#description").val(description);
	    } else {
	        $("#description").val("");
	        $("#description").attr("placeholder", "Event Description");
	    }

	    $("#starttime").data("DateTimePicker").date(start.local().startOf("minute"));

	    // if we're missing the end argument, we'll set it for 30 minutes                
	    if (typeof(end) === "undefined") {
	        var new_end = moment(start);
	        new_end.add(30, "minutes");
	    } else {
	        var new_end = moment(end);
	    }

	    $("#endtime").data("DateTimePicker").date(new_end.local().startOf("minute"));
	}

	$.calendarUtils.setDialogMeta = function (dialog_title, save_text, needs_delete = false, cal_selector = $()) {
	    console.debug(cal_selector);
	    $("#dialog-title").text(dialog_title);
	    $("#save_change").text(save_text);
	    if (needs_delete) {
	        if ($("#delete_button").length == 0) {
	            $("<button type='button' class='btn btn-warning' id='delete_button'>Delete Event</button>").insertAfter("#close_button");
	        }
	    } else {
	        if ($("#delete_button").length != 0) {
	            $("#delete_button").remove();
	        }
	    }
	    $("#event-dialog").data("cal_selector", cal_selector);
	}

	$.calendarUtils.closeModalAndRefetch = function () {
		$("#event-dialog").modal("hide");
        $("#calendar").fullCalendar('refetchEvents');
	}

	$.calendarUtils.formAlert = function (title, text) {
		$("#error-alert .modal-title").text(title);
		$("#error-alert .modal-body").html("<p>" + text + "</p>");
		$("#error-alert").modal("show");
	}
}(jQuery));