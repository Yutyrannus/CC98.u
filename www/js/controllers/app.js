angular.module('cc98.controllers', ['ngCordovaOauth'])

  .controller('AppCtrl', function ($scope, $rootScope, $http, $ionicModal, $timeout, $cordovaOauth) {
    $scope.cc98Login = function () {
      $cordovaOauth.cc98("f68e417e-2ac6-4462-a090-9b0ca701565d", ["all*"]).then(function (result) {
        $rootScope.token = result.access_token;
        $scope.getMe();
      }, function (error) {
        alert("Error : " + error);
      });

      $scope.getMe = function () {
        $http.get("http://api.cc98.org/me", { headers: { 'Authorization': 'Bearer ' + $rootScope.token } })
          .success(function (newItems) {
            $rootScope.user = newItems;
          });
      }
    };

    $scope.logOut = function () {
      $rootScope.token = undefined;
      $rootScope.user = undefined;
    };
  });
