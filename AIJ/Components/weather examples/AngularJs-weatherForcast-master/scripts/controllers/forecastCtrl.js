weatherApp.controller('forecastCtrl', ['$scope', '$resource', '$routeParams', 'getWeather', function ($scope, $resource, $routeParams, getWeather) {
    $scope.city = getWeather.city;
    $scope.daysToShow = $routeParams.daysToShow || '2';
    $scope.saved = [];
//    update saved

    for (var i = 0; i < localStorage.length; i++){
            $("#select").append($("<option>",{value: localStorage.key(i), text: localStorage.key(i)}));
        }


    $scope.weatherAPI = $resource("http://api.openweathermap.org/data/2.5/forecast/daily", {
        appid: "db8db266f429c62b43fc3e36ac95262f"
    }, {
        callback: "JSON_CALLBACK"
    }, {
        get: {
            method: "JSONP"
        }
    });

    $scope.weatherResult = $scope.weatherAPI.get({
        q: $scope.city,
        cnt: $scope.daysToShow
    });

    $scope.convertToCelcius = function (deg) {
        return Math.round(deg - 273.15);
    };
    $scope.convertToDate = function (dt) {
        return new Date(dt * 1000);
    };
    $scope.save = function(){
        var view = $('.save').html();
        localStorage.setItem($scope.city, view);
    }
    $scope.load = function(){

    }
    $("#select").change(function(){
        $(".save").empty();
        $(".save").append(localStorage.getItem($(this).val()));
        $scope.city = $(this).val();
    });
}]);
