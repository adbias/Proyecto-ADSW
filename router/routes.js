var express = require('express');
var app = express();
var models  = require('../models');

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

app.get('/chat', function(req, res){
    if (typeof req.session.login !== 'undefined') {
        res.render('chat.html', {session: req.session});
    } else {
        res.redirect('/login');
    }
});

app.get('/chat2',function(req,res){
    res.render('chat2.html', {title: 'Chat'});
});

app.get('/crearUsuario',function(req,res){
    res.render('CrearUsuario.html', {title: 'Registro de Usuario', session: req.session, error:req.query.Err});
});

app.get('/crearSolucion',function(req,res){
    res.render('CrearSolucion.html', {title: 'Crear Solucion', session: req.session});
});

app.get('/soluciones',function(req,res){
    models.Solution.findAll().then(function (user) {
        res.render('Soluciones.html', {title: 'Posibles soluciones', resultado: user, session: req.session});
    });
});

app.get('/session',function(req,res){
    models.Stage.findAll({
        where: { SesionId: req.query.SessionId}
    }).then(function (resultado) {
        res.render('Session.html', {title: 'Sesion',resultado: resultado, session: req.session,name: req.query.nameSession});
    });
});

app.get('/sessions',function(req,res){
    models.Sesion.findAll({
        where: {UsuarioId: req.session.userId}
    }).then(function (resultado) {
        res.render('Sessions.html', {title: 'Sesiones', resultado: resultado, session: req.session});
    });
});

app.get('/createSesion',function(req,res){
        res.render('CreateSesion.html', {title: 'Crear Sesion', session: req.session});
});

app.get('/crearEscenario',function(req,res){
    res.render('CrearEscenario.html', {title: 'Crear Escenario', session: req.session});
});

app.get('/logout', function(req, res) {
   req.session.destroy();
   res.redirect('/');
});

app.get('/timer',function(req, res){
   res.render('Timer.html');
});

module.exports = app;

