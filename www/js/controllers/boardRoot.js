angular.module('cc98')

.controller('boardRootCtrl', function($scope, $http) {
  $scope.doRefresh = function() {
    $http.get('http://api.cc98.org/board/root')
     .success(function(newItems) {
       $scope.boardRoots = newItems;
     })
     .finally(function() {
       // Stop the ion-refresher from spinning
       $scope.$broadcast('scroll.refreshComplete');
     });
  };
});