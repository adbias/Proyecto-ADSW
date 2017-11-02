var app = angular.module('myApp', ['ngSanitize']);
var urlid = new URLSearchParams(document.location.search.substring(1));
app.controller('ChatSend', function($scope, $http) {
    $scope.sendMsg = function() {
        $http.post('/api/chat?id=' + urlid.get("SessionId"), {
            username: usernamelogged,
            msg: $scope.msg
        });
        $scope.msg = null;
    }
});
app.controller('ChatRecv', function ($scope, $http, $timeout) {
    $scope.lista = [];
    var retrieve = function() {
        $http.get('/api/chat?id=' + urlid.get("SessionId"))
            .then(function(response) {
                $scope.lista = response.data;
                $timeout(retrieve, 500);
            });
    };
    retrieve();
    //console.log($scope.lista);
});
app.controller('Timer', function($scope, $timeout) {
    $scope.timer = 300;
    var flag = false;
    var retrievetimer = function() {
        flag = false;
        if ($scope.timer > 0) {
            $scope.timer -= 1;
        } else {
            flag = true;
            return;
        }
        //$timeout(retrievetimer, 1000);
    };
    retrievetimer();
    $scope.addTime = function() {
        $scope.timer += 60;
        if (flag) {retrieve()}
    };
    $scope.resetTime = function() {
        $scope.timer = 300;
        if (flag) {retrieve()}
    };
    $scope.minutes = function() {
        return Math.floor($scope.timer/60);
    };
});

app.controller('Stages', function($scope, $http){
    $scope.actualStage = 0;
    refresh = function(){
        $scope.actualName = window.stages[$scope.actualStage][0];
        $scope.actualDesc = window.stages[$scope.actualStage][1];
    };
    refresh();
    $scope.left = function(){
        if ($scope.actualStage > 0) {
            $scope.actualStage--;
            refresh();
        }
        console.log("left")
    };
    $scope.right = function(){
        if ($scope.actualStage < window.stages.length-1) {
            $scope.actualStage++;
            refresh();
        }
        console.log("right")
    };

    $http.get('/api/soluciones').then(function(response) {
        $scope.form = response.data;

        console.log($scope.form);

        var hide = function(){
            $scope.url = "";
        };
        $scope.show = function(){
            $scope.url = url;
            $timeout(hide, 10000);
        };
        $scope.voto = {};
    });
    $scope.priorities = [];
    $scope.sendVoto = function(){
        $http.post('/api/addVotes', {
            IdSolutions:$scope.voto,
            stageId: window.stages[$scope.actualStage][2],
            priorities:$scope.priorities
    });
    };
    $scope.addPriority = function (i,j) {
        for (k=0;k<$scope.priorities.length;k++){
            if ($scope.priorities[k][0]===i){
                $scope.priorities[k] = [i,j];
                return;
            }
        }
        $scope.priorities.push([i,j]);
        console.log($scope.priorities)
        }
});
