/**
 * Created by famancil on 26-08-16.
 */

var express = require('express');
var app = express();

app.get('/',function(req,res){
    res.render('index.html', {title: 'Mi primer Aplicacion Web'});
});

app.get('/verUsuario',function(req,res){
    res.redirect('/api/usuarios')
});

app.get('/crearUsuario',function(req,res){
    res.render('CrearUsuario.html', {title: 'Registrar Usuarios'});
});

module.exports=app;

