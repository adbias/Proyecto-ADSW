var express = require('express');
var app = express();
var models  = require('../models');
var ip = require("ip");
var rn = require('random-number');
var bcrypt = require('bcrypt-nodejs');
var options = {
    min: 0,
    max: 1000,
    integer: true
};

app.get('/', function(req, res){
    res.render('index.html', {session: req.session});
});

app.get('/beta', function(req, res){
    res.render('index2.html', {session: req.session});
});

app.get('/login', function(req, res){
    if (typeof req.session.login === 'undefined') {
        res.render('Login.html', {session: req.session});
    } else {
        res.redirect('/');
    }
});

app.get('/crearUsuario',function(req,res){
    res.render('CrearUsuario.html', {
        title: 'Registro de Usuario',
        session: req.session,
        error:req.query.Err
    });
});

app.get('/crearSolucion',function(req,res){
    res.render('CrearSolucion.html', {
        title: 'Crear Solucion',
        session: req.session
    });
});

app.get('/soluciones',function(req,res){
    models.Solution.findAll().then(function (user) {
        res.render('Soluciones.html', {
            title: 'Posibles soluciones',
            resultado: user,
            session: req.session
        });
    });
});

app.get('/session',function(req,res){
    console.log('sesion: ',req.session);
    if (typeof req.session.userId !== 'undefined'){
        console.log('si existe....');
        models.Stage.findAll({
            where: {SesionId: req.query.SessionId}
        }).then(function (resultado) {
            // Consulto para ver si ya está en la tabla participantes
            models.Participants.findAll({
                where:{
                    SesionId:req.query.SessionId,
                    UsuarioId: req.session.userId
                }
            }).then(function(data){
                // No existe el usuairo en tabla participantes
                if (data === null){
                    models.Participants.create({
                        UsuarioId: req.query.SessionId,
                        SesionId: req.session.userId
                    })
                }
                res.render('Session.html', {
                    title: 'Sesion',
                    resultado: resultado,
                    //session:user,
                    session: req.session,
                    sessionId:req.query.SessionId,
                    name: req.query.nameSession,
                    url:'http://'+ip.address().toString()+':3000/session?SessionId='+req.query.SessionId+'&nameSession='+ req.query.nameSession,
                    hostId:req.query.hostId
                });
            });

        });

    } else {
        console.log('es indefinido....');
        var num = rn(options);
        models.Usuario.create({
            username: 'invitado'+num.toString(),
            password: bcrypt.hashSync('123456'),
            email: 'invitado@invitado.com'
        }).then(function () {
            models.Usuario.findOne({
                where: { username: 'invitado'+num.toString()}
            }).then(function (results) {
                if (results !== null && bcrypt.compareSync('123456', results.password)) {
                    req.session.login = 1;
                    req.session.username = results.username;
                    req.session.userId = results.id;

                    models.Participants.create({
                        UsuarioId: req.session.userId,
                        SesionId:req.query.SessionId
                    }).then(function () {
                        models.Stage.findAll({
                            where: {SesionId: req.query.SessionId}
                        }).then(function (resultado) {
                            //console.log(resultado);
                            res.render('Session.html', {
                                title: 'Sesion',
                                resultado: resultado,
                                //session:user,
                                session: req.session,
                                sessionId:req.query.SessionId,
                                name: req.query.nameSession,
                                url:'http://'+ip.address().toString()+':3000/session?SessionId='+req.query.SessionId+'&nameSession='+ req.query.nameSession,
                                hostId:req.query.hostId
                            });
                        });
                    });
                }
            });
        });
    }

});

app.get('/sessions',function(req,res){
    models.Sesion.findAll({
        where: {UsuarioId: req.session.userId}
    }).then(function (resultado) {
        //console.log(req.session.userId);
        res.render('Sessions.html', {
            title: 'Sesiones',
            resultado: resultado,
            session: req.session,
            hostId:req.session.userId
        });
    });
});

app.get('/createSesion',function(req,res){
    res.render('CreateSesion.html', {
        title: 'Crear Sesion',
        session: req.session
    });
});

app.get('/crearEscenario',function(req,res){
    models.Stage.findAll({
        where: {SesionId: req.query.idSesion}
    }).then(function (resultado) {
        //console.log("Resultado:");
        //console.log(resultado.length);
        res.render('CrearEscenario.html', {
            title: 'Creando Escenarios',
            session: req.session,
            created:req.query.created,
            idSesion: req.query.idSesion,
            resultado: resultado
        });
    });

});

app.get('/logout', function(req, res) {
   req.session.destroy();
   res.redirect('/');
});

app.get('/entradaInvitado', function(req, res) {
    res.redirect('/api/inGuest');
});

app.get('/deleteSesion', function(req, res) {
    //console.log("Entro en deleteSesion. SessionId = "+req.query.SessionId);
    res.redirect('/api/deleteSesion?SessionId='+req.query.SessionId);
});

app.get('/test', function (req, res) {
   res.render('test.html');
});

app.get('/resetTime', function (req, res) {
    res.render('Timer.html');
});

app.get('/Users', function (req,res) {
   res.render('Users.html') ;
});

app.get('/share', function (req, res) {
    res.render('Share.html');
});

app.get('/template', function(req,res) {
    res.render("template.html")
});

app.get('/analisis',function (req,res) {
    res.render('graphic.html', {
        session: req.session
    });
});

app.get('/enterSession', function(req,res) {
    res.render("template.html")
});

app.get('/graphic',function (req,res) {
   res.render('graphic.html')
});


app.get('/invitaciones',function (req,res) {
    var sesiones = [];
    models.Participants.findAll({
        where: {UsuarioId: req.session.userId}
    }).then(function (resultado) {
        //console.log("buenas: ",resultado);
        for(var i=0;i<resultado.length;i++){
            console.log("vamos por el for :)");
            models.Sesion.findOne({
                where: {
                    id: resultado[i].SesionId
                }
            }).then(function (data) {
                sesiones.push(data);
                console.log("arreglo 1: ",sesiones);
                if (i >= (resultado.length-1)){
                    console.log("arreglo final: ",sesiones);
                    res.render('invitaciones.html', {
                        resultado: sesiones,
                        session: req.session,
                        title: 'Sesiones'
                    });
                }
            });
        };



    });

});

module.exports = app;

