var express = require('express');
var app = express();
var models  = require('../models');
var ip = require("ip");
var rn = require('random-number');
var bcrypt = require('bcrypt-nodejs');
var options = {
    min: 0,
    max: 1000,
    integer: true
};

var text = {
    'index.html': [['Bienvenido', 'Welcome'],
    ['Este es Lead Together', 'This is Lead Together'],
    ['Esta aplicación está hecha para ayudar a la toma de decisiones de forma más rápida y colaborativa entre un grupo de usuarios.', 'This app help teams for taking decisions, making it easier and quicker.'],
    ['Entrar como invitado', 'Sign in as a guest'],
    ['Registrarse', 'Sign up'],
    ['Mis sesiones', 'My sessions'],
    ['Sesiones externas', 'External sessions'],
    ['Unirme a una sesion', 'Join']],

    'nav': [['Entrar', 'Login'], ['Salir', 'Logout']],

    'invitaciones.html': [['Sesiones', 'Sessions'],
    ['Título', 'Title'],
    ['Objetivo', 'Goal'],
    ['Entrar', 'Join']],

    'CrearEscenario.html': [['Nombre', 'Name'],
    ['Objetivo', 'Goal'],
    ['Agregar', 'Add'],
    ['Listo!', 'Ready'],
    ['Título Escenario', 'Stage name'],
    ['Descripción', 'Details']],

    'CrearSolucion.html': [['Nombre solución', 'Solution name'],
    ['Descripción', 'Details'],
    ['Resultado Esperado', 'Consequence'],
    ['Cancelar', 'Cancel'],
    ['Enviar', 'Submit']],

    'CrearUsuario.html': [['Nombre de usuario', 'Username'],
    ['Contraseña  (Mín 6 caracteres)', 'Password (Min 6 characters)'],
    ['E-mail', 'Email'],
    ['Cancelar', 'Cancel'],
    ['Enviar', 'Submit'],
    ['Usuario ocupado', 'This user is already registered. Please try again with another username.'],
    ['Contraseña inválida', 'Invalid password. Please try again with another password with more than 6 characters.'],
    ['Correo ya en uso', 'This email is already registered. Please try again with another email.']],

    'CreateSesion.html': [['Título', 'Title'],
    ['Objetivos', 'Goals'],
    ['Cancelar', 'Cancel'],
    ['Enviar', 'Submit']],

    'graphic.html': [['Histograma del Escenario', 'Stage histogram'],
    ['No prioridad', 'No priority'],
    ['Baja prioridad', 'Low priority'],
    ['Media prioridad', 'Mid priority'],
    ['Alta prioridad', 'High priority'],
    ['Cerrar', 'Close']],

    'Login.html': [['Usuario', 'Username'],
    ['Contraseña', 'Password'],
    ['Cancelar', 'Cancel'],
    ['Entrar', 'Submit'],
    ['Error al iniciar sesión', 'Error while trying to login. Please try again.']],

    'Session.html': [['Compartir', 'Share'], ['Análisis', 'Results'], ['Participantes', 'Players'], ['Votar', 'Send'], ['minutos', 'mins'], ['segundos', 'secs']],
    'Sessions.html': [['Sesiones', 'Sessions'], ['Nombre:', 'Name:'], ['Descripción:', 'Details:'], ['Entrar', 'Join'], ['Borrar', 'Delete'], ['Nueva Sesión', 'New session']],
    'Share.html': [['Compartir', 'Share'], ['Copiar Link', 'Copy'], ['Cerrar', 'Close']],
    'Soluciones.html': [['Nombre', 'Name'], ['Descripción', 'Details'], ['Resultado Esperado', 'Consequence'], ['Nueva solución', 'Add solutions']],
    'Timer.html': [['Colocar nuevo tiempo', 'Set time'], ['Horas', 'Hours'], ['Minutos', 'Minutes'], ['Cancelar', 'Cancel'], ['Guardar', 'Save']],
    'Users.html': [['Participantes', 'Players'], ['Cerrar', 'Close']]};

var getPack = function(req, name) {
    var pack = Object();
    pack.text = text[name];
    if (typeof req.session.language === 'undefined')
        pack.language = '0';
    else pack.language = req.session.language;
    pack.url = req.protocol + '://' + req.get('host') + req.originalUrl;
    pack.nav = text['nav'];
    return pack;
};

app.get('/', function(req, res) {
    console.log(req.session.language);
    res.render('index.html', {
        session: req.session,
        pack: getPack(req,'index.html')
    });
});

app.get('/login', function(req, res) {
    if (typeof req.session.login === 'undefined')
        res.render('Login.html', {session: req.session, pack: getPack(req,'Login.html')});
    else
        res.redirect('/');
});

app.get('/crearUsuario', function(req, res) {
    res.render('CrearUsuario.html', {
        title: ['Registro de Usuario','Sign up'],
        session: req.session,
        error: req.query.Err,
        pack: getPack(req, 'CrearUsuario.html')
    });
});

app.get('/crearSolucion', function(req, res) {
    res.render('CrearSolucion.html', {
        title: ['Crear Solucion', 'Add solution'],
        session: req.session,
        pack: getPack(req,'CrearSolucion.html')
    });
});

