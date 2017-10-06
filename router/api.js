var express = require('express');
var router = express.Router();
var models  = require('../models');
var bcrypt = require('bcrypt-nodejs');
var regex = require('regex-email');
//var url = require('url');
module.exports = router;
var chat = [];

router.post('/usuarios', function(req, res){
    var add = true;
    // Search for user and email registered
    models.Usuario.findAll({
        where: {
            $or:[
                {email: req.body.email},
                {username: req.body.username}
            ]
        }
    }).then(function (results) {
        if(results.length > 0){
            if (results[0].username === req.body.username) {
                res.redirect('/crearUsuario?Err=1');
            }   else {
                res.redirect('/crearUsuario?Err=3');
            }
            existed = false;
    }});
    //Condition for validate
    if (add){
        if (regex.test(req.body.email)) { // validate email
            if (req.body.password.length >= 6){ // validate password
                models.Usuario.create({
                    username: req.body.username,
                    password: bcrypt.hashSync(req.body.password),
                    email: req.body.email
                }).then(function () {
                    models.Usuario.findOne({
                        where: { email: req.body.email }
                    }).then(function (results) {
                        if (results !== null && bcrypt.compareSync(req.body.password, results.password)) {
                            req.session.login = 1;
                            req.session.username = results.username;
                            req.session.userId = results.id;
                            res.redirect('/');
                        }
                    });
                });
            } else {
                res.redirect('/crearUsuario?Err=2');
            }
        } else {
            res.redirect('/crearUsuario?Err=4');
        }
    }
});

router.post('/createSesion', function(req, res){
    models.Sesion.create({
        titulo: req.body.title,
        objetivo: req.body.objetive,
        link: " Zelda ",
        UsuarioId: req.session.userId
    }).then(function () {
        models.Sesion.findOne({
            where: {
                titulo: req.body.title,
                objetivo: req.body.objetive
            }
        }).then(function (results) {
            res.redirect("/crearEscenario?idSesion="+results.id.toString()+"&created=0");
        });
    });
});

router.post('/crearEscenario', function(req, res){
    models.Stage.create({
        titulo: req.body.title,
        descripcion: req.body.objetive,
        SesionId: req.query.idSesion
    }).then(function () {
        res.redirect("/crearEscenario?created=1&idSesion="+req.query.idSesion.toString());
    });
});

router.post('/login', function(req, res) {
    models.Usuario.findOne({
        where: {
            email: req.body.email
        }
    }).then(function (results) {
        if (results !== null && bcrypt.compareSync(req.body.password, results.password)) {
            req.session.login = 1;
            req.session.username = results.username;
            req.session.userId = results.id;
            res.redirect('/');
        }
        else res.redirect('/login');
    });
});

router.post('/chat', function(req, res, next) {
    models.Chat.create({
        username: req.body.username,
        msg: req.body.msg,
        sessionid:req.query.id
    });
    chat.push({
        username:req.body.username,
        msg: req.body.msg,
        sessionid: req.query.id
    });
    next();
});

router.post('/soluciones', function (req, res) {
    console.log(req.session.username);
    console.log(req.session.id);
    models.Solution.create({
        name: req.body.name,
        description: req.body.description,
        result: req.body.result
    }).then(function() {
        res.redirect("/soluciones");
    });
});

router.post('/soluciones', function (req, res) {
    console.log(req.session.username);
    console.log(req.session.id);
    models.Solution.create({
        name: req.body.name,
        description: req.body.description,
        result: req.body.result
    }).then(function() {
        res.redirect("/soluciones");
    });
});

router.get('/chat', function (req, res) {
    res.send(chat.filter(function (t) {
        if (t.sessionid === req.query.id) return t;
    }));
});

