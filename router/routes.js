var express = require('express');
var app = express();
var models  = require('../models');
var chat = require('chat');
var room = chat.room();


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
    models.Chat.findAll().then(function (lista){
        res.render('chat.html', {resultado: lista});
    });
});

app.get('/chat2',function(req,res){
    res.render('chat2.html', {title: 'Chat'});
});

app.get('/crearUsuario',function(req,res){
    res.render('CrearUsuario.html', {title: 'Registro de Usuario', session: req.session});
});

app.get('/sesions',function(req,res){
    try {
        models.Sesion.findAll().then(function (user) {
            res.render('sesions.html', {title: 'Sesiones', resultado: user, session: req.session});
        });
    } catch (ex) {
        console.error("Internal error:" + ex);
        return next(ex);
    }
});


app.get('/createSesion',function(req,res){
        res.render('CreateSesion.html', {title: 'Crear Sesion', session: req.session});
});

app.get('/logout', function(req, res) {
   req.session.destroy();
   res.redirect('/');
});

module.exports = app;

