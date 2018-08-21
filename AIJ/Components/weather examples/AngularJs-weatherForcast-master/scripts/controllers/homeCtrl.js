//<!--http://geobytes.com/free-ajax-cities-jsonp-api/-->

weatherApp.controller('homeCtrl', ['$scope', 'getWeather', function ($scope, getWeather) {
    function updateString() {
        $scope.city = getWeather.city;
        $scope.$watch('city', function () {
            getWeather.city = $("#search").val();
        });
    }

    $("#search").keyup(function(){updateString()});
    $("#search").click(function(){updateString()});

}]);
