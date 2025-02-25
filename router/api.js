var express = require('express');
var router = express.Router();
var models  = require('../models');
var bcrypt = require('bcrypt-nodejs');
var regex = require('regex-email');
//var url = require('url');
module.exports = router;
var chat = [];
var rn = require('random-number');
var options = {
    min: 0,
    max: 1000,
    integer: true
};

router.post('/refresh', function (req,next) {
    models.Sesion.update(
        {timer:req.body.tim},
        {where: { id: req.body.idSesion}}
    );
});

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
                if (results[0].email != "invitado@invitado.com"){ // invitado
                    res.redirect('/crearUsuario?Err=1');
                }
            }  else {
                if (results[0].email != "invitado@invitado.com"){ // invitado
                    res.redirect('/crearUsuario?Err=3');
                }
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
        UsuarioId: req.session.userId,
        timer: 1800
    }).then(function () {
        models.Sesion.findOne({
            where: {
                titulo: req.body.title,
                objetivo: req.body.objetive
            }
        }).then(function (results) {
            models.Participants.create({
                UsuarioId: req.session.userId,
                SesionId: results.id
            }).then(function () {
                res.redirect("/crearEscenario?idSesion="+results.id.toString()+"&created=0");
            });
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
            username: req.body.user
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
    //console.log(req.body);
    next();
});

router.post('/soluciones', function (req, res) {
    //console.log(req.session.username);
    //console.log(req.session.id);
    models.Solution.create({
        name: req.body.name,
        description: req.body.description,
        result: req.body.result
    }).then(function() {
        res.redirect("/soluciones");
    });
});

router.post('/soluciones', function (req, res) {
    //console.log(req.session.username);
    //console.log(req.session.id);
    models.Solution.create({
        name: req.body.name,
        description: req.body.description,
        result: req.body.result
    }).then(function() {
        res.redirect("/soluciones");
    });
});

router.get('/inGuest',function (req,res) {
    var num = rn(options);
    models.Usuario.create({
        username: 'invitado'+num.toString(),
        password: bcrypt.hashSync('123456'),
        email: 'invitado@invitado.com'
    }).then(function () {
        models.Usuario.findOne({
            where: { username: 'invitado'+num.toString()}
        }).then(function (results) {
            if (results !== null && bcrypt.compareSync('123456', results.password)) {
                req.session.login = 1;
                req.session.username = results.username;
                req.session.userId = results.id;
                res.redirect('/');
            }
        });
    });
});

router.get('/guestSesion',function (req,res) {
    var num = rn(options);
    models.Usuario.create({
        username: 'invitado'+num.toString(),
        password: bcrypt.hashSync('123456'),
        email: 'invitado@invitado.com'
    }).then(function () {
        models.Usuario.findOne({
            where: { username: 'invitado'+num.toString()}
        }).then(function (results) {
            if (results !== null && bcrypt.compareSync('123456', results.password)) {
                res.redirect('/session?user='+results.username+'&id='+results.id);
            }
        });
    });
});

router.post('/addVotes', function (req, res) {
    //console.log(req.body.priorities);
    for (var i=0;i<req.body.priorities.length; i++) {
        models.Voto.create({
            priority: parseInt(req.body.priorities[i][1]),
            UsuarioId: req.session.userId,
            StageId: parseInt(req.body.stageId),
            SolutionId: parseInt(i)+1
        })
    }
});

router.get('/chat', function (req, res) {
    res.send(chat.filter(function (t) {
        if (t.sessionid === req.query.id) return t;
    }));
});

router.get('/searchChat', function (req,res) {
    models.Chat.findAll({
        where:{
            sessionid:req.query.id
        }
        }
    ).then(function (data) {
        res.send(data);
    });
});

var soluciones = "";
models.Solution.findAll().then(function(info){soluciones = info});

router.get('/soluciones', function(req, res) {
    res.send(soluciones);
});

router.get('/deleteSesion', function(req, res){
    //console.log("Entro en deleteSesion. SessionId = "+req.query.SessionId);
    // Borrar todos los escenarios que apuntan a la sesion
    models.Stage.destroy({
        where: {
            SesionId: req.query.SessionId
        }
    }).then(function () {
        //Borrar la sesion
        models.Sesion.destroy({
            where: {
                id: req.query.SessionId
            }
        }).then(function () {
            res.redirect("/sessions");
        });
    });

});

router.get('/getVotos',function (req,res) {
   models.Voto.findAll({
       where:{StageId:req.query.esc},
       raw: true,
       include:[models.Solution]
   }).then(function (data) {
       result = {};
       for (i=0;i<data.length;i++){
           if (data[i]['Solution.name'] in result){
               console.log("wii");
               result[data[i]['Solution.name']][data[i].priority] += 1
           } else {
               console.log("wii2");
               result[data[i]['Solution.name']] = [0,0,0,0];
               result[data[i]['Solution.name']][data[i].priority] += 1;
           }
       }
       console.log(result);
       //console.log(data);
       res.send(result);
   })
});

router.get('/getTime',function (req,res) {
   models.Sesion.findOne({
       where: {
           id: req.query.id
       }
   }).then(function (ret) {
       res.send(ret);
    })
});

router.get('/stage', function (req, res) {
    models.Voto.findOne({
        where: {
            UsuarioId: req.query.user,
            StageId: req.query.stage
        }}
    ).then(function (value) {
        if(value === null){
            res.send(false)
        } else {
            res.send(true)
        }
    })
});

router.get('/graficos', function (req, res) {
    models.Voto.findAll({
        raw: true,
        where: {
            SolutionId:req.query.id,
            StageId:req.query.stage
        }
    }).then(function (value) {
        a = 0;
        b = 0;
        c = 0;
        d = 0;
        for(var i = 0; i<value.length;i++){
            //console.log(i);
            if (value[i].priority === 0)
                a += 1;
            else if (value[i].priority === 1)
                b += 1;
            else if (value[i].priority === 2)
                c += 1;
            else if (value[i].priority === 3)
                d += 1;
        }
        res.send([a,b,c,d]);
    });

});
router.get('/Usuarios',function (req,res){
  models.Participants.findAll({
      where:{
          SesionId: req.query.idSesion
      }
  }).then(function (response) {
      res.send(response);
  });
});

router.get('/getNameUser',function (req,res) {
   models.Usuario.findOne({
       where:{
           id: req.query.idUser
       }
   }).then(function (ret) {
       res.send(ret);
   })
});

router.get('/countVotes',function (req,res) {
    models.Voto.findAll({
        where: {
            StageId: req.query.idEsc,
            SolutionId: req.query.idSol
        }
    }).then(function (ret) {
        res.send(ret);
        //res.send(ret.length);
    });
});