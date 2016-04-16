angular.module('cc98')

  .controller('newCtrl', function ($scope, $http) {
    var page;
    $scope.doRefresh = function () {
      $scope.loadingShow();
      page = 0;
      $http.get('http://api.cc98.org/topic/new?from=0&to=9')
        .then(function successCallBack(response) {
          $scope.news = response.data;
        }, function errorCallback(response) {
          alert(response.data.message);
        })
        .finally(function () {
          $scope.$broadcast('scroll.refreshComplete');
          $scope.loadingHide();
        });
    };

    $scope.loadMore = function () {
      page++;
      $http.get('http://api.cc98.org/topic/new/?from=' + page * 10 + '&to=' + (page * 10 + 9))
        .then(function successCallBack(response) {
          $scope.news = $scope.news.concat(response.data);
        }, function errorCallback(response) {
          alert(response.data.message);
        })
        .finally(function () {
          $scope.$broadcast('scroll.infiniteScrollComplete');
        });
    };
  });