'use strict';

angular.module('cc98')

.controller('hotCtrl', function($scope, $http) {
  $scope.doRefresh = function() {
    $http.get('http://api.cc98.org/topic/hot')
     .success(function(newItems) {
       $scope.hot = newItems;
     })
     .finally(function() {
       // Stop the ion-refresher from spinning
       $scope.$broadcast('scroll.refreshComplete');
     });
  };
});