angular.module('list', [])
    .controller('listController', function($scope, $http) {

    $http.get('/users').
        then(function(response) {
            $scope.users = response.data;
            console.log("response = " + response.data);
        });
});
