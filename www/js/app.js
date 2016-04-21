// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('cc98', ['ionic', 'cc98.controllers'])


  
.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
     StatusBar.backgroundColorByName("blue");
      
    }
  });
})

//信任html代码，用于UBB代码显示
.filter('to_trusted', ['$sce', function($sce){
        return function(text) {
            return $sce.trustAsHtml(text);
        };
    }])

.config(function($stateProvider, $urlRouterProvider) {
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
        templateUrl: 'templates/boardRoot.html' ,
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
    url: '/topic/:id&:topicTitle',
    views: {
      'menuContent': {
        templateUrl: 'templates/topic.html',
        controller: 'topicCtrl'
      }
    }
  })
  
  .state('app.topics', {
    url: '/topics/:id',
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
  
  ;
    
  $urlRouterProvider.otherwise('/app/boardRoot');
  
});


