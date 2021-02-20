var searchBar = $("#search-bar");
var searchButton = $("#search-btn");
var searchHistory = $("#search-history");
var weatherCol = $("#weather-col");

var apiKey = "913db2d2e0e028d3282906a34005c24d";

var tempStoredSearches = localStorage.getItem("storedSearches");
if (tempStoredSearches != null)
    storedSearches = tempStoredSearches.split(",");

//Creates current date variable
var today = new Date();
var currentDate = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();

function populateCurrentWeather() {

    $.ajax({
        url: currentWeatherUrl,
        method: "GET"
    }).then(function (response) {

        //Object to store current weather data
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