var app = angular.module('myApp', ['ngSanitize', 'chart.js', 'ngAnimate', 'angularModalService']);
var urlid = new URLSearchParams(document.location.search.substring(1));

app.controller("BarChart", function ($scope, $http) {
    $http.get('/api/getNamSol').then(function (response) {
        $scope.series = ['Soluciones elegidas'];

        var arr=[];
        $scope.form = response.data;
        for(i in $scope.form){
            arr.push($scope.form[i].name);
        }
        $scope.labels = arr;


        $scope.data = [
            [65, 59, 80, 81, 56, 55, 50,65, 59, 80, 81, 56, 55, 40, 53, 48, 90],
        ];
    });
    /*
    $scope.labels = ['2006', '2007', '2008', '2009', '2010', '2011', '2012','2013','2014','2015'];
    $scope.series = ['Series A'];

    $scope.data = [
        [65, 59, 80, 81, 56, 55, 40],
    ];
    */
});

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
});
app.controller('Timer', function($scope, $timeout) {
    $scope.timer = 300;
    var flag = false;
    var pause = true;
    var socket = io.connect('http://localhost:3000');
    var retrievetimer = function() {
        flag = false;
        if ($scope.timer > 0 && !pause) {
            $scope.timer -= 1;
        } else if ($scope.timer <= 0 ) {
            flag = true;
            return;
        }
        if ($scope.timer != 300) {
            socket.emit('timeNow', {
                hour: Math.floor($scope.timer / 3600),
                m: Math.floor($scope.timer / 60),
                seg: Math.floor($scope.timer % 60)
            });
        }
        $timeout(retrievetimer, 1000);
    };
    retrievetimer();
    $scope.addTime = function() {
        $scope.timer += 300;
        if (flag) {retrieve()}
    };
    $scope.resetTime = function() {
        $scope.timer = 300;
        if (flag) {retrieve()}
    };

    $scope.starting = function(){
        pause = false;
        return Math.floor($scope.timer/60);
    };
    $scope.minutes = function() {
        return Math.floor($scope.timer/60);
    };
    $scope.sit = function(){
      if (!pause) pause = true;
    };

});

app.controller('test', function($scope, close){
    $scope.close = close;
    $scope.algo = algo;
});

app.controller('Stages', function($scope, $http, $timeout, ModalService){
    $scope.showAModal = function() {

        // Just provide a template url, a controller and call 'showModal'.
        ModalService.showModal({
            template:
            "<div style='z-index:1000;background-color: rgba(0,0,0,0.2);width: 100%;height: 100%;'>" +
                "<div style='background-color: white;width: 100px;height: 100px;'>"+
                    "{{algo}}" +
                "</div>"+
            "</div>",
            controller: 'test'
        }).then(function(modal) {
            // The modal object has the element built, if this is a bootstrap modal
            // you can call 'modal' to show it, if it's a custom modal just show or hide
            // it as you need to.
            modal.close.then(function(result) {
                console.log("woo");
            });
        });

    };
    $scope.actualStage = 0;
    $scope.priorities = [];
    refresh = function(){
        $scope.actualName = window.stages[$scope.actualStage][0];
        $scope.actualDesc = window.stages[$scope.actualStage][1];
        $scope.voto = {};
        $scope.priorities =[];
        for (i=0;i<17;i++){
            $scope.priorities.push(["",""])
        }
    };
    refresh();
    $scope.left = function(){
        if ($scope.actualStage > 0) {
            $scope.actualStage--;
        } else {
            $scope.actualStage = window.stages.length-1;
        }
        $scope.mostrar = 'mostrar1';
        $timeout(function(){$scope.mostrar = 'mostrar2';refresh();}, 200);
        console.log("left")
    };
    $scope.right = function(){
        if ($scope.actualStage < window.stages.length-1) {
            $scope.actualStage++;
        } else {
            $scope.actualStage = 0;
        }
        $scope.mostrar = 'mostrar1';
        $timeout(function(){$scope.mostrar = 'mostrar2';refresh();}, 200);
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
    $scope.sendVoto = function(){
        $http.post('/api/addVotes', {
            IdSolutions:$scope.voto,
            stageId: window.stages[$scope.actualStage][2],
            priorities:$scope.priorities
    });
    };
    $scope.addPriority = function (i,j) {
        $scope.priorities[i]=([i,j]);
        console.log($scope.priorities)
        };
    $scope.fooVoto = function(i) {
        $scope.voto[i] = 1;
        console.log("wowoowowowowo")
    }
});
