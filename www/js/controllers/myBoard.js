angular.module('cc98')
    .controller('myBoardCtrl',
    function ($scope, $http, $rootScope) {
        $scope.doRefresh = function () {
            $http.get('http://api.cc98.org/me/customboards',
            {headers:{'Authorization':'Bearer '+$rootScope.token}})
                .success(function (newItems) {
                    $scope.myBoardIds = newItems;
                    $scope.getBoardName();
                })
                .finally(function () {
                    $scope.$broadcast('scroll.refreshComplete');
                });
        };
        
        $scope.getBoardName = function(){
            var myBoardUri = makeUri();
            $http.get('http://api.cc98.org/board' + myBoardUri)
                .success(function (newItems) {
                    $scope.myBoards = newItems;
                })
        };
        
        var makeUri = function(){
            var uri = '?id[0]=' + $scope.myBoardIds[0];
            var i;
            for (i = 1; i < $scope.myBoardIds.length; i++){
                uri += ('&id[' + i + ']=' + $scope.myBoardIds[i])
            }
            return uri;
        };
    });