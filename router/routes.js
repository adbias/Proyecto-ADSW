var express = require('express');
var app = express();
var models  = require('../models');


app.get('/',function(req,res){
    res.render('index.html', {title: 'Mi primer Aplicacion Web'});
});

app.get('/chat',function(req,res){
    models.Chat.findAll().then(function (lista){
        res.render('chat.html', {resultado: lista});
    });
});

app.get('/chat2',function(req,res){
    res.render('chat2.html', {title: 'Chat'});
});

app.get('/verUsuario',function(req,res){
    res.redirect('/api/usuarios')
});

app.get('/crearUsuario',function(req,res){
    res.render('CrearUsuario.html', {title: 'Registrar Usuarios'});
});

module.exports = app;

