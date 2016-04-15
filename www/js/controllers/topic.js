var app = angular.module('cc98')

app.controller('topicCtrl',
    function($scope, $http, $stateParams, $sce, $rootScope) {
        $scope.topicTitle = $stateParams.topicTitle;
        var topicId = $stateParams.id;
        $scope.topicId = topicId;
        var page = 0;
        $scope.doRefresh = function() {
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

    });

