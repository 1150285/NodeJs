/**
* Datasheet project
* Leonardo Marques de Andrade, Paulo Afonso e Paulo Russo (1160091, 1161660 e 1150285)
* PSIDI / MEI / ISEP
* (c) 2016

* Check Readme and Documentation to understand how this servers works
* https://bitbucket.org/ODSOFT_2016_1160091/restify
**/

/************
 Global Vars & Constants
************/

var express = require('express');
var bodyParser = require('body-parser');
//var methodOverride = require('method-override');
var request = require('request');


var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
//app.use(methodOverride());

// logging : DEBUG
//app.use(express.logger('dev'));

const port = process.env.PORT || 3002;
const SERVER_ROOT = "http://localhost:" + port;

/************
global functions
************/
function calculation(callbackURL, myRefValue, oper_id, dataset_id, username) {
	// POST message
	//Calculate here de stat. You can/should do internal requests to Datasheet_srv to enhance the calculation
	var myRefURLcallback = callbackURL + myRefValue;
	var result = "1 + 1 = 2";
	
	var resultJson = {'key' : 'value'};
	resultJson.key = myRefValue;
	resultJson.value = result;
	
	request({
		uri : myRefURLcallback,
		method: "POST",
		json : {myRefValue: result},		
	   },
	   function(err, res, body){    
			if (!err) {
				console.log("»»» Posted callback successfully in the URL: " + myRefURLcallback + " and the result: " + result + " and got StatusCode: " + res.statusCode);
				if (204 != res.statusCode ) {
					console.log("»»» Internal error in Datasheet server. Please contact system administrator ");
				} 
			}
			else {
				console.log("»»» Unknown Error. Maybe Datasheet server is unavailable. Please contact system administrator \n" + err);
			}
	});
	
}

/**
 * URL: /:userID/:datasetID/:operID
 * GET 		return specific user 200 or 404
 * POST 	not allowed, returns 405
 * PUT 		overwrite data for existent user, returns 200, 400 or 404 
 * DELETE 	delete an user, returns 200 or 404
**/

app.param('userID', function(req, res, next, userID){
	req.username = userID;
	return next()
	})

app.param('datasetID', function(req, res, next, datasetID){
	req.dataset_id = datasetID;
	return next()
	})

app.param('operID', function(req, res, next, operID){
	req.oper_id = operID;
	return next()
	})

app.route("/HeavyOps/:userID/:datasetID/:operID") 
	.post(function(req, res) {
		
		console.log("»»» Accepted POST request to calculate operID: " + req.oper_id + " for DatasetID: " + req.dataset_id + " and UserID: " + req.username + " Develop here what happens");
		
		//validate mandatory body fields in this IF
		if (req.body.callbackURL && req.body.myRef) {
					
			// queue the request - handle it when possible - remove it after tests
			
			calculation(req.body.callbackURL, req.body.myRef, req.oper_id, req.dataset_id, req.username);

			// send 202 Accepted
			res.statusCode = 202;
			res.setHeader("Content-Type", "application/html");
			res.end("<html><body><h1> " + 
					"Accepted POST request to calculate operID: " + req.oper_id + " for DatasetID: " + req.dataset_id + "and UserID: " + req.unsername + 
					"<h2><br>Your CallbackID is: " + req.body.myRef + "</br></h2>" +
					"</h1></body></html>");
			
			console.log("»»» When the calculation finish I will POST callback to Ref: "+ req.body.myRef);	
		} else {
			res.statusCode = 400;
			res.setHeader("Content-Type", "application/html");
			res.end("<html><body><h1> " +
					"Bad request. Check the definition documentation. " +
					"</h1></body></html>");
			console.log("»»» Bad request. Check the definition documentation.");
		}
		
	})
	.get(function(req, res) {
		res.statusCode = 405;
		res.setHeader("Content-Type", "application/html");
		res.end("<html><body><h1> " +
				"Method not allowed in this resource. Check the definition documentation " +
				"</h1></body></html>");
	})
	.put(function(req, res) {
		res.statusCode = 405;
		res.setHeader("Content-Type", "application/html");
		res.end("<html><body><h1> " +
				"Method not allowed in this resource. Check the definition documentation " +
				"</h1></body></html>");
	})
	.delete(function(req, res) {
		res.statusCode = 405;
		res.setHeader("Content-Type", "application/html");
		res.end("<html><body><h1> " +
				"Method not allowed in this resource. Check the definition documentation " +
				"</h1></body></html>");
	})
	
	
// STARTING ...
app.listen(port, function() {
  console.log("Listening requests on " + port);
});
	
	
	
	
	
	
