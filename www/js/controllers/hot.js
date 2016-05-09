'use strict';

angular.module('cc98.controllers')

.controller('hotCtrl', function($scope, $http) {
  $scope.doRefresh = function() {
    $http.get('http://api.cc98.org/topic/hot')
     .success(function(newItems) {
       $scope.hot = newItems;
     })
     .finally(function() {
       $scope.$broadcast('scroll.refreshComplete');
     });
  };
});