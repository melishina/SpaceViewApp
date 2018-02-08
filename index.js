/*Nasa pic of the day*/
var url = "https://api.nasa.gov/planetary/apod?api_key=NNKOjkoul8n1CH18TWA9gwngW1s1SmjESPjNoUFo";

$.ajax({
  url: url,
  success: function(result){
  if("copyright" in result) {
    $("#copyright").text("Image Credits: " + result.copyright);
  }
  else {
    $("#copyright").text("Image Credits: " + "Public Domain");
  }
  
  if(result.media_type == "video") {
    $("#apod_img_id").css("display", "none"); 
    $("#apod_vid_id").attr("src", result.url);
  }
  else {
    $("#apod_vid_id").css("display", "none"); 
    $("#apod_img_id").attr("src", result.url);
  }
   $("#returnObject").text(JSON.stringify(result, null, 4));  
  $("#apod_explaination").text(result.explanation);
  $("#apod_title").text(result.title);
}
});

/*Weather*/
$(document).ready(function() {
  
  let a_lat;
  let a_long;
  let skycons = new Skycons({"color": "white"});
  
  if (!navigator.geolocation){
    alert("Geolocation is not supported by this browser!");
    return;
  }
  navigator.geolocation.getCurrentPosition(showPosition, error);

  function error() {
    alert("Unable to retrieve your location! Allow the browser to track your location!");
  }
  
function showPosition(position) {
    a_lat =  position.coords.latitude;
    a_long =  position.coords.longitude;
    getWeatherData(a_lat, a_long);
}

  function getWeatherData(lat, long){
     let apiKey = "8351fc504a56a3c8d5e67d74c6595de6";
     let exclude = "?exclude=minutely,hourly,daily,alerts,flags";
     let unit = "?units=si";
     let url = "https://api.darksky.net/forecast/" + apiKey + "/" + lat + "," + long + exclude + unit;
     
    //get darksky api data
    $.ajax({
      url: url,
      dataType: "jsonp",
      success: function (weatherData) { 
        //icon
        console.log(weatherData.currently.icon);
        skycons.add(document.getElementById("icon1"), weatherData.currently.icon);
        skycons.play();
        //description
        $('#weather-description').text(weatherData.currently.summary);
        //temperature
        var celsius = toCelsius(weatherData.currently.temperature);
        $('#weather-value').html(celsius + '<a  id="convert" href="#" class="btn btn-primary btn_temp">°C</a>');
        $('#weather-value').val(celsius);
      }
    });
  }
  
  function toCelsius(f) {
    return Math.round((5/9) * (f-32));
  }
  
  function toFahrenheit(c){
    return Math.round(c * 9 / 5 + 32);
  }
  //click event to convert temperature
  $(document).on('click', '#convert', function(){
        
         if($("#convert").text() == "°C"){
             var temp = $("#weather-value").val();
             var far = toFahrenheit($("#weather-value").val());
             $('#weather-value').html(far + '<a  id="convert" href="#" class="btn btn-primary btn_temp">°F</a>');
             $("#weather-value").val(far);    
         }else{
             var cel = toCelsius($("#weather-value").val());
             $('#weather-value').html(cel + '<a  id="convert" href="#" class="btn btn-primary btn_temp">°C</a>');
             $("#weather-value").val(cel);
         }
      });
}); 

/*Clock*/
function clock() {
var time = new Date(),
    hours = time.getHours(),
    minutes = time.getMinutes(),
    seconds = time.getSeconds();

document.querySelectorAll('.clock')[0].innerHTML = harold(hours) + ":" + harold(minutes) + ":" + harold(seconds);
  
  function harold(standIn) {
    if (standIn < 10) {
      standIn = '0' + standIn
    }
    return standIn;
  }
}
setInterval(clock, 1000);

/*Moon*/
//gets todays date and calls on the draw function
function initLunarPhase(){
  var $date=new Date();
  var $year=$date.getFullYear();
  var $month=$date.getMonth()+1;
  var $day=$date.getDate();
 
  document.getElementById('day').innerHTML=$day;
  if ($month<10) {
    document.getElementById('month').innerHTML='0'+$month;
  }
  else {
    document.getElementById('month').innerHTML=$month;
  }
  document.getElementById('year').innerHTML=$year;
  
  var $moonPhase=moonPhase($year,$month,$day);
  drawMoon($moonPhase-1);
}


