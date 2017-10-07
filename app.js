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
app.use(session({
    secret: 'a4f8071f-c873-4447-8ee2',
    cookie: {maxAge: 2628000000},
    resave: false,
    saveUninitialized: true
}));

app.use(express.static(__dirname + '/style'));
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
});

var a = [{
    id:1,
    name:"Identificar autor",
    mechanism:"La fuente de cualquier entrada externa hacia el sistema",
    result:"Identificar usuarios por ID, códigos de acceso, dirección IP y protocolos"},
    {
        id:2,
        name:"Detectar intruso",
        mechanism:"Identificar comportamiento malicioso almacenado en sistemas",
        result:"Detectar comportamiento malicioso en protocolos, aplicaciones, códigos, puertos o direcciones IP"},
    {
        id:3,
        name:"Detectar denegación de servicios",
        mechanism:"Denegación de servicios",
        result:"Revisar la configuración de routers y Firewalls para detener IPs inválidas así como también el filtrado de protocolos que no sean necesarios"},
    {
        id:4,
        name:"Verificar integridad del mensaje",
        mechanism:"Técnicas o procedimientos cuyo objetivo es alterar la integridad de los datos de un mensaje",
        result:"Procedimiento que asegure la verificación de la integridad de los datos"},
    {
        id:5,
        name:"Detectar retraso en el mensaje",
        mechanism:"Detectar un potencial ataque por man-in-the-middle",
        result:"Detectar comportamiento sospechoso"},
    {
        id:6,
        name:"Autorizar actores",
        mechanism:"Asegurar que un usuario autorizado tiene los derechos para acceder y modificar datos o servicios",
        result:"Definir grupos de usuarios, roles o listados de individuales"},
    {
        id:7,
        name:"Limitar acceso",
        mechanism:"Firewalls que restrigen accesos basados en mensajes fuente o puertos de destino",
        result:"Configuración de DMZ (demilitared zone). Proveer servicios de Internet pero no a una red privada"},
    {
        id:8,
        name:"Limitar exposición",
        mechanism:"Explotar una sola debilidad para atacar todos los datos y servicios",
        result:"Diseño de asignación de servicios de hosts para que los servicios limitados estén disponibles en cada host"},
    {
        id:9,
        name:"Encriptar datos",
        mechanism:"Los datos deben estar protegidos de acceso no autorizado",
        result:"Confidencialidad, protección de datos, Virtual Private Network (VPN), Secure Sockets Layers (SSL)"},
    {
        id:10,
        name:"Separar identidades",
        mechanism:"Separación de diferentes servidores",
        result:"Reduce las posibilidades de ataque de aquellos que tienen acceso a datos no sensibles"},
    {
        id:11,
        name:"Cambiar configuración predeterminada",
        mechanism:"Las configuraciones predeterminadas que están en un sistema",
        result:"Cambiar esta configuración impide que los atacantes accedan al sistema a través de configuraciones que están disponibles públicamente"},
    {
        id:12,
        name:"Revocar acceso",
        mechanism:"El acceso debe ser severamente limitado a recursos sensibles",
        result:"Protección de recursos sensibles"},
    {
        id:13,
        name:"Bloquear computador",
        mechanism:"Muchos intentos fallidos de inicio de sesión",
        result:"Mecanismos para prevenir ataques potenciales de usuarios no legítimos"},
    {
        id:14,
        name:"Informar a actores",
        mechanism:"Notificar a un cierto actor",
        result:"Informar cuando el sistema ha detectado un ataque"},
    {
        id:15,
        name:"Matener auditoría",
        mechanism:"Recoger, agrupar y evaluar evidencias de ataques",
        result:"Trazar acciones de un atacante"},
    {
        id:16,
        name:"Restauración",
        mechanism:"Restauración de servicios",
        result:"Recuperación de un ataque"},
    {
        id:17,
        name:"Autenticar actor",
        mechanism:"Asegurar que un usuario autenticado tiene los derechos de acceder y modificar datos o servicios",
        result:"Definir grupos de usuario, roles, listas individuales"}];
models.Solution.destroy({
    where: {}
});
for (var i = 0; i< a.length; i++) {
    models.Solution.create(a[i]);
}
