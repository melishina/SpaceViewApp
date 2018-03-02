
var t = moment().add(3, 'd').format('YYYY-MM-DD');
var apiKey = "AIzaSyBxRqVxyrOrYurpGwO5x8bZvzsV1p_HXXs";
var url = "https://www.googleapis.com/calendar/v3/calendars/nytimes.com_89ai4ijpb733gt28rg21d2c2ek%40group.calendar.google.com/events?key="+ apiKey + '&timeMin='+ t +'T00%3A00%3A00Z';

var events = [];

var monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

function getMonth(event){
      var formatDate = new Date(event.start.date);
      var month = formatDate.getMonth();
      return month;
}

function eventHTML(event){
      var formatDate = new Date(event.start.date);
      var date = formatDate.getDate() + 1;
      var month = formatDate.getMonth();
      var desc = event.description;
      var summary = event.summary;
      
      return `<div class="event-container">
        <span class="date-container">
            <span class="date">${date}<span class="month">${monthNames[month]}</span></span>
        </span>
        <span class="detail-container">
            <span class="summary">${summary}</span>
        <span class="desc">${desc}</span>
        </span>
      </div>`;
}
  var currentMonth = 2;
  var maxResults = 2 ;

function addEventToList(event){
  let HTML = eventHTML(event);
  document.querySelector('.event-list')
    .insertAdjacentHTML( 'beforeend', eventHTML(event) );  
}

function showCurrentMonthEvents(){
  events.filter(event => currentMonth == getMonth(event) )
    .forEach(addEventToList)
}

// get events event-list
// save events to array
// show first page of events
// imperative programming: do this thing!
// declarative programming: step 1: pick up the thing. step 2: do something with it.

// external interface:
function shouldShowEvent(event, index){
  
  // internal implementation
  return index < maxResults;
}

function processEvent(event, index){
  events.push(event);
  // external reference
  if( shouldShowEvent(event, index) ){
    addEventToList(event)
  }
}
var response;
function makeRequest() {
  xhr = new XMLHttpRequest();
  xhr.onload = function() {

    response = JSON.parse(this.responseText);
    for(var i = 0; i < response.items.length; i++)
    {
      let item = response.items[i];
      //console.log(item);
      //console.log(response.items.length);
      //console.log(response);
      processEvent(item, i);
    }
  };
  xhr.open(
    "GET",
   url,
    true
  );
  xhr.send();
}
makeRequest();

/*LOAD MORE*/
var previousResult;
$("#loadmore").click(function() {
  event.preventDefault()
  previousResult = maxResults;
  if(maxResults < 12)
  {
    maxResults = maxResults + 2;
    for(var i = previousResult; i < response.items.length; i++)
    {
      let item = response.items[i];
      console.log(item);
      processEvent(item, i);
    }
  }
});