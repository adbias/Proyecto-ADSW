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
    console.log($scope.lista);
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
        $timeout(retrievetimer, 1000);
    };
    retrievetimer();
    $scope.addTime = function() {
        $scope.timer += 60;
        if (flag) {retrieve()}
    };
    $scope.resetTime = function() {
        $scope.timer = new Date(300);
        if (flag) {retrieve()}
    };
    $scope.minutes = function() {
        return Math.floor($scope.timer/60);
    };
});
app.controller('Show', function($scope, $timeout, $http){
    var hide = function(){
        $scope.url = "";
    };
    $scope.show = function(){
        $scope.url = url;
        $timeout(hide, 10000)
    };
    $scope.showAlt = function(){
        $scope.form = "";
        $http.get('/api/soluciones')
            .then(function(response) {
                $scope.form = response;
            });
        console.log($scope.form);
    };
});