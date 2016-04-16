var app = angular.module('cc98')

app.controller('topicCtrl',
    function($scope, $http, $stateParams, $sce, $rootScope, $ionicModal) {
        $scope.topicTitle = $stateParams.topicTitle;
        var topicId = $stateParams.id;
        $scope.topicId = topicId;
        var page = 0;
        $scope.doRefresh = function() {
            $scope.topic = {};
            $http.get('http://api.cc98.org/post/topic/' + topicId + '?from=0&to=9', 
            {headers:{'Authorization':'Bearer '+$rootScope.token}})
                .success(function(newItems) {
                    $scope.topic = newItems;
                    $scope.ubb();                    
                })
                .finally(function() {
                    $scope.$broadcast('scroll.refreshComplete');
                });
        };




        $scope.loadMore = function() {
            page = parseInt($scope.topic.length / 10); //页数，从0计数
            $http.get('http://api.cc98.org/post/topic/' + topicId + '?from=' + page * 10 + '&to=' + (page * 10 + 9), 
            {headers:{'Authorization':'Bearer '+$rootScope.token}})
                .success(function(newItems) {
                    $scope.topic = $scope.topic.concat(newItems);
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                    $scope.ubb();
                })
        };
        
        //UBB代码解析
        $scope.ubb = function() {
            var i;         
            for (i = parseInt(($scope.topic.length - 1) / 10)  * 10; i < $scope.topic.length; i++) {
                $scope.topic[i].content = $scope.topic[i].content.replace(/\r\n/g, "<BR>").replace(/\n/g,"<BR>");
                $scope.topic[i].content = ubbcode($scope.topic[i].content); 
                $scope.topic[i].content = ubbcode($scope.topic[i].content);               
            }
            
        };
        
                
        //回帖
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
            $http.post('http://api.cc98.org/post/topic/' + topicId, $scope.postData,
                { headers: { 'Authorization': 'Bearer ' + $rootScope.token } })
                .then(function successCallback(response) {
                    alert("回帖成功！");
                    $scope.closePost();
                }, function errorCallback(response) {
                    alert(response.data.message);
                })
        };

    });

