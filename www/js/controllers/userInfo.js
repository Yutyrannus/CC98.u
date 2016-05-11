var app = angular.module('cc98.controllers')

app.controller('userInfoCtrl',
  function ($scope, $stateParams, $http, $ionicModal) {
    var id = $stateParams.id;
    $scope.doRefresh = function () {
      $http.get("http://api.cc98.org/user/" + id)
        .success(function (newItems) {
          $scope.user = newItems;
        })
        .error(function (newItems) {
          alert("载入出错！");
        })
        .finally(function () {
          $scope.$broadcast('scroll.refreshComplete');
        });
    }

    //发短消息
    $scope.postData = {};
    $ionicModal.fromTemplateUrl('templates/messages/postMessage.html', {
      scope: $scope
    }).then(function (modal) {
      $scope.modal = modal;
    });

    $scope.closePost = function () {
      $scope.modal.hide();
    };

    $scope.post = function () {
      $scope.modal.show();
      $scope.postData.receiverName = $scope.user.name;
    };
    $scope.doPost = function () {
      $http.post('http://api.cc98.org/message/', $scope.postData,
        { headers: { 'Authorization': 'Bearer ' + $rootScope.token } })
        .then(function successCallback(response) {
          alert("发送短消息成功！");
          $scope.closePost();
        }, function errorCallback(response) {
          alert(response.data.message);
        })
    };

  });