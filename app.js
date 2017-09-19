var express = require('express');
var ip = require('ip');
var app = express();
var bodyParser = require('body-parser');
var path = require('path');
var mysql = require('mysql');
var Usuario= require('./models/usuario.js');
var models = require("./models/index.js");
var session = require('express-session');


app.use(express.static(__dirname + '/style'));
app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').renderFile);

app.set('view engine', 'ejs');
app.use('/',require('./router/routes'));


/*var nodeadmin = require('nodeadmin');
app.use(nodeadmin(app));*/

//Express
app.use(bodyParser.urlencoded({extended: true }));
app.use(bodyParser.json());
app.use(session({
    secret: 'a4f8071f-c873-4447-8ee2',
    cookie: {maxAge: 2628000000},
    resave: false,
	saveUninitialized: true
}));

//Routes
app.use('/api', require('./router/api'));

//Start Server
models.sequelize.sync().then(function () {
	var server = app.listen(3000, function () {
		var host = ip.address();
		var port = server.address().port;
		console.log('Example app listening at http://%s:%s', host, port);
	});
});

