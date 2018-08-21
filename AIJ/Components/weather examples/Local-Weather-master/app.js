//api key 3656d7b3242d336d2508e90499daceff

LocalWeather = angular.module('LocalWeather', [])

LocalWeather.controller('getWeather', ['$scope', '$http', function($scope,$http) {

	function getLocation(){
	    if(navigator.geolocation){
	      // console.log(navigator.geolocation.getCurrentPositon());
	      navigator.geolocation.getCurrentPosition(function(position) {
	        	console.log(position);
	        	$scope.lat = position.coords.latitude;
	        	$scope.lng = position.coords.longitude;
	        	$scope.Populate();
	   		});
	    } else {
      		alert('No Browser Supported geolocation');
    	}
	}

	$scope.Populate = function() {

		$http({
			method: 'GET',
			url : 'http://api.openweathermap.org/data/2.5/weather?APPID=3656d7b3242d336d2508e90499daceff',
			params: {
				lat: $scope.lat,
				lon: $scope.lng,
				units: 'imperial'
			}
		}).then(function success(response) {
			console.log('success', response);
			$scope.res = response.data;
		}, function error(response) {
			console.log('error', response);
		})
	}
	
	getLocation();

	$scope.unit = 'F'

	$scope.convert = function() {
		if ($scope.unit === 'F') {

			$scope.unit = 'C';
			$scope.res.main.temp = Math.floor(($scope.res.main.temp - 32) * (5/9));

		} else {
			$scope.unit = 'F'
			$scope.res.main.temp = Math.ceil(($scope.res.main.temp * (9/5)) + 32);
		}


	}

}])