var express = require('express');
var router = express.Router();
var models  = require('../models');
var bcrypt = require('bcrypt-nodejs');
var regex = require('regex-email');
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
            if (results[0].username == req.body.username) {
                console.log("usuario ya registrado");
                res.redirect("/");
            }   else {
                console.log("correo ya registrado");
                res.redirect("/");
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
                    console.log("registrado");
                    res.redirect("/");
                });
            } else {
                console.log("contraseña no valida");
                res.redirect("/");
            }
        } else {
            console.log("email no valido");
            res.redirect("/");
        }
    }
});

router.post('/createSesion', function(req,res,next){
    try {
        console.log(req.session.username);
        console.log(req.session.id);
        models.Sesion.create({
            titulo: req.body.title,
            escenario: req.body.stage,
            objetivo: req.body.objetive,
            link: " Zelda ",
            UsuarioId: req.session.userId
        }).then(function (result) {
            res.redirect("/sesions");
        });
    } catch(ex) {
        console.error("Internal error:" + ex);
        return next(ex);
    }
});


router.post('/login', function(req, res, next) {
    models.Usuario.findOne({
        where: { email: req.body.email }
    }).then(function (results) {
        if (results !== null && bcrypt.compareSync(req.body.password, results.password)) {
            req.session.login = 1;
            req.session.username = results.username;
            req.session.userId = results.id;
            res.redirect('/');
        }
        else {
            res.redirect('/login');
        }
        });
});

router.post('/chat', function (req, res, next) {
    models.Chat.create({
        username: req.body.username,
        msg: req.body.msg
    });
    chat.push({
        username:req.body.username,
        msg: req.body.msg});
    next();
});

router.post('/soluciones', function (req, res,next) {
    try {
        console.log(req.session.username);
        console.log(req.session.id);
        models.Solution.create({
            name: req.body.name,
            description: req.body.description,
            result: req.body.result,
        }).then(function (result) {
            res.redirect("/soluciones");
        });
    } catch(ex) {
        console.error("Internal error:" + ex);
        return next(ex);
    }
});

router.get('/chat', function (req, res, next) {
       res.send(chat);
});

