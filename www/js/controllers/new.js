angular.module('cc98')

.controller('newCtrl', function($scope, $http) {
    var page = 0;
  $scope.doRefresh = function() {
    $http.get('http://api.cc98.org/topic/new?from=' + page * 10 + '&to=' + (page * 10 + 9))
     .success(function(newItems) {
       $scope.new = newItems;
     })
     .finally(function() {
       // Stop the ion-refresher from spinning
       $scope.$broadcast('scroll.refreshComplete');
     });
  };
  
  $scope.loadMore = function() {
            page++;
            $http.get('http://api.cc98.org/topic/new/?from=' + page * 10 + '&to=' + (page * 10 + 9))
                .success(function(newItems) {
                    $scope.topic = $scope.topic.concat(newItems);

                })
                .finally(function() {
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                });
        };
});