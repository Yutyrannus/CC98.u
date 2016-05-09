angular.module('cc98', [
  'ionic',
  'cc98.controllers',
  'ionic-native-transitions'
  //'ionic-material'
])

  .run(function ($ionicPlatform) {
    $ionicPlatform.ready(function () {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      if (window.cordova && window.cordova.plugins.Keyboard) {
        //cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);

      }
      if (window.StatusBar) {
        // org.apache.cordova.statusbar required
        StatusBar.styleDefault();

      }
    });
  })

  //信任html代码，用于UBB代码显示
  .filter('to_trusted', ['$sce', function ($sce) {
    return function (text) {
      return $sce.trustAsHtml(text);
    };
  }])
  .filter('gender', function () {
    return function (gender) {
      if (gender == 0)
        return "<i class=\"icon ion-male positive\"></i>";
      else if(gender == 1)
        return "<i class=\"icon ion-female pink\"></i>";
        else
          return undefined;
    };
  })
  
  .config(function ($ionicNativeTransitionsProvider) {
    $ionicNativeTransitionsProvider.setDefaultOptions({
      duration: 400, // in milliseconds (ms), default 400,
      slowdownfactor: 4, // overlap views (higher number is more) or no overlap (1), default 4
      iosdelay: -1, // ms to wait for the iOS webview to update before animation kicks in, default -1
      androiddelay: -1, // same as above but for Android, default -1
      winphonedelay: -1, // same as above but for Windows Phone, default -1,
      fixedPixelsTop: 0, // the number of pixels of your fixed header, default 0 (iOS and Android)
      fixedPixelsBottom: 0, // the number of pixels of your fixed footer (f.i. a tab bar), default 0 (iOS and Android)
      triggerTransitionEvent: '$ionicView.afterEnter', // internal ionic-native-transitions option
      backInOppositeDirection: false // Takes over default back transition and state back transition to use the opposite direction transition to go back
    });
  })
  .config(function ($ionicNativeTransitionsProvider) {
    $ionicNativeTransitionsProvider.setDefaultTransition({
      type: 'slide',
      direction: 'left'
    });
  })
  .config(function ($ionicNativeTransitionsProvider) {
    $ionicNativeTransitionsProvider.setDefaultBackTransition({
      type: 'slide',
      direction: 'right'
    });
  })

  .config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider

      .state('app', {
        url: '/app',
        abstract: true,
        templateUrl: 'templates/menu.html',
        controller: 'AppCtrl'
      })

      .state('app.new', {
        url: '/new',
        views: {
          'menuContent': {
            templateUrl: 'templates/new.html',
            controller: 'newCtrl'
          }
        }
      })

      .state('app.hot', {
        url: '/hot',
        views: {
          'menuContent': {
            templateUrl: 'templates/hot.html',
            controller: 'hotCtrl'
          }
        }
      })

      .state('app.boardRoot', {
        url: '/boardRoot',
        views: {
          'menuContent': {
            templateUrl: 'templates/boardRoot.html',
            controller: 'boardRootCtrl'
          }
        }
      })

      .state('app.boardSub', {
        url: '/boardSub/:id&:title',
        views: {
          'menuContent': {
            templateUrl: 'templates/boardSub.html',
            controller: 'boardSubCtrl'
          }
        }
      })

      .state('app.topic', {
        url: '/topic/:id&*topicTitle',
        views: {
          'menuContent': {
            templateUrl: 'templates/topic.html',
            controller: 'topicCtrl'
          }
        }
      })

      .state('app.topics', {
        url: '/topics/:id&:boardTitle',
        views: {
          'menuContent': {
            templateUrl: 'templates/topics.html',
            controller: 'topicsCtrl'
          }
        }
      })

      .state('app.me', {
        url: '/me',
        views: {
          'menuContent': {
            templateUrl: 'templates/me.html',
            controller: 'loginCtrl'
          }
        }
      })

      .state('app.myBoard', {
        url: '/myBoard',
        views: {
          'menuContent': {
            templateUrl: 'templates/myBoard.html',
            controller: 'myBoardCtrl'
          }
        }
      })

      .state('app.receive', {
        url: '/receive',
        views: {
          'menuContent': {
            templateUrl: 'templates/messages/receive.html',
            controller: 'receiveCtrl'
          }
        }
      })

      .state('app.send', {
        url: '/send',
        views: {
          'menuContent': {
            templateUrl: 'templates/messages/send.html',
            controller: 'sendCtrl'
          }
        }
      })

      .state('app.chat', {
        url: '/chat',
        views: {
          'menuContent': {
            templateUrl: 'templates/messages/chat.html',
            controller: 'chatCtrl'
          }
        }
      })

      .state('app.message', {
        url: '/message/:messageId',
        views: {
          'menuContent': {
            templateUrl: 'templates/messages/message.html',
            controller: 'messageCtrl'
          }
        }
      })

      .state('app.setting', {
        url: '/setting',
        views: {
          'menuContent': {
            templateUrl: 'templates/setting.html',
            controller: 'settingCtrl'
          }
        }
      })
      ;

    $urlRouterProvider.otherwise('/app/boardRoot');

  });


