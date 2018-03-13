class GetWeatherAPI {
    constructor(targetEl, options) {
        this.appid = "6951b075e6f3dee08181faf2632e613d";
        this.forecastDays = 4;
        this.targetEl = targetEl;
        this.instanceID = targetEl.slice(-1);

        if (!options) {
            this.getUserLocation();
        } else {
            this.location = options.location;
            this.units = options.units;
            this.displayName = options.displayName
            const apiRequest = `https://cors.5apps.com/?uri=http://api.openweathermap.org/data/2.5/forecast/daily?q=${this.location}&units=${this.units}&APPID=${this.appid}&cnt=${this.forecastDays}`;

            this.getWeather(apiRequest, this.displayName);
        }
    }
    
    getUserLocation() {
        $.getJSON('https://ipinfo.io/json', (data) => {
          const loc = data.loc.split(','); //array
            const lat = loc[0];
            const lon = loc[1];
            const cName = data.city;
            const apiRequest = `https://cors.5apps.com/?uri=http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&APPID=${this.appid}&cnt=${this.forecastDays}`;
            this.getWeather(apiRequest, data);
        })
        .fail((err) => {
          
            $(".weatherCard1").html("<p>Error</p>")
          
            console.log(err);
        });
    }

    getWeather(apiRequest, locData) {
        $.getJSON(apiRequest, (data) => {
            this.renderData(data, locData);
        })
        .fail((jqXHR, textStatus, errorThrown) => {
            console.log(`Error: ${errorThrown}`);
            console.log(`TextStatus: ${textStatus}`);
        });
    }
    
    onFail(){
      retries : 3;
      if( getUserLocation.retries-- > 0 )
      setTimeout(function(){
        $.getJSON.fail(onFail);
    }, 1000);
}
    
    // Returns next 3 days for forecast.
    returnNextDays(n) {
        const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

        const today = (new Date()).getDay();
        let nextDays = [];
        for (let i = 0; i < n; i++) {
            nextDays.push(dayNames[(today + 1 + i) % dayNames.length]);
        }
        return nextDays;
    }

    renderData(data, locData) {
        const cityName = locData.city;
        const region = locData.region
        const country = locData.country;
        const temp = data.list[0].main.temp.toFixed(0);
        const tempF = (temp * 9 / 5 + 32).toFixed(0);
        const tempMin = data.list[0].main.temp_min.toFixed(0);
        const tempMax = data.list[0].main.temp_max.toFixed(0);
        const shortDesc = data.list[0].weather[0].description;

        // Build HTML elements and insert data
        let html = `<div class="cityContainer cityCard${this.instanceID}">
            <div class="weatherDesc">${shortDesc}</div>
            <div >
                <div>
                </div>
                <div class="tempAndCity">
                  <p class="weatherTemp" data-tooltip="Click to convert">${temp}°C</p>
                  <p class="cityName">${cityName}, ${region}, ${country}</p>
                </div>
            </div>
        </div>
        <div class="weatherForecast"></div>`;

        // Append the html to the page with the data
        $('.ww-wrapper .'+this.targetEl).append(html);
    
    // generate forecast sections and loop through the data for each day
        const nextDays = this.returnNextDays(3);
        let forecast = nextDays.map((nextDay, i) => { 
              return `<div class="forecastCard"><u><p>${nextDay}</p></u>
                  <p class="forecastMax">Max ${data.list[i+1].main.temp_max.toFixed(0)}°C</p>
                  <p class="forecastMin">Min ${data.list[i+1].main.temp_min.toFixed(0)}°C</p></div>`
          }).join('');
        $('.'+this.targetEl+' .weatherForecast').append(forecast);

        // Convert the temperature units on click.
        const $thisTemp = $('.'+this.targetEl+' .weatherTemp');
        $thisTemp.off('click').on('click', (e) => {
            if ($thisTemp.text().indexOf('C') > -1) {
                $thisTemp.text(tempF + '°F');
            } else {
                $thisTemp.text(temp + '°C');
            }
        });

    }

}
$(function() {
    const test = new GetWeatherAPI('weatherCard1'); 
});