//function that calculates the moon phase given a certain day
function moonPhase(year,month,day) {
  n = Math.floor(12.37 * (year -1900 + ((1.0 * month - 0.5)/12.0)));
  RAD = 3.14159265/180.0;
  t = n / 1236.85;
	t2 = t * t;
	as = 359.2242 + 29.105356 * n;
	am = 306.0253 + 385.816918 * n + 0.010730 * t2;
	xtra = 0.75933 + 1.53058868 * n + ((1.178e-4) - (1.55e-7) * t) * t2;
	xtra += (0.1734 - 3.93e-4 * t) * Math.sin(RAD * as) - 0.4068 * Math.sin(RAD * am);
	i = (xtra > 0.0 ? Math.floor(xtra) :  Math.ceil(xtra - 1.0));
	j1 = julday(year,month,day);
	jd = (2415020 + 28 * n) + i;
	return (j1-jd + 30)%30;
}

//function that calculates julian date
function julday(year, month, day) {
	if (year < 0) { year ++; }
	var jy = parseInt(year);
	var jm = parseInt(month) +1;
	if (month <= 2) {jy--;	jm += 12;	} 
	var jul = Math.floor(365.25 *jy) + Math.floor(30.6001 * jm) + parseInt(day) + 1720995;
	if (day+31*(month+12*year) >= (15+31*(10+12*1582))) {
		ja = Math.floor(0.01 * jy);
		jul = jul + 2 - ja + Math.floor(0.25 * ja);
	}
	return jul;
}

//draws the lunar phase
function drawMoon($moonPhase){
  var $moonCanvas=document.getElementById('moonCanvas');
  var $ctx=$moonCanvas.getContext('2d');
  
  //draw half moon
  var $radius=100;
  var $centerX=$moonCanvas.width/2;
  var $centerY=$moonCanvas.height/2;
  var $moonFill=$ctx.createRadialGradient($centerX, $centerY, $radius, $centerX, $centerY, 90);
  $moonFill.addColorStop(0,   'black');
  $moonFill.addColorStop(1, 'white');
  
  $ctx.beginPath();
  $ctx.arc($centerX,$centerY,$radius,270*(Math.PI/180),90*(Math.PI/180),($moonPhase<15)?false:true);
  $ctx.fillStyle=$moonFill;
  $ctx.fill();
  
  //draw moon fill
  var $ovalWidth=-200;
  $ovalWidth=($moonPhase<15)?-200+$moonPhase*28.5:200-(($moonPhase-15)*28.5);
  var $ovalColor=($ovalWidth>0)? $moonFill:'black';
  
  drawEllipse($ctx,$centerX-$ovalWidth/2,0,$ovalWidth,200,$ovalColor);
  function drawEllipse(ctx, x, y, w, h,fill) {
    var kappa = .5522848;
        ox = (w / 2) * kappa, // control point offset horizontal
        oy = (h / 2) * kappa, // control point offset vertical
        xe = x + w,           // x-end
        ye = y + h,           // y-end
        xm = x + w / 2,       // x-middle
        ym = y + h / 2;       // y-middle
  
    ctx.beginPath();
    ctx.moveTo(x, ym);
    ctx.bezierCurveTo(x, ym - oy, xm - ox, y, xm, y);
    ctx.bezierCurveTo(xm + ox, y, xe, ym - oy, xe, ym);
    ctx.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
    ctx.bezierCurveTo(xm - ox, ye, x, ym + oy, x, ym);
    ctx.fillStyle=$ovalColor;
    ctx.fill();
  }
};


initLunarPhase();

/*CALENDAR*/
_('#calendar').innerHTML = calendar();

// short queySelector
function _(s) {
  return document.querySelector(s);
};

