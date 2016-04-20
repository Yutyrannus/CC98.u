angular.module('cc98')

  .controller('boardRootCtrl', function ($scope, $http) {
    $scope.doRefresh = function () {
      $http.get('http://api.cc98.org/board/root')
        .success(function (newItems) {
          $scope.boardRoots = newItems;
        })
        .error(function (newItems) {
          alert("载入出错！");
        })
        .finally(function () {
          $scope.$broadcast('scroll.refreshComplete');
        });
    };
  });