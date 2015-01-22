angular.module('MainCtrl', []).controller('MainController', function($scope, socketFactory) {

	$scope.userLogin = function() {
		if ('' != $scope.login.name) {
			socketFactory.emit('userLogin', $scope.login.name);
			location.href = '#test';
		}
	}

});