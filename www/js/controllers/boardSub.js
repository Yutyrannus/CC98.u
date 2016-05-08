var app = angular.module('cc98')

app.controller('boardSubCtrl',
  function ($scope, $http, $stateParams) {
    $scope.title = $stateParams.title;
    $scope.doRefresh = function () {
      var boardRootId = $stateParams.id;
      $http.get('http://api.cc98.org/board/' + boardRootId + '/subs')
        .success(function (newItems) {
          $scope.boardSubs = newItems;
        })
        .finally(function () {
          $scope.$broadcast('scroll.refreshComplete');
        });
    };

    //根据板块今日帖数的多少来确定label的颜色
    $scope.labelColor = function (postCount) {
      if (postCount != undefined) {
        if (postCount == 0)
          return "label-default";
        else if (postCount < 10)
          return "label-info";
        else if (postCount < 50)
          return "label-primary";
        else if (postCount < 100)
          return "label-success";
        else if (postCount < 200)
          return "label-energized";
        else if (postCount < 500)
          return "label-royal";
        else if (postCount < 1000)
          return "label-pink";
        else
          return "label-danger";
      }
    }

  });