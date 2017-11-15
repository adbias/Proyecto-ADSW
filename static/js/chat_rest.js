var app = angular.module('myApp', ['ngSanitize', 'chart.js', 'ngAnimate', 'ui.bootstrap', 'luegg.directives']);
var urlid = new URLSearchParams(document.location.search.substring(1));

/*app.controller("BarChart", function ($scope, $http) {
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

});*/

app.controller('ChatSend', function($scope, $http) {
    // Conexion por socket
    var socket = io.connect('http://localhost:3000');

    // Función para enviar activada por boton en la vista
    $scope.sendMsg = function() {
        // Comunicación por socket, envío el nuevo mensaje
        socket.emit('Chat', {username:usernamelogged, msg: $scope.msg});

        // Se guarda en la BD
        $http.post('/api/chat?id=' + urlid.get("SessionId"), {
            username: usernamelogged,
            msg: $scope.msg
        });

        // Clean input box (msg)
        $scope.msg = null;
    }

    /*
    $scope.sendMsg = function() {
        $http.post('/api/chat?id=' + urlid.get("SessionId"), {
            username: usernamelogged,
            msg: $scope.msg
        });
        $scope.msg = null;
    }
    */
});
app.controller('ChatRecv', function ($scope, $http, $timeout) {
    // Arreglo donde se guarda el chat
    $scope.lista = [];

    // Se cargan los guardados en la base de datos, la primera vez que llama al controlador
    $http.get('/api/searchChat?id=' + urlid.get("SessionId"))
        .then(function(response) {

            // Ordenar por fecha
            response.data.sort(function(o1,o2){
                return new Date(o1.createdAt).valueOf() < new Date(o2.createdAt).valueOf() ? -1 :
                    new Date(o1.createdAt).valueOf() > new Date(o2.createdAt).valueOf() ? 1 : 0;
            });

            for(var indice in response.data){
                $scope.lista.push(response.data[indice]);
            }
        });

    // Conexion por socket
    var socket = io.connect('http://localhost:3000');

    // Función que se llamará una y otra vez para ir actualizando el chat en tiempo real
    var retrieve = function() {
        socket.on('ChatIn', function (response) {
            if (response.msg !== 'undefined' && response.msg !== null){
                $scope.lista.push({username:response.username, msg:response.msg});
            }
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
        if ($scope.timer !== 300) {
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
        flag = false;
        if (flag) {retrieve()}
    };
    $scope.resetTime = function() {
        $scope.timer = 300;
        flag = false;
        paused = true;
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

app.controller('test', function($scope, $uibModalInstance){
    $uibModalInstance.close(close);
    $scope.algo = 'algo';
});

app.controller('Stages', function($scope, $http, $timeout, $uibModal){
    $scope.showAModal = function() {
        var modalInstance = $uibModal.open({
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            animation: true,
            templateUrl: "http://localhost:3000/test",
            windowTemplateUrl: "http://localhost:3000/test",
            controller: 'test',
        });

        modalInstance.result.then()

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

    var hide = function(){
        $scope.url = "";
    };
    $scope.show = function(){
        $scope.url = url;
        $timeout(hide, 10000);
    };
    $http.get('/api/soluciones').then(function(response) {
        $scope.form = response.data;
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
        console.log($scope.form[i].mechanism);
        $scope.mechDes = $scope.form[i].mechanism;
        $scope.resDes = $scope.form[i].result;
    }
});
