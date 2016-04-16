var app = angular.module('cc98')

app.controller('topicsCtrl',
    function ($scope, $http, $stateParams, $rootScope, $ionicModal) {
        $scope.boardTitle = $stateParams.boardTitle;
        var topicsId = $stateParams.id;
        var page = 0;
        $scope.doRefresh = function () {
            $http.get('http://api.cc98.org/topic/board/' + topicsId + '?from=0&to=9',
                { headers: { 'Authorization': 'Bearer ' + $rootScope.token } })
                .success(function (newItems) {
                    $scope.topics = newItems;
                })
                .finally(function () {
                    $scope.$broadcast('scroll.refreshComplete');
                });
        };

        $scope.loadMore = function () {
            page++;
            $http.get('http://api.cc98.org/topic/board/' + topicsId + '?from=' + page * 10 + '&to=' + (page * 10 + 9))
                .success(function (newItems) {
                    $scope.topics = $scope.topics.concat(newItems);
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                })

        };
        
        //发帖
        $scope.postData = {};
        $ionicModal.fromTemplateUrl('templates/post.html', {
            scope: $scope
        }).then(function (modal) {
            $scope.modal = modal;
        });

        $scope.closePost = function () {
            $scope.modal.hide();
        };

        $scope.post = function () {
            $scope.modal.show();
        };
        $scope.doPost = function () {
            $http.post('http://api.cc98.org/topic/board/' + topicsId, $scope.postData,
                { headers: { 'Authorization': 'Bearer ' + $rootScope.token } })
                .then(function successCallback(response) {
                    alert("发帖成功！");
                    $scope.closePost();
                }, function errorCallback(response) {
                    alert(response.data.message);
                })
        };
    });