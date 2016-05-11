var app = angular.module('cc98')

app.controller('messageCtrl',
  function ($scope, $http, $rootScope, $stateParams, $ionicModal) {
    var messageId = $stateParams.messageId;

    $scope.doRefresh = function () {
      $scope.loadingShow();
      $http.get('http://api.cc98.org/message/' + messageId,
        { headers: { 'Authorization': 'Bearer ' + $rootScope.token } })
        .then(function successCallback(response) {
          $scope.message = response.data;
          $scope.getReceiverName();
        }, function errorCallback(response) {
          alert(response.data.message);
        })
        .finally(function () {
          $scope.$broadcast('scroll.refreshComplete');
          $scope.loadingHide();
        });
    };
    
    //获得站短对象
    $scope.getReceiverName = function (){
      if($scope.message.receiverName != $rootScope.user.name){
        $scope.postData.receiverName = $scope.message.receiverName;
      }
      else {
        $scope.postData.receiverName = $scope.message.senderName;
      }
    };
    
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