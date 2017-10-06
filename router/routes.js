var express = require('express');
var app = express();
var models  = require('../models');
var ip = require("ip");

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
    models.Stage.findAll({
        where: {SesionId: req.query.SessionId}
    }).then(function (resultado) {
        res.render('Session.html', {
            title: 'Sesion',
            resultado: resultado,
            session: req.session,
            name: req.query.nameSession,
            url:'http://'+ip.address().toString()+':3000/session?SessionId='+req.query.SessionId+'&nameSession='+ req.query.nameSession,
            hostId:req.query.hostId
        });
    });
});

app.get('/sessions',function(req,res){
    models.Sesion.findAll({
        where: {UsuarioId: req.session.userId}
    }).then(function (resultado) {
        console.log(req.session.userId);
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
    res.render('CrearEscenario.html', {
        title: 'Crear Escenario',
        session: req.session,
        created:req.query.created,
        idSesion: req.query.idSesion
    });
});

app.get('/logout', function(req, res) {
   req.session.destroy();
   res.redirect('/');
});

app.get('/entradaInvitado', function(req, res) {
    res.redirect('/api/inGuest');
});



module.exports = app;

