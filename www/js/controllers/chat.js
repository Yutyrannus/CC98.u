angular.module('cc98.controllers')

  .controller('chatCtrl',
  function ($scope, $http, $rootScope) {

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
      })
        .fail(function (response) {
          console.error(response);
        })
    }

  });