// show info
function showInfo(event) {
  // link 
  let url = 'https://dl.dropboxusercontent.com/u/23834858/api/calendar.json';
  // get json
/* getjson(url, function(obj) {
    for (key in obj) {
      // if has envent add class
      if(_('[data-id="' + key + '"]')){
        _('[data-id="' + key + '"]').classList.add('event');        
      }
      if (event === key) {
        // template info
        let data = '<h3>' + obj[key].type + '</h3>' +
            '<dl>' +
            '<dt><dfn>Title:</dfn></dt><dd>' + obj[key].title + '</dd>' +
            '<dt><dfn>Hour:</dfn></dt><dd>' + obj[key].time + '</dd>' +
            '<dt><dfn>Description:</dfn></dt><dd>' + obj[key].desc + '</dd>' +
            '</dl>';
        return _('#calendar_data').innerHTML = data;
      }
    }
  });*/
}

// simple calendar
function calendar() {
  // show info on init
  showInfo();

  // vars
  var day_of_week = new Array(
    'Sun', 'Mon', 'Tue',
    'Wed', 'Thu', 'Fri', 'Sat'),
      month_of_year = new Array(
    'January', 'February', 'March',
    'April', 'May', 'June', 'July',
    'August', 'September', 'October',
    'November', 'December'),
      
      Calendar = new Date(),
      year = Calendar.getYear(),
      month = Calendar.getMonth(),
      today = Calendar.getDate(),
      weekday = Calendar.getDay(),
      html = '';

  // start in 1 and this month
  Calendar.setDate(1);
  Calendar.setMonth(month);

  // template calendar
  html = '<table>';
  // head
  html += '<thead>';
  html += '<tr><th colspan="7">' + month_of_year[month] + '</th></tr>';
  html += '<tr><th colspan="7">' + Calendar.getFullYear() + '</th></tr>';
  html += '<tr class="week_cal">';
  for (index = 0; index < 7; index++) {
    if (weekday == index) {
      html += '<th>' + day_of_week[index] + '</th>';
    } else {
      html += '<th>' + day_of_week[index] + '</th>';
    }
  }
  html += '</tr>';
  html += '</thead>';

  // body
  html += '<tbody>';
  html += '</tr>';
  // white zone
  for (index = 0; index < Calendar.getDay(); index++) {
    html += '<td> </td>';
  }
  
  for (index = 0; index < 31; index++) {
    if (Calendar.getDate() > index) {

      week_day = Calendar.getDay();
      
      if (week_day === 0) {
        html += '</tr>';
      }
      if (week_day !== 7) {
        // this day
        var day = Calendar.getDate();
        var info = (Calendar.getMonth() + 1) + '/' + day + '/' + Calendar.getFullYear();

        if (today === Calendar.getDate()) {
          html += '<td><a class="today_cal" href="#" data-id="' + info + '" onclick="showInfo(\'' + info + '\')">' +
            day + '</a></td>';

          showInfo(info);
          
        } else {
          html += '<td><a href="#" data-id="' + info + '" onclick="showInfo(\'' + info + '\')">' +
            day + '</a></td>';
        }

      }
      if (week_day == 7) {
        html += '</tr>';
      }
    }
    Calendar.setDate(Calendar.getDate() + 1);
  } // end for loop
  return html;
}


//   Get Json data  
function getjson(url, callback) {
  var self = this,
      ajax = new XMLHttpRequest();
  ajax.open('GET', url, true);
  ajax.onreadystatechange = function() {
    if (ajax.readyState == 4) {
      if (ajax.status == 200) {
        var data = JSON.parse(ajax.responseText);
        return callback(data);
      } else {
        console.log(ajax.status);
      }
    }
  };
  ajax.send();
}

/*Events*/
$.ajax({
    type: 'GET',
    url:  'https://www.amsmeteors.org/members/api/open_api/get_event',
    data: {
        api_key:    "v38wz9KktQtanm3",
        year:       2015,
        event_id:   896
    },
    dataType:       "jsonp",
    cache:          false,
    crossDomain:    true,
    success: function(response) {
        if(response.status==200) {
           // Display result on Javascript console
           console.log(response.result);
        } else {
           // Errors result on Javascript console
           console.log(response.errors);
        }
    } 
});











