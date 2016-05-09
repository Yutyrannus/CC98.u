var app = angular.module('cc98.controllers')

app.controller('loginCtrl',
  function ($scope, $rootScope, $stateParams, $location, $http, storage) {

    $scope.doRefresh = function () {
      $http.get("http://api.cc98.org/me", { headers: { 'Authorization': 'Bearer ' + $rootScope.token } })
        .success(function (newItems) {
          $rootScope.user = newItems;
          storage.set('userInfo',newItems);
        })
        .error(function (newItems) {
          alert("载入出错！");
        })
        .finally(function () {
          $scope.$broadcast('scroll.refreshComplete');
        });
    }
  });