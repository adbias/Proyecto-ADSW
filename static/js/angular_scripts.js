var app = angular.module('myApp', ['ngSanitize', 'chart.js', 'ngAnimate', 'ui.bootstrap', 'luegg.directives']);
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
    // Conexion por socket
    var socket = io.connect('http://localhost:3000');

    // Función para enviar activada por boton en la vista
    $scope.sendMsg = function() {
        // Comunicación por socket, envío el nuevo mensaje
        socket.emit('Chat', {username:usernamelogged, msg: $scope.msg,room:urlid.get("SessionId")});

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
            if (response.msg !== 'undefined' && response.msg !== null && response.room ===urlid.get("SessionId")){
                $scope.lista.push({username:response.username, msg:response.msg});
            }
        });
    };
    retrieve();

});

app.controller('showShare', function($scope, $timeout, $http, $uibModal, $templateCache) {
    $scope.showShare = function(modal) {
        $scope.url = url;
        $uibModal.open({
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            templateUrl: "http://localhost:3000/"+modal,
            windowTemplateUrl: "http://localhost:3000/template",
            controller: 'Share',
            scope: $scope
        }).result.then(function(result){

            //console.log(result);
        });
    };
});

app.controller('Share', function($scope,$uibModalInstance){
    //console.log("Usando controlador Share");
    $scope.copyText = function (){
        var copiedText = document.getElementById("myInput");
        copiedText.select();
        document.execCommand("Copy");
    };
    $scope.getLink = function() {
        return $scope.url;
    }
    $scope.cancel = function (){
        $uibModalInstance.dismiss('cancel');
    };
});

app.controller('viewAll',function ($scope,$uibModalInstance,$http) {
    $scope.lista = [];
    $http.get('api/Usuarios?idSesion='+urlid.get("SessionId")).then(function (ret) {
        console.log("ret.data: ",ret.data);
        for(var i=0;i<ret.data.length;i++){
            $http.get('api/getNameUser?idUser='+ret.data[i].id).then(function (ans) {
                console.log("ans.data.username: ",ans.data.username);
               $scope.lista.push(ans.data.username);
            });
        };
    });
    $scope.cancel = function (){
        //console.log("cancel");
        $uibModalInstance.dismiss('cancel');
    };
});



app.controller('Users',function ($scope, $timeout, $http, $uibModal) {
    $scope.showAModal = function(modal) {
        $uibModal.open({
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            templateUrl: "http://localhost:3000/"+modal,
            windowTemplateUrl: "http://localhost:3000/template",
            controller: 'viewAll',
            scope: $scope
        });
    };
    $scope.showGraphic = function(modal) {
        $uibModal.open({
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            templateUrl: "http://localhost:3000/"+modal,
            windowTemplateUrl: "http://localhost:3000/template",
            controller: 'Graphic',
            scope: $scope
        });
    };
});

app.controller('Graphic',function ($scope,$uibModalInstance,$http) {
    $scope.cancel = function (){
        $uibModalInstance.dismiss('cancel');
    };
});


app.controller('Timer', function($scope, $timeout, $http, $uibModal, $templateCache) {
    $scope.showAModal = function(modal) {
        $uibModal.open({
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            templateUrl: "http://localhost:3000/"+modal,
            windowTemplateUrl: "http://localhost:3000/template",
            controller: 'resetTime',
            scope: $scope
        }).result.then(function(result){
            //console.log(result);
            $scope.timer = result.hrs*3600 + result.min*60;
            $scope.refreshDB($scope.timer);
            flag = false;
            if (flag) {retrieve()}
        });
    };
    // Timer guardado en la base de datos
    $http.get('/api/getTime?id=' + urlid.get("SessionId"))
        .then(function (resp) {
            $scope.timer = resp.data.timer;
    });

    // Función para actualizar timer de la BD
    $scope.refreshDB = function (t) {
        if (t !== null){
            $http.post('api/refresh', {
                idSesion: urlid.get("SessionId"),
                tim: t
            });
        }
    };



    var flag = false;
    var pause = true;
    var socket = io.connect('http://localhost:3000');
    var retrievetimer = function() {
        flag = false;
        if ($scope.timer > 0 && !pause) {
            $scope.timer -= 1;
            $scope.refreshDB($scope.timer);
        } else if ($scope.timer <= 0 ) {
            flag = true;
            return;
        }
        socket.emit('timeNow', {
            hour: Math.floor($scope.timer / 3600),
            m: Math.floor($scope.timer / 60),
            seg: Math.floor($scope.timer % 60),
            room:urlid.get("SessionId")
        });
        // Pasa el segundo
        $timeout(retrievetimer, 1000);

    };
    retrievetimer();
    $scope.addTime = function() {
        $scope.timer += 300;
        // Actualizo timer de la BD
        $scope.refreshDB($scope.timer);
        flag = false;
        if (flag) {retrieve()}
    };
    $scope.resetTime = function(t) {
        $scope.timer = t;
        $scope.refreshDB($scope.timer);
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

app.controller('resetTime', function($scope,$uibModalInstance){
    console.log("adlkjadslk");
    $scope.hors = 0;
    $scope.mins = 0;
    $scope.ok = function () {
        //console.log("ok");
        $uibModalInstance.close("something");
    };
    $scope.cancel = function (){
        //console.log("cancel");
        $uibModalInstance.dismiss('cancel');
    };
    $scope.update = function (h,m) {
        $scope.time = (parseInt(h) * 3600) + (parseInt(m) * 60);
        $uibModalInstance.close({hrs: h, min: m})
    };
});

app.controller('Stages', function($scope, $http, $timeout){
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
        //console.log("left")
    };
    $scope.right = function(){
        if ($scope.actualStage < window.stages.length-1) {
            $scope.actualStage++;
        } else {
            $scope.actualStage = 0;
        }
        $scope.mostrar = 'mostrar1';
        $timeout(function(){$scope.mostrar = 'mostrar2';refresh();}, 200);
        //console.log("right")
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
        $scope.fooVoto(i);
        //console.log($scope.priorities);
        };
    $scope.deletePriority = function (i) {
        $scope.priorities[i]=(["",""]);
        $scope.fooVoto(i);
        //console.log($scope.priorities);
    };
    $scope.fooVoto = function(i) {
        //console.log($scope.form[i].mechanism);
        $scope.mechDes = $scope.form[i].mechanism;
        $scope.resDes = $scope.form[i].result;
        $scope.nameDes = $scope.form[i].name;
        if ($scope.priorities[i][1] === "") {
            $scope.prioDes = "(No prioridad)";
            $scope.prioColor = {"color":"white"};
        }
        else if ($scope.priorities[i][1] === 1) {
            $scope.prioDes = "(Baja prioridad)";
            $scope.prioColor = {"color":"limegreen"};
        }
        else if ($scope.priorities[i][1] === 2) {
            $scope.prioDes = "(Media prioridad)";
            $scope.prioColor = {"color":"yellow"};
        }
        else if ($scope.priorities[i][1] === 3) {
            $scope.prioDes = "(Alta prioridad)";
            $scope.prioColor = {"color":"red"};
        }
    };
    $scope.eraseVoto = function () {
        $scope.mechDes = "";
        $scope.resDes = "";
        $scope.nameDes = "";
        $scope.prioDes = "";
    };
});
