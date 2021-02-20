var searchBar = $("#search-bar");
var searchButton = $("#search-btn");
var searchHistory = $("#search-history");
var weatherCol = $("#weather-col");

//open weather api key
var apiKey = "913db2d2e0e028d3282906a34005c24d";

var tempStoredSearches = localStorage.getItem("storedSearches");
if (tempStoredSearches != null)
    storedSearches = tempStoredSearches.split(",");


var today = new Date();
var currentDate = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();

function populateCurrentWeather() {

    $.ajax({
        url: currentWeatherUrl,
        method: "GET"
    }).then(function (response) {


        var currentWeatherObj = {
            location: response.name,
            date: currentDate,
            weatherIcon: response.weather[0].icon,
            temperature: Math.round(response.main.temp),
            humidity: response.main.humidity,
            wind: response.wind.speed,
            uvIndex: 0,
            uvIntensity: ""
        };

        
        currentWeatherObj.date = formatDates(currentWeatherObj.date);

         
        var latitude = response.coord.lat;
        var longitude = response.coord.lon;
        var currentUvUrl = "https://api.openweathermap.org/data/2.5/uvi?lat=" + latitude + "&lon=" + longitude + "&appid=" + apiKey;

        $.ajax({
            url: currentUvUrl,
            method: "GET"
        }).then(function (response2) {

            currentWeatherObj.uvIndex = response2.value;

           
            if (currentWeatherObj.uvIndex >= 8)
                currentWeatherObj.uvIntensity = "high";
            else if (currentWeatherObj.uvIndex < 3)
                currentWeatherObj.uvIntensity = "low";
            else
                currentWeatherObj.uvIntensity = "medium";
            
                var currentWeatherCard = $('<div class="card"><div class="card-body"><h5 class="card-title">' + currentWeatherObj.location + ' (' + currentWeatherObj.date + ') ' +
                '<span class="badge badge-primary"><img id="weather-icon" src="http://openweathermap.org/img/wn/' + currentWeatherObj.weatherIcon + '@2x.png"></span></h5>' +
                '<p class="card-text">Temperature: ' + currentWeatherObj.temperature + ' °F</p>' +
                '<p class="card-text">Humidity: ' + currentWeatherObj.humidity + '%</p>' +
                '<p class="card-text">Wind Speed: ' + currentWeatherObj.wind + ' MPH</p>' +
                '<p class="card-text">UV Index: <span class="badge badge-secondary ' + currentWeatherObj.uvIntensity + '">' + currentWeatherObj.uvIndex + '</span>')
            $("#weather-col").append(currentWeatherCard);
        });

        renderStoredSearches();

    });
}

function populateWeatherForecast() {

    var fiveDayForecastArray = [];

    //Five day forecast API call
    $.ajax({
        url: forecastUrl,
        method: "GET"
    }).then(function (response) {

        console.log(response);