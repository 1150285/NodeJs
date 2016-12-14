///////////////////////////////////////////////////////
//
// Leonardo Marques de Andrade, Paulo Afonso, Paulo Russo (1160091, 1161660 e 1150285)
// PSIDI / MEI / ISEP
// (c) 2016
//
///////////////////////////////////////////////////////


//
// Check Readme and Documentation to understand how this client works
//


var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');
var util = require('util');
//var methodOverride = require('method-override');

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
//app.use(methodOverride());

// logging : DEBUG
//app.use(express.logger('dev'));

const port = process.env.PORT || 3001;
const SERVER_ROOT = "http://localhost:" + port;

// UNIT Test of USERS
process.argv.forEach(function (val, index, array) {
  console.log(index + ': ' + val);
});

var resourceURL = process.argv[2];
var varId = "";
//varId = process.argv[3];

switch (varId) {
	case "": {
		// simple GET
		request({
		   uri : SERVER_ROOT + "/" + resourceURL,
		   method: "GET" ,
		   json : {}
		   }, 
		   function(err, res, body){
		       console.log("Feito GET para o " + resourceURL + " e received: " + err + res + body);
		});
		break;
	}
	case "u1" : {
		// GET by ID
		request({
			uri : SERVER_ROOT + "/" + resourceURL + "/" + varId,
		   method: "GET" ,
		   json : {}
		   }, 
		   function(err, res, body){
		       console.log("received: '" + body);
		});
		break;
	}
}