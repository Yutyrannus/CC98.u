angular.module('cc98')
  .controller('myBoardCtrl',
  function ($scope, $http, $rootScope) {
    $scope.doRefresh = function () {
      $http.get('http://api.cc98.org/me/customboards',
        { headers: { 'Authorization': 'Bearer ' + $rootScope.token } })
        .success(function (newItems) {
          $scope.myBoardIds = newItems;
          $scope.getBoardName();
        })
        .error(function (response) {
          alert(response.message);
        })
        .finally(function () {
          $scope.$broadcast('scroll.refreshComplete');
        });
    };

    $scope.getBoardName = function () {
      var myBoardUri = makeUri();
      $http.get('http://api.cc98.org/board' + myBoardUri)
        .success(function (newItems) {
          $scope.myBoards = newItems;
        })
    };

    var makeUri = function () {
      var uri = '?id[0]=' + $scope.myBoardIds[0];
      var i;
      for (i = 1; i < $scope.myBoardIds.length; i++) {
        uri += ('&id[' + i + ']=' + $scope.myBoardIds[i])
      }
      return uri;
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