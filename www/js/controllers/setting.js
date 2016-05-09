var app = angular.module('cc98.controllers')

app.controller('settingCtrl',
  function ($scope, $rootScope) {
    $scope.theme = 0;
    $rootScope.setting = {};
    $rootScope.theme = 'positive';
    $scope.changeTheme = function() {
        console.log($scope.theme);
        console.log($rootScope.theme);
        $rootScope.theme = $scope.theme;
    }
  });
  
  app.factory('setting', function(){
    return {};
});