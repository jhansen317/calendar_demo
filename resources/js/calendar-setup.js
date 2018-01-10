$(document).ready(function () {
	// set up the spinner whenever ajax requests are ongoing
	$(document).ajaxStart(function(){
	    $.LoadingOverlay("show");
	});

	$(document).ajaxStop(function(){
	    $.LoadingOverlay("hide");
	});
	
	$("#starttime").datetimepicker({
	    stepping : 30,
	    sideBySide : true
	});

	$("#endtime").datetimepicker({
	    stepping : 30,
	    sideBySide : true
	});

	$("#event-dialog").on("hidden.bs.modal", function (e) {
	    var cal_selector = $(this).data("cal_selector");
	    cal_selector.css('background-color', 'white');
	});

	$("#error-alert").on("show.bs.modal", function () {
	    $("#event-dialog").css({"opacity": 0, "z-index":0});
	});
	 
	$("#error-alert").on("hidden.bs.modal", function () {
	    $("#event-dialog").css({"opacity": 1, "z-index" : 1050});
	});

	$("#calendar").fullCalendar({
	    header : {
	        left: "prev,next today",
	        center: "title",
	        right: "month,agendaWeek,agendaDay"
	    },
	    selectable: true,
	    editable: true,
	    eventDrop: function(event, delta, revertFunc) {
	    	$.calendarUtils.populateFormData(event.id, event.title, event.description, event.start, event.end);
	        var formData = $.calendarUtils.gatherFormData();
	        $.calendarUtils.submitFormData(formData, $.calendarUtils.closeModalAndRefetch, revertFunc);
	    },
	    eventResize: function(event, delta, revertFunc) {
	    	$.calendarUtils.populateFormData(event.id, event.title, event.description, event.start, event.end);
	        var formData = $.calendarUtils.gatherFormData();
	        $.calendarUtils.submitFormData(formData, $.calendarUtils.closeModalAndRefetch, revertFunc);
	    },
	    events: function(start, end, timezone, callback) {
	        $.ajax({
	            type: "GET",
	            url: "api/events_proxy",
	            dataType: "json",
	            success: function(data) {
	                var events = [];
	                $.each(data, function(index, ev) {
	                    events.push({
	                        title: ev["Title"],
	                        description: ev["Description"],
	                        start: ev["StartDate"],
	                        end: ev["EndDate"],
	                        id: ev["Id"]
	                    });
	                });
	                callback(events);
	            },
	            error: function (jqXHR, textStatus, errorThrown) {
	            	$.calendarUtils.formAlert("Server Error!", "Unable to connect to calendar backend...");
	            }
	        });
	    },
	    selectAllow : function(selectInfo) { // we only consider it a 'select' event if it spans more than one day
	        var diff = selectInfo.end.diff(selectInfo.start, "days", true);
	        return (diff > 1.0);
	    },
	    select: function(start, end, jsEvent, view) {
	        console.debug('select event fired....Start is: ' + start.format('YYYY-MM-DD[T]HH:mm:ss') + ', end is: ' + end.format('YYYY-MM-DD[T]HH:mm:ss'));
	        $(this).css('background-color', '#fcffcc');
	        $.calendarUtils.populateFormData(0, "", "", start, end);
	        $.calendarUtils.setDialogMeta("Create New Event", "Create Event", false, $(this));
	        $("#event-dialog").modal( "show" );
	    },
	    dayClick: function(date, jsEvent, view) {
	        $(this).css('background-color', '#fcffcc');
	        var now = moment();
	        // Set the time components to current time, this is how google calendar works anyway
	        date.set({
	            "hour" : now.get("hour"),
	            "minute" : now.get("minute") 
	        });
	        $.calendarUtils.populateFormData(0, "", "", date);
	        $.calendarUtils.setDialogMeta("Create New Event", "Create Event", false, $(this));
	        $("#event-dialog").modal("show");
	    },
	    eventClick: function(calEvent, jsEvent, view) {
	    	$.calendarUtils.populateFormData(calEvent.id, calEvent.title, calEvent.description, calEvent.start, calEvent.end)
	        $.calendarUtils.setDialogMeta("Edit Event", "Save Changes", true);
	        $("#event-dialog").modal("show");
	    }
	});

	$(".modal-footer").on("click", "button#save_change", function(event) {
	    var formData = $.calendarUtils.gatherFormData();
	    $.calendarUtils.submitFormData(formData, $.calendarUtils.closeModalAndRefetch, function(jqXHR, textStatus, errorThrown) {
	    	$.calendarUtils.formAlert("Server Error!", "Unable to connect to calendar backend...");
	    });
	});

	$(".modal-footer").on("click", "button#delete_button", function(event) {
	    var formData = $.calendarUtils.gatherFormData();
	    if (formData.Id != 0) {
	    	$.calendarUtils.deleteEvent(formData.Id, $.calendarUtils.closeModalAndRefetch, function (jqXHR, textStatus, errorThrown) {
	        	if (jqXHR.status != 200 && jqXHR.status != 204) {
	        		$.calendarUtils.formAlert("Server Error!", "Unable to connect to calendar backend...");
	            } else {    
	                $.calendarUtils.closeModalAndRefetch();
	            }
	        });
	    }
	});
});