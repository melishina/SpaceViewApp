var t = moment().add(3, 'd').format('YYYY-MM-DD');
var apiKey = "AIzaSyBxRqVxyrOrYurpGwO5x8bZvzsV1p_HXXs";
var url = "https://www.googleapis.com/calendar/v3/calendars/nytimes.com_89ai4ijpb733gt28rg21d2c2ek%40group.calendar.google.com/events?key="+ apiKey + '&timeMin='+ t +'T00%3A00%3A00Z';
var serverStauts = 0;
var events = [];

var monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

function getMonth(event){
  let formatDate = new Date(event.start.date);
  let month = formatDate.getMonth();
  return month;
}

function eventHTML(event){
  let formatDate = new Date(event.start.date);
  let date = formatDate.getDate() + 1;
  let month = formatDate.getMonth();
  let desc = event.description;
  let summary = event.summary;
  
  return `<li class="event-container" aria-live="assertive" hidden>
          <span class="date-container">
          <span class="date">${date}<span class="month">${monthNames[month]}</span></span></span>
          <span class="detail-container">
          <span class="summary">${summary}</span>
          <span class="desc">${desc}</span>
          </span>
          </li>`;
}

var currentMonth = 2;
var maxResults = 2 ;

function addEventToList(event){
  let HTML = eventHTML(event);
  document.querySelector('.event-list')
  .insertAdjacentHTML( 'beforeend', eventHTML(event) );  
  
  document.querySelector('.event-list').lastChild.hidden = false;
}

function addNextTwoEvents(event1, event2){
  let HTML = "<div class='row'>" + eventHTML(event1) + eventHTML(event2) + "</div>";
  document.querySelector('.event-list')
  .insertAdjacentHTML( 'beforeend', eventHTML(event) ); 
}

function showCurrentMonthEvents(){
  const filteredEvents = events.filter(event => currentMonth == getMonth(event) );
  
  for( let i = 0; i < filteredEvents.length; i++ ){
    nextIndex = i + 1;
    if( nextIndex < filteredEvents.length ){
      addNextTwoEvents(filteredEvents[i++], filteredEvents[nextIndex] );
    }
    else {
      addEventToList(filteredEvents[i]);
    }
      
  }
  
}

function shouldShowEvent(event, index){
  return index < maxResults;
}

function processEvent(event, index){
  events.push(event);
  if( shouldShowEvent(event, index) ){
    addEventToList(event)
  }
}

var response;


function makeRequest() {
  xhr = new XMLHttpRequest();
  xhr.onload = function() {
    //console.log(this.getAllResponseHeaders());//server response
    serverStauts = xhr.status;
    if(xhr.status === 200){
      //console.log("pass");
      response = JSON.parse(this.responseText);
      for(var i = 0; i < response.items.length; i++)
    {
      let item = response.items[i];
      processEvent(item, i);
    }
    }else{
      statusError();
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

function statusError (){
  let retries = 3;
  if (retries > 0) {
		console.log('trying to load events #', retries);
		retries--;
		setTimeout(statusError, 2000);
  } 
  if (status == 'timeout') {
		$(".event-list").html('<div class="event-container"><p>Error API, try again</p></div>');
  }
}

/*LOAD MORE*/
var previousResult;
$("#loadmore").click(function(event) {
  event.preventDefault();
  let totalItems = response.items.length;
  previousResult = maxResults;
  if(maxResults <= totalItems)
  {
    maxResults = maxResults + 2;
    for(var i = previousResult; i < totalItems; i++)
    {
      let item = response.items[i];
      //console.log(item);
      processEvent(item, i);
    }
    if (maxResults==totalItems){
      $("#loadmore").hide();
    }
  }
 
});