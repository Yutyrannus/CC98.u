var app = angular.module('cc98')

app.controller('loginCtrl',
  function ($scope, $rootScope, $stateParams, $location, $http) {

    $scope.doRefresh = function () {
      $http.get("http://api.cc98.org/me", { headers: { 'Authorization': 'Bearer ' + $rootScope.token } })
        .success(function (newItems) {
          $rootScope.user = newItems;
        })
        .error(function (newItems) {
          alert("载入出错！");
        })
        .finally(function () {
          $scope.$broadcast('scroll.refreshComplete');
        });
    }
  });