var app = angular.module('cc98.controllers')

app.controller('topicCtrl',
  function (
    $scope,
    $http,
    $stateParams,
    $rootScope,
    $ionicModal,
    $ionicPopover,
    $ionicPopup,
    $ionicNavBarDelegate,
    $ionicScrollDelegate ) {
      
    $scope.topic = {};
    $scope.noMore = undefined;
    $scope.topicTitle = $stateParams.topicTitle;
    var replyCount = parseInt($stateParams.replyCount);
    var topicId = $stateParams.id;
    $scope.topicId = topicId;
    var page;

    $scope.setTitle = function () {
      $ionicNavBarDelegate.title($scope.topic[0].title);
    }

    //刷新
    $scope.doRefresh = function () {
      $scope.loadingShow();
      $http.get('http://api.cc98.org/post/topic/' + topicId + '?from=0&to=9',
        { headers: { 'Authorization': 'Bearer ' + $rootScope.token } })
        .success(function (newItems) {
          $scope.topic = newItems;
          ubb();
          getUser();
        })
        .error(function (newItems) {
          alert("载入出错！");
        })
        .finally(function () {
          $scope.$broadcast('scroll.refreshComplete');
          $scope.loadingHide();
        });
    };

    //加载更多帖子
    $scope.loadMore = function () {
      page = parseInt($scope.topic.length / 10);
      $http.get('http://api.cc98.org/post/topic/' + topicId + '?from=' + $scope.topic.length + '&to=' + (page * 10 + 9),
        { headers: { 'Authorization': 'Bearer ' + $rootScope.token } })
        .then(function successCallback(newItems) {
          $scope.topic = $scope.topic.concat(newItems.data);
          ubb();
          getUser();
          $scope.noMore = false;
          if (newItems.data.length == 0) {
            $scope.noMore = true;
          }
        },
        function errorCallback(newItems) {
          $scope.noMore = true;
          alert("载入出错！");
        })
        .finally(function () {
          $scope.$broadcast('scroll.infiniteScrollComplete');
        })
    };

    //回到顶部
    $scope.scrollTop = function () {
      $ionicScrollDelegate.scrollTop();
      $scope.popover.hide();
    };

    //跳转到某楼
    $scope.jump = function () {
      $scope.popover.hide();
      $ionicPopup.prompt({
        title: '输入要跳转的楼层',
        template: '共' + (replyCount+1) + '楼',
        inputPlaceholder: '楼层',
        cancelText: '取消',
        okText: '确定',
        okType: 'button-' + $scope.theme
      }).then(function (floor) {
        if (floor) {
          jumpTo(floor);
          $ionicScrollDelegate.scrollTop();
        }
      });
    }

    var jumpTo = function (floor) {
      floor -= 1;
      $http.get('http://api.cc98.org/post/topic/' + topicId + '?from=' + floor + '&to=' + (floor + 9),
        { headers: { 'Authorization': 'Bearer ' + $rootScope.token } })
        .then(function successCallback(newItems) {
          $scope.topic = newItems.data;
          ubb();
          getUser();
          $scope.noMore = false;
          if (newItems.data.length == 0) {
            $scope.noMore = true;
            alert("楼层不存在！");
          }
        },
        function errorCallback(newItems) {
          $scope.noMore = true;
          alert("载入出错！");
        })
    }

    //UBB代码解析
    var ubb = function () {
      var i, j;
      for (i = parseInt(($scope.topic.length - 1) / 10) * 10; i < $scope.topic.length; i++) {
        $scope.topic[i].content = $scope.topic[i].content.replace(/\r\n/g, "<BR>").replace(/\n/g, "<BR>");
        var currubb = $scope.topic[i].content;
        var preubb = currubb;
        for (j = 0; j < 10; j++) {
          if ((currubb = ubbcode(preubb)) != preubb) {
            preubb = currubb;
          }
          else
            break;
          $scope.topic[i].content = currubb;
        }
      }

    };

    //获取用户信息（头像，性别等）
    var getUser = function () {
      var num;
      for (num = parseInt(($scope.topic.length - 1) / 10) * 10; num < $scope.topic.length; num++) {
        if ($scope.topic[num].userId)
          getUserInfo(num);
      };
    }

    var getUserInfo = function (num) {
      $http.get('http://api.cc98.org/user/' + $scope.topic[num].userId)
        .success(function (newItems) {
          $scope.topic[num].userInfo = newItems;
        });
    }

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
      $scope.popover.hide();
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

    //popover
    $ionicPopover.fromTemplateUrl('templates/popover/popover.html', {
      scope: $scope
    }).then(function (popover) {
      $scope.popover = popover;
    });

    $scope.openPopover = function ($event) {
      $scope.popover.show($event);
    };
    $scope.closePopover = function () {
      $scope.popover.hide();
    };

  });

