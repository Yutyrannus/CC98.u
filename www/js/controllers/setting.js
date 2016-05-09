var app = angular.module('cc98.controllers')

app.controller('settingCtrl',
  function ($scope, storage) {
    $scope.themeColor = $scope.theme;
    $scope.changeTheme = function () {
      storage.set('theme', $scope.themeColor);
    }
  });
