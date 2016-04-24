var app = angular.module('cc98')

app.controller('receiveCtrl',
  function ($scope, $http, $rootScope) {
    $scope.error = undefined;

    $scope.doRefresh = function () {
      $scope.loadingShow();
      page = 0;
      $http.get('http://api.cc98.org/message?userName=' + '' + '&filter=Receive&from=0&to=9',
        { headers: { 'Authorization': 'Bearer ' + $rootScope.token } })
        .then(function successCallback(response) {
          $scope.receives = response.data;
        }, function errorCallback(response) {
          alert(response.data.message);
        })
        .finally(function () {
          $scope.$broadcast('scroll.refreshComplete');
          $scope.loadingHide();
        });
    };

    $scope.loadMore = function () {
      page = parseInt($scope.receives.length / 10);
      $http.get('http://api.cc98.org/message?userName=' + '' + '&filter=Receive&from=' + page * 10 + '&to=' + (page * 10 + 9),
        { headers: { 'Authorization': 'Bearer ' + $rootScope.token } })
        .then(function successCallback(response) {
          $scope.receives = $scope.receives.concat(response.data);
          $scope.error = false;
          if (response.data.length == 0) {
            $scope.error = true;
          }
        }, function errorCallback(response) {
          alert(response.data.message);
          $scope.error = true;
        })
        .finally(function () {
          $scope.$broadcast('scroll.infiniteScrollComplete');
        })

    };

  });