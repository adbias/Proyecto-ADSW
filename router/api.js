var express = require('express');
var router = express.Router();
var models  = require('../models');
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
