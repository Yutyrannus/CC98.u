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
    $ionicScrollDelegate) {

    $scope.topic = {};
    $scope.noMore = undefined;
    $scope.topicTitle = $stateParams.topicTitle;
    var replyCount = parseInt($stateParams.replyCount);
    var topicId = $stateParams.id;

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
      var topicLength = $scope.topic[0].floor + $scope.topic.length - 1;
      $http.get('http://api.cc98.org/post/topic/' + topicId + '?from=' + topicLength + '&to=' + (topicLength + 9),
        { headers: { 'Authorization': 'Bearer ' + $rootScope.token } })
        .then(function successCallback(newItems) {
          $scope.topic = $scope.topic.concat(newItems.data);
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
        template: '共' + (replyCount + 1) + '楼',
        inputPlaceholder: '',
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
    $scope.preview = function () {
      $scope.isPreview = !$scope.isPreview;
    }
    $ionicModal.fromTemplateUrl('templates/postTopic.html', {
      scope: $scope
    }).then(function (modal) {
      $scope.modal = modal;
    });

    $scope.closePost = function () {
      $scope.isPreview = false;
      $scope.modal.hide();
    };

    $scope.post = function () {
      $scope.postData = {};
      $scope.isPreview = false;
      $scope.popover.hide();
      $scope.modal.show();
    };
    $scope.doPost = function () {
      if ($scope.postData.content){
      $http.post('http://api.cc98.org/post/topic/' + topicId, $scope.postData,
        { headers: { 'Authorization': 'Bearer ' + $rootScope.token } })
        .then(function successCallback(response) {
          alert("回帖成功！");
          $scope.closePost();
          $scope.loadMore();
        }, function errorCallback(response) {
          alert(response.data.message);
        })
      }
      else alert("内容不能为空！");
    };

    //引用(更新为md格式)
    $scope.quote = function (index) {
      $scope.postData = {};
      $scope.modal.show();
      $scope.postData.contentType = 1;
      $scope.postData.content = "> *以下是引用 **" +
        ($scope.topic[index].userName || "匿名用户") +
        "** 在 **" +
        $scope.topic[index].time.replace("T", " ").replace(/-/g, "/") +
        "** 的发言：*" +
        "\r\n> " +
        $scope.topic[index].content.replace(/\n|\r\n/g, "\r\n> ") +
        "\r\n\r\n";
    };

    //popover，用于显示右下的多个fab按钮
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

