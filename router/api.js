var express = require('express');
var router = express.Router();
var models  = require('../models');
var bcrypt = require('bcrypt-nodejs');
// var sleep = require('sleep'); delay
module.exports = router;

router.post('/usuarios', function(req, res){
    models.Usuario.create({
        username: req.body.username,
        password: bcrypt.hashSync(req.body.password),
        email: req.body.email
    }).then(function () {
        res.redirect("/");
    });
});

router.post('/login', function(req, res, next) {
    models.Usuario.findOne({
        where: { email: req.body.email }
    }).then(function (results) {
        if (results !== null && bcrypt.compareSync(req.body.password, results.password)) {
            req.session.login = 1;
            req.session.username = results.username;
            res.redirect('/');
        }
        else {
            res.redirect('/login');
        }
        });
});
