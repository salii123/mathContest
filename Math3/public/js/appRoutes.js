angular.module('appRoutes', []).config(['$routeProvider', '$locationProvider',
	function($routeProvider, $locationProvider) {

	$routeProvider

		// home page
		.when('/', {
			templateUrl: 'pages/home.html',
			controller: 'MainController'
		})

		.when('/test', {
			templateUrl: 'pages/test.html',
			controller: 'TestController'
		})
			.when('/about', {
			templateUrl: 'pages/about.html',
			controller: 'AboutController'
		})

		.when('/history', {
			templateUrl: 'pages/geek.html',
			controller: 'GeekController'	
		});

}]);