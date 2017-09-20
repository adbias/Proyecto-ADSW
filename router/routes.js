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

app.get('/verUsuario',function(req,res){
    res.redirect('/api/usuarios')
});

app.get('/crearUsuario',function(req,res){
    res.render('CrearUsuario.html', {title: 'Registro de Usuario', session: req.session});
});

app.get('/sesions',function(req,res){
    res.render('sesions.html', {title: 'Sesiones', session: req.session});
});

app.get('/createSesion',function(req,res){
        res.render('CreateSesion.html', {title: 'Crear Sesion', session: req.session});
});


app.get('/chat/12345', function (req,res,next) {
    try {
        return models.Chat.findAll().then(function (chat) {
            res.json(chat);
        })
    }
    catch(ex){
        console.error("Internal error:"+ex);
        return next(ex);
    }

});
app.post('/chat/12345',function (req, res, next) {
    console.log("Access through post");
    try {
        var client = chat.client(room);
        console.log(req, "chat");
        client.identify({ nick:req.username });
        client.once('ready', function() {
            client.write(req.msg);
        });
        models.Chat.create({
            username: req.username,
            msg: req.msg
        });
    }
    catch(ex){
        console.error("Internal error:"+ex);
        return next(ex);
    }
});

app.get('/logout', function(req, res) {
   req.session.destroy();
   res.redirect('/');
});

module.exports = app;

