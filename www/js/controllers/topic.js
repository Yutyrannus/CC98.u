var app = angular.module('cc98')

app.controller('topicCtrl',
  function ($scope, $http, $stateParams, $sce, $rootScope, $ionicModal) {
    $scope.topic = {};
    $scope.error = undefined;
    $scope.topicTitle = $stateParams.topicTitle;
    var topicId = $stateParams.id;
    $scope.topicId = topicId;
    var page;
    $scope.doRefresh = function () {
      page = 0;
      $scope.loadingShow();
      $http.get('http://api.cc98.org/post/topic/' + topicId + '?from=0&to=9',
        { headers: { 'Authorization': 'Bearer ' + $rootScope.token } })
        .success(function (newItems) {
          $scope.topic = newItems;
          $scope.ubb();
        })
        .error(function (newItems) {
          alert("载入出错！");
        })
        .finally(function () {
          $scope.$broadcast('scroll.refreshComplete');
          $scope.loadingHide();
        });
    };


    $scope.loadMore = function () {
      page++; 
      $http.get('http://api.cc98.org/post/topic/' + topicId + '?from=' + page * 10 + '&to=' + (page * 10 + 9),
        { headers: { 'Authorization': 'Bearer ' + $rootScope.token } })
        .then(function successCallback(newItems) {
          $scope.topic = $scope.topic.concat(newItems.data);
          $scope.ubb();
          $scope.error = false;
          if(newItems.data.length == 0){
            $scope.error = true;
          }
        },
        function errorCallback(newItems){
          $scope.error = true;
          alert("载入出错！");
        })
        .finally(function () {
          $scope.$broadcast('scroll.infiniteScrollComplete');
        })
    };

    //UBB代码解析
    $scope.ubb = function () {
      var i;
      for (i = parseInt(($scope.topic.length - 1) / 10) * 10; i < $scope.topic.length; i++) {
        $scope.topic[i].content = $scope.topic[i].content.replace(/\r\n/g, "<BR>").replace(/\n/g, "<BR>");
        $scope.topic[i].content = ubbcode($scope.topic[i].content);
        $scope.topic[i].content = ubbcode($scope.topic[i].content);
      }

    };


    //回帖
    $scope.postData = {};
    $ionicModal.fromTemplateUrl('templates/post.html', {
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
      $http.post('http://api.cc98.org/post/topic/' + topicId, $scope.postData,
        { headers: { 'Authorization': 'Bearer ' + $rootScope.token } })
        .then(function successCallback(response) {
          alert("回帖成功！");
          $scope.closePost();
          $scope.loadMore();
        }, function errorCallback(response) {
          alert(response.data.message);
        })
    };

  });

