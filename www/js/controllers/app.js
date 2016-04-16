angular.module('cc98.controllers', ['ngCordovaOauth'])

  .controller('AppCtrl', function ($scope, $rootScope, $http, $ionicModal, $timeout, $cordovaOauth, $ionicLoading) {
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
    
    //载入动画
        $scope.loadingShow = function () {
            $ionicLoading.show({
                template: '<div class="loader"><svg class="circular"><circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10"/></svg></div>'
            });
        };
        $scope.loadingHide = function () {
            $ionicLoading.hide();
        };
        
  });
