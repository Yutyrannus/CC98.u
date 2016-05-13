angular.module('cc98.controllers', [
  'ngCordovaOauth',
  'yaru22.angular-timeago',
  'cc98.services',
  'cc98.filters'
])

  .controller('AppCtrl', function ($scope, $rootScope, $http, $ionicModal, $timeout, $cordovaOauth, $ionicLoading, $ionicNavBarDelegate, $interval, timeAgo, storage) {

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
    var refresh_token, expires_in;
    var client_id = 'f68e417e-2ac6-4462-a090-9b0ca701565d';
    var client_secret = 'e6a44e48-2707-4e95-8430-4c44d93814ed';
    var redirect_uri = 'http://localhost/callback';

    $scope.cc98Login = function () {
      $cordovaOauth.cc98(client_id, ["all*"])
        .then(function (result) {
          getToken(result.code);
        }, function (error) {
          alert("Error : " + error);
        });
    };

    var getToken = function (code) {
      var data = {
        grant_type: 'authorization_code',
        client_id: client_id,
        client_secret: client_secret,
        redirect_uri: redirect_uri,
        code: code
      };
      data = queryString.stringify(data);
      $http.post('https://login.cc98.org/oauth/token', data,
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' } })
        .success(function (response) {
          $rootScope.token = response.access_token;
          storage.set('access_token', response.access_token);
          storage.set('refresh_token', response.refresh_token);
          getMe(response.access_token);
        })
        .error(function (response) {
          alert("登录出错");
        })
    };

    var refreshToken = function () {
      if (storage.get('refresh_token')) {
        var data = {
          grant_type: 'refresh_token',
          client_id: client_id,
          client_secret: client_secret,
          redirect_uri: redirect_uri,
          refresh_token: storage.get('refresh_token')
        };
        data = queryString.stringify(data);
        $http.post('https://login.cc98.org/oauth/token', data,
          { headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' } })
          .success(function (response) {
            $rootScope.token = response.access_token;
            storage.set('refresh_token', response.refresh_token);
          })
          .error(function (response) {
            storage.remove('userInfo');
            $rootScope.user = {};
            $rootScope.token = undefined;
            alert("刷新令牌出错，请重新登录");            
          })
      }
    };

    //获取个人信息
    var getMe = function (token) {
      $http.get("http://api.cc98.org/me", { headers: { 'Authorization': 'Bearer ' + token } })
        .success(function (newItems) {
          $rootScope.user = newItems;
          storage.set('userInfo', newItems);
        })
    }

    //登出
    $scope.logOut = function () {
      $rootScope.token = undefined;
      $rootScope.user = undefined;
      storage.remove('refresh_token');
      storage.remove('userInfo');
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

    $scope.showNavBar = function (show) {
      $ionicNavBarDelegate.showBar(show);
    }
    
    //获取主题颜色
    $scope.theme = storage.get('theme') || 'positive';
    
    //登录相关
    if (storage.get('refresh_token'))
        refreshToken();

    if (storage.get('userInfo'))
      $rootScope.user = storage.get('userInfo');
    
    //令牌到期后自动刷新
    var interval = $interval(function () {
      refreshToken();
    }, 870000);

  });
