# calendar_demo
Calendar webapp project

## Overview
### client-side
I decided to handle all of the UX interactions in the browser with jQuery, bootstrap and the following libraries:

- [bootstrap-datetimepicker](http://eonasdan.github.io/bootstrap-datetimepicker/)
- [fullcalendar](https://fullcalendar.io/)
- [jquery-loading-overlay](https://gasparesganga.com/labs/jquery-loading-overlay/)

### server-side
In order to get around the same-origin policy for ajax requests, and to hide some of the authentication and request-building tasks, I wrote a small python-Flask app that serves as a proxy for the remote api, `api/api.py`. It doesn't do much besides build headers and copy request and response data.

## Testing
### views
The calendar is configured to support 3 different views, selectable by 3 buttons in the upper right.

### edit/create
Clicking on blank space in any view brings up the dialog for creating a new event. Click and drag to select ranges of days for events longer than one day.

Clicking on an event element in any view brings up the dialog for editing an existing event.

In week and day views, the event elements support dragging and resizing.

### mobile
On mobile, touch and hold to select/drag

### demo
Try the [live demo!](http://icestationzebra.hopto.org:55280/calendar/)