app.get('/soluciones', function(req, res) {
    models.Solution.findAll().then(function(user) {
        res.render('Soluciones.html', {
            title: ['Posibles soluciones','Solutions'],
            resultado: user,
            session: req.session,
            pack:getPack(req,'Soluciones.html')
        });
    });
});

app.get('/session',function(req, res) {
    if (typeof req.session.userId !== 'undefined') {
        models.Stage.findAll({
            where: {SesionId: req.query.SessionId},
            include: [models.Sesion],
            raw: true
        }).then(function(resultado) {
            models.Participants.findAll({
                where: {
                    SesionId:req.query.SessionId,
                    UsuarioId: req.session.userId
                }
            }).then(function(data) {
                if (data === null) {
                    models.Participants.create({
                        UsuarioId: req.query.SessionId,
                        SesionId: req.session.userId
                    })
                }
                res.render('Session.html', {
                    title: ['Sesion','Session'],
                    resultado: resultado,
                    session: req.session,
                    sessionId: req.query.SessionId,
                    name: req.query.nameSession,
                    url: 'http://' + ip.address().toString() +
                    ':3000/session?SessionId=' + req.query.SessionId + '&nameSession=' + req.query.nameSession,
                    userId: resultado[0]['Sesion.UsuarioId'],
                    pack: getPack(req,'Session.html')
                });
            });

        });

    } else {
        var num = rn(options);
        models.Usuario.create({
            username: 'invitado'+num.toString(),
            password: bcrypt.hashSync('123456'),
            email: 'invitado@invitado.com'
        }).then(function() {
            models.Usuario.findOne({where: { username: 'invitado'+num.toString()}})
                .then(function(results) {
                    if (results !== null && bcrypt.compareSync('123456', results.password)) {
                        req.session.login = 1;
                        req.session.username = results.username;
                        req.session.userId = results.id;

                        models.Participants.create({
                            UsuarioId: req.session.userId,
                            SesionId:req.query.SessionId})
                            .then(function() {
                                models.Stage.findAll({
                                    raw:true,
                                    where: {SesionId: req.query.SessionId},
                                    include: [models.Sesion]})
                                    .then(function(resultado) {
                                        res.render('Session.html', {
                                            title: ['Sesion','Session'],
                                            resultado: resultado,
                                            session: req.session,
                                            sessionId: req.query.SessionId,
                                            name: req.query.nameSession,
                                            url: 'http://' + ip.address().toString() + ':3000/session?SessionId=' +
                                            req.query.SessionId + '&nameSession=' + req.query.nameSession,
                                            userId:resultado[0]['Sesion.UsuarioId'],
                                            pack:getPack(req,'Session.html')
                                        });
                                    });
                            });
                    }
                });
        });
    }
});

app.get('/sessions', function(req, res) {
    models.Sesion.findAll({where: {UsuarioId: req.session.userId}})
        .then(function (resultado) {
            res.render('Sessions.html', {
                title: ['Sesiones','Sessions'],
                resultado: resultado,
                session: req.session,
                hostId: req.session.userId,
                pack: getPack(req,'Sessions.html')
        });
    });
});

app.get('/createSesion', function(req, res) {
    res.render('CreateSesion.html', {
        title: ['Crear Sesion','Add sessions'],
        session: req.session,
        pack: getPack(req,'CreateSesion.html')
    });
});

app.get('/crearEscenario', function(req, res) {
    models.Stage.findAll({where: {SesionId: req.query.idSesion}})
        .then(function(resultado) {
            res.render('CrearEscenario.html', {
                title: ['Creando Escenarios','Add Stages'],
                session: req.session,
                created: req.query.created,
                idSesion: req.query.idSesion,
                resultado: resultado,
                pack: getPack(req,'CrearEscenario.html')
            });
        });
});

app.get('/logout', function(req, res) {
   req.session.destroy();
   res.redirect('/');
});

app.get('/entradaInvitado', function(req, res) {
    res.redirect('/api/inGuest');
});

app.get('/deleteSesion', function(req, res) {
    res.redirect('/api/deleteSesion?SessionId=' + req.query.SessionId);
});

app.get('/resetTime', function(req, res) {
    res.render('Timer.html', {pack: getPack(req,'Timer.html')});
});

app.get('/Users', function(req, res) {
   res.render('Users.html', {pack: getPack(req,'Users.html')}) ;
});

app.get('/share', function(req, res) {
    res.render('Share.html', {pack: getPack(req,'Share.html')});
});

app.get('/template', function(req, res) {
    res.render('template.html');
});

app.get('/analisis', function(req, res) {
    res.render('graphic.html', {session: req.session, pack:getPack(req,'graphic.html')});
});

app.get('/enterSession', function(req, res) {
    res.render('template.html');
});

app.get('/graphic', function(req, res) {
   res.render('graphic.html', {pack: getPack(req,'graphic.html')});
});

app.get('/invitaciones', function(req, res) {
    models.Participants.findAll({
        raw: true,
        where: {UsuarioId: req.session.userId},
        include: [models.Sesion]
    }).then(function (resultado) {
        res.render('invitaciones.html', {
            resultado: resultado,
            session: req.session,
            title: ['Sesiones','Sessions'],
            pack: getPack(req,'invitaciones.html')
        });
    });
});

app.get('/language', function(req, res) {
    req.session.language = req.query.id;
    res.redirect(req.query.url);
});

module.exports = app;

