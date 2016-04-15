var app = angular.module('cc98')

app.controller('boardSubCtrl',
    function($scope, $http, $stateParams) {
        $scope.title = $stateParams.title;
        $scope.doRefresh = function() {
            var boardRootId = $stateParams.id;
            $http.get('http://api.cc98.org/board/' + boardRootId +'/subs')
                .success(function(newItems) {
                    $scope.boardSub = newItems;
                })
                .finally(function() {
                    $scope.$broadcast('scroll.refreshComplete');
                });
        };
    });