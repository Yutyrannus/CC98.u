angular.module('cc98.controllers', [
  'ngCordovaOauth',
  'yaru22.angular-timeago'
])

  .controller('AppCtrl', function ($scope, $rootScope, $http, $ionicModal, $timeout, $cordovaOauth, $ionicLoading, $ionicNavBarDelegate, timeAgo) {
    
    //时间过滤器中文支持
    timeAgo.settings.strings.zh_CN = {      
          wordSeparator: '',
          prefixAgo: null,
          prefixFromNow: null,
          suffixAgo: '前',
          suffixFromNow: 'from now',
          seconds: '小于1分钟',
          minute: '1分钟',
          minutes: '%d分钟',
          hour: '1小时',
          hours: ' %d小时',
          day: '1天',
          days: '%d天',
          month: '1月',
          months: '%d月',
          year: '1年',
          years: '%d年',
          numbers: []
    };
    timeAgo.settings.overrideLang = 'zh_CN';
    
    //登录
    $scope.cc98Login = function () {
      $cordovaOauth.cc98("f68e417e-2ac6-4462-a090-9b0ca701565d", ["all*"]).then(function (result) {
        $rootScope.token = result.access_token;
        $scope.getMe();
      }, function (error) {
        alert("Error : " + error);
      });
    };

    //获取个人信息
    $scope.getMe = function () {
      $http.get("http://api.cc98.org/me", { headers: { 'Authorization': 'Bearer ' + $rootScope.token } })
        .success(function (newItems) {
          $rootScope.user = newItems;
        });
    }

    $scope.logOut = function () {
      $rootScope.token = undefined;
      $rootScope.user = undefined;
    };

    //载入动画
    $scope.loadingShow = function () {
      $ionicLoading.show({
        template: '<div class="loader"><svg class="circular"><circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10"/></svg></div>'
      });
    };
    $scope.loadingHide = function () {
      $ionicLoading.hide();
    };

    $scope.setting = {};
    
    $scope.showNavBar = function(show) {
    $ionicNavBarDelegate.showBar(show);
  }
  
  });
