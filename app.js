var express = require('express');
var ip = require('ip');
var app = express();
var bodyParser = require('body-parser');
var path = require('path');
var mysql = require('mysql');
var Usuario = require('./models/usuario.js');
var Solution = require('./models/solution.js');
var models = require("./models/index.js");
var session = require('express-session');
var sleep = require('sleep');
app.use(session({
    secret: 'a4f8071f-c873-4447-8ee2',
    cookie: {maxAge: 2628000000},
    resave: false,
    saveUninitialized: true
}));

app.use(express.static(__dirname + '/static'));
app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').renderFile);

app.set('view engine', 'ejs');
app.use('/', require('./router/routes'));

app.use(bodyParser.urlencoded({extended: true }));
app.use(bodyParser.json());
app.use('/api', require('./router/api'));
models.sequelize.sync().then(function () {
    server = app.listen(3000, function () {
		var host = ip.address();
		var port = server.address().port;
		console.log('Example app listening at http://%s:%s', host, port);
	});
    var io = require('socket.io')(server);
    io.on('connection', function (socket) {
        socket.on('timeNow', function (data) {
            //console.log(data);
            if (data.seg == 'undefined'){
                io.sockets.emit('timer',{hor:0,min:0,seg:0,room:data.room});
            } else {
                io.sockets.emit('timer',{hor:data.hour, min:data.m, seg:data.seg,room:data.room});
            }
        });
        socket.on('Chat', function (data) {
            //console.log('mensaje: ',data.msg,data.username);
            if (data.msg !== ''){
                io.sockets.emit('ChatIn',{msg:data.msg, username:data.username,room: data.room});
            } else {
                io.sockets.emit('ChatIn',{msg:'undefined', username:'undefined',room:data.room});
            }
        });
    });
});

