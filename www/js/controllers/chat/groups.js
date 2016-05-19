angular.module('cc98.controllers')

  .controller('groupsCtrl',
  function ($scope, $http, $rootScope, $stateParams, $ionicModal) {
    if ($stateParams) {
      var groupName = $stateParams.groupName;
    }

    $scope.groups = [];
    $scope.groupMsgs = [];
    
    var chatHub = $.connection.messageHub;
    $.connection.hub.url = "https://api.cc98.org/signalR";
    $.connection.hub.qs = { Authorization: "Bearer " + $rootScope.token };


    var start = function () {
      $.connection.hub.start().done(function () {
        $scope.getGroups();
      })
    }

    $scope.init = function () {
      start();
    }

    $scope.getGroups = function () {
      chatHub.server.getGroups().done(function (response) {
        $scope.groups = response;
        $scope.$broadcast('scroll.refreshComplete');
      })
        .fail(function (response) {
          console.error(response);
          $scope.$broadcast('scroll.refreshComplete');
        })
    }

    chatHub.client.groupCreated = function (response) {
      console.log("group create");
      $scope.groups.push(response);
    }

    chatHub.client.groupDestroyed = function (name) {
      console.log("group destory");
      for (var i = 0; i < $scope.groups.length; i++) {
        if ($scope.groups[i].name == name) {
          $scope.groups.splice(i, 1);
          break;
        }
      }
    }

    $scope.enter = function () {
      chatHub.server.enterGroup(groupName).done(function () {
        console.debug("enter success");
      })
        .fail(function (respnose) {
          console.error(respnose);
        })
        ;
    }

    chatHub.client.newGroupMessage = function (groupName, sender, content) {
      console.debug("newMess");
      var obj = { sender: sender, content: content };
      $scope.groupMsgs.push(obj);
    }
    
    //创建讨论组的modal
    $ionicModal.fromTemplateUrl('templates/chat/createGroup.html', {
      scope: $scope
    }).then(function (modal) {
      $scope.modal = modal;
    });

    $scope.closeCreate = function () {
      $scope.modal.hide();
    };

    $scope.modalShow = function () {
      $scope.modal.show();
      $scope.createGroupData = {};
    };
    
    //创建讨论组
    $scope.createGroup = function (){
      if ($scope.createGroupData.name){
      chatHub.server.createGroup($scope.createGroupData.name, $scope.createGroupData.title, $scope.createGroupData.description)
      .done(function(){
        console.debug("createGroup success");
        $scope.closeCreate();
      })
      .fail(function (response){
        console.log(response);
      })
      }
    }
    
  });