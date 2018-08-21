//module
var weatherApp = angular.module('weatherApp', ['ngRoute', 'ngResource']);

//routing
weatherApp.config(function ($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'partials/home.html',
            controller: 'homeCtrl'
        })
        .when('/forecast', {
            templateUrl: 'partials/forecast.html',
            controller: 'forecastCtrl'
        })
    .when('/forecast/:daysToShow', {
        templateUrl: 'partials/forecast.html',
        controller: 'forecastCtrl'
    });
});

weatherApp.service('getWeather', function () {
    this.city = "New York,NY";
});
