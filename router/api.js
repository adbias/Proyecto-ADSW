var express = require('express');
var router = express.Router();
var models  = require('../models');
// var sleep = require('sleep'); delay
module.exports = router;

router.post('/usuarios', function(req,res,next){
	try {
		console.log(req.body.permiso);
		models.Usuario.create({
			username: req.body.username,
			password: req.body.password,
			email: req.body.email
		}).then(function (result) {
			res.redirect("/");
		});
	} catch(ex) {
		console.error("Internal error:" + ex);
		return next(ex);
	}
});

router.post('/login', function(req, res, next) {
    console.log('user and pw: %s , %s', req.body.email, req.body.password);
    try {
        models.Usuario.findAll({
            where: {
                email: req.body.email
            }
        }).then(function (results) {
                if (results.length > 0) {
                    if (results[0].password == req.body.password) {
                        res.render('Log.html', {resultado: results[0].username});
                    }
                    else {
                        res.redirect('Login.html',{resultado: 'error', title: 'Login'});
                    }
                }
                else {
                    res.render('Login.html',{resultado: 'error', title: 'Login'});
                }
        });
    } catch (ex) {
        console.error("Internal error:" + ex);
        return next(ex);
    }
})


