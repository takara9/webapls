angular.module('input', [])
    .controller('InputController', ['$scope', '$http',function($scope, $http) {

    // 初期時点でコール
    $scope.master = {};

    // Saveのクリック時にコール
    $scope.update = function(user) {
        $scope.master = angular.copy(user);
	    $http.post('/user',JSON.stringify(user)).then(function(response) {
	        if (response.data) {
		        console.log("Post Data Submitted Successfully!");
		        
	        }
	    }, function (response) {
	         console.log("Service not Exists");
	    });
    };

    // Resetのクリック時にコール
    $scope.reset = function() {
        $scope.user = angular.copy($scope.master);
    };
    $scope.reset();
}]);
