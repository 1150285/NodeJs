///////////////////////////////////////////////////////
//
// Leonardo Marques de Andrade, Paulo Afonso, Paulo Russo (1160091, 1161660 e 1150285)
// PSIDI / MEI / ISEP
// (c) 2016
//
///////////////////////////////////////////////////////


//
// Check Readme and Documentation to understand how this servers works
//


var express = require('express');
var bodyParser = require('body-parser');
//var methodOverride = require('method-override');

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
//app.use(methodOverride());

// logging : DEBUG
//app.use(express.logger('dev'));


/************/
// data
/************/

const port = process.env.PORT || 3001;
const SERVER_ROOT = "http://localhost:" + port;

// DATA STORE

var users =  {};
var datasets =  {};
var datasetsValues1 = [];
var datasetsValues2 = [];
var macros =  {};
var stats =  {};
var transfs =  {};
var charts = {}

// INITIAL DATA

var now = new Date();

users['u1'] = {username: "u1", fullName:"Paulo Afonso",			Password:"node1234", 	createdOn: now, updatedOn: now};
users['u2'] = {username: "u2", fullName:"Leonardo Andrade", 	Password:"node1234", 	createdOn: now, updatedOn: now};
users['u3'] = {username: "u3", fullName:"Paulo Russo",			Password:"node1234", 	createdOn: now, updatedOn: now};

datasetsValues1 = [1,2,3,4];
datasetsValues2 = [1,2,3,4,5,6,7,8,9];

datasets['d1'] = {dataset_id: "d1", rows:2, 	cols:2, 	values:datasetsValues1, 	createdOn: now, updatedOn: now};
datasets['d2'] = {dataset_id: "d2", rows:3, 	cols:3, 	values:datasetsValues2, 	createdOn: now, updatedOn: now};

//A group of functions to Calculate Stats or Transfs and Prints Charts in a row 
macros['m1'] = {content: "s1,t1,c1", 			createdOn: now, updatedOn: now};
macros['m2'] = {content: "s1,t1,c1,s2,t2,c2", 	createdOn: now, updatedOn: now};

//Calculate statistical measures of a row, column, entire data set
stats['s1'] = {stat_id: "s1",  	desc_stat:"Geometric mean" };
stats['s2'] = {stat_id: "s2",  	desc_stat:"Median" };
stats['s3'] = {stat_id: "s3",  	desc_stat:"Mode" };
stats['s4'] = {stat_id: "s4",  	desc_stat:"Midrange" };
stats['s5'] = {stat_id: "s5",  	desc_stat:"Variance" };
stats['s6'] = {stat_id: "s6",  	desc_stat:"Standard deviation"};

//Perform transformations on the data set (without changing the original data set)
transfs['t1'] = {transf_id: "t1", desc_transfs:"Transpose the dataset" };
transfs['t2'] = {transf_id: "t2", desc_transfs:"Scale" };
transfs['t3'] = {transf_id: "t3", desc_transfs:"Add a scalar" };
transfs['t4'] = {transf_id: "t4", desc_transfs:"Add two data sets" };
transfs['t5'] = {transf_id: "t5", desc_transfs:"Multiply two data sets" };
transfs['t6'] = {transf_id: "t6", desc_transfs:"Augment the data set using linear interpolation on the rows or columns",};

//Return a chart representation (image binary file) of the dataset
charts['c1'] = {chart_id: "c1",		desc_chart:"Pie chart of a desired row / column"};
charts['c2'] = {chart_id: "c2",		desc_chart:"Line / bar chart of a desired row / column"};
charts['c3'] = {chart_id: "c3",		desc_chart:"Line / bar chart of the entire data set"};

//
// helper functions
//

function buildMessageCreation(newID, text, user){
	const now = new Date();
	return {
			id : newID, 
			text : text,
			sender : user, 
			createdOn : now,
		};
}

function buildMessageUpdate(newID, text, user){
	const now = new Date();
	return {
			id : newID, 
			text : text,
			sender : user, 
			updatedOn: now,
		};
}

//
//handling the collection
//
//URL: /Users
//
//GET 		return all users, returns 200
//POST		create new entry, returns 201 or 400
//PUT 		not allowed, returns 405
//DELETE 	not allowed, returns 405
//

app.route("/Users") 
	.get(function(req, res) {
		//TODO = Develop here what happens
		console.log("»»» Accepted GET to this resource. Develop here what happens");
		
		res.json(users);
	})
	.post(function(req, res) {
		//for debug
		//console.log(req.body.username + req.body.password);
		if (req.body.username && req.body.password) {
						
			//TODO = Develop here what happens
			console.log("»»» Accepted POST to this resource. Develop here what happens");
			
			
			// send 201 response
			res.statusCode = 201;
			res.setHeader("Content-Type", "application/html");
			res.end("<html><body><h1> " +
					"The username: " + req.body.username + " was successfully created! " +
					"</h1></body></html>");
			console.log("»»» Username: " + req.username + " was successfully created!");

		}
		else {
			res.statusCode = 400;
			res.setHeader("Content-Type", "application/html");
			res.end("<html><body><h1> " +
					"Bad request. Check the definition documentation. " +
					"</h1></body></html>");
			console.log("»»» Bad request. Check the definition documentation.");	
		}
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
	});

//
//handling individual items in the collection
//
//URL: /Users/:userID
//
//GET 		return specific user 200 or 404
//POST 		not allowed, returns 405
//PUT 		overwrite data for existent user, returns 200, 400 or 404 
//DELETE 	delete an user, returns 200 or 404

//

app.param('userID', function(req, res, next, userID){
req.username = userID;
return next()
})
app.route("/Users/:userID") 
	.get(function(req, res) {
		//for debug
		//console.log(req.body.fullName + req.username + req.body.password);
		if (req.username) {
			console.log("»»» Accepted GET to this resource. Develop here what happens");
			res.json(users[req.username])
		} else {
			res.statusCode = 404 ;
			res.setHeader("Content-Type", "application/html");
			res.end("<html><body><h1> " +
					"User " + req.username + " not found! " +
					"</h1></body></html>");
			console.log("»»» User " + req.username + " not found!");
		}
		
	})
	.put(function(req, res) {
		//for debug
		//console.log(req.body.fullName + req.username + req.body.password);
		if (req.username && req.body.fullName && req.body.password || 
				req.username && req.body.password ||
				req.username && req.body.fullName) {
						
			//TODO = Develop here what happens
			console.log("»»» Accepted PUT to this resource. Develop here what happens");
			
			
			// send 200 response
			res.statusCode = 200;
			res.setHeader("Content-Type", "application/html");
			res.end("<html><body><h1> " +
					"User " + req.username + " successfully updated! " +
					"</h1></body></html>");
			console.log("»»» User " + req.username + " successfully updated!");
		}
		else {
			if (req.username === undefined) {
				res.statusCode = 404 ;
				res.setHeader("Content-Type", "application/html");
				res.end("<html><body><h1> " +
						"User " + req.username + " not found! " +
						"</h1></body></html>");
				console.log("»»» User " + req.username + " not found!");		
			} else {
				res.statusCode = 400;
				res.setHeader("Content-Type", "application/html");
				res.end("<html><body><h1> " +
						"Bad request. Check the definition documentation. " +
						"</h1></body></html>");
				console.log("»»» Bad request. Check the definition documentation.");
			}
		}
	})
	.post(function(req, res) {
		res.statusCode = 405;
		res.setHeader("Content-Type", "application/html");
		res.end("<html><body><h1> " +
				"Method not allowed in this resource. Check the definition documentation " +
				"</h1></body></html>");
	})
	.delete(function(req, res) {
		var entry = users[req.username];
		if (entry === undefined) {
			res.statusCode = 404 ;
			res.setHeader("Content-Type", "application/html");
			res.end("<html><body><h1> " +
					"User " + req.username + " not found! " +
					"</h1></body></html>");
			console.log("»»» User " + req.username + " not found!");
		}
		else {
			delete users[req.username];
			res.statusCode = 204 ;
			res.setHeader("Content-Type", "application/html");
			res.end("<html><body><h1> " +
					"User " + req.username + " successfully deleted! " +
					"</h1></body></html>");
			console.log("»»» User " + req.username + " successfully deleted!");
		}
	});


///DATASETS


//
//handling individual items in the collection
//
//URL: /Users/:userID/Datasets
//
//GET 		return all users, returns 200
//POST		create new entry, returns 201 or 400
//PUT 		not allowed, returns 405
//DELETE 	not allowed, returns 405

//

app.route("/Users/:userID/Datasets") 
	.get(function(req, res) {
		//for debug
		//console.log(req.body.fullName + req.username + req.body.password);
		console.log("»»» Accepted GET to this resource. Develop here what happens");
		res.json(datasets);
		
	})
	.post(function(req, res) {
		//for debug
		//console.log(req.username + req.body.dataset_id);
		//inserir function para iterar os valores informados para criar o dataset
		//inserir function para validar se a quantidade linhas x colunas fazem match com os valores informados
		
		if (req.username && req.body.dataset_id && req.body.rows && req.body.cols && req.body.values ) {
						
			//TODO = Develop here what happens
			console.log("»»» Accepted POST to this resource. Develop here what happens");
			
			// send 201 response
			res.statusCode = 201;
			res.setHeader("Content-Type", "application/html");
			res.end("<html><body><h1> " +
					"The Dataset: " + req.body.dataset_id + " was successfully created for username: " + req.username +
					"</h1></body></html>");
			console.log("»»» Dataset: " + req.body.dataset_id + " was successfully created for username: " + req.username);
		}
		else {
			res.statusCode = 400;
			res.setHeader("Content-Type", "application/html");
			res.end("<html><body><h1> " +
					"Bad request. Check the definition documentation. " +
					"</h1></body></html>");
			console.log("»»» Bad request. Check the definition documentation.");	
		}
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
	});


//
//handling individual items in the collection
//
//URL: /Users/:userID/Datasets/:datasetID
//
//GET 		return specific user 200 or 404
//POST 		not allowed, returns 405
//PUT 		overwrite data for existent user, returns 200, 400 or 404 
//DELETE 	delete an user, returns 200 or 404

//


app.param('datasetID', function(req, res, next, datasetID){
req.dataset_id = datasetID;
return next()
})

app.route("/Users/:userID/Datasets/:datasetID") 
	.get(function(req, res) {
		//for debug
		//console.log(req.body.fullName + req.username + req.body.password);
		if (req.dataset_id) {
			console.log("»»» Accepted GET to this resource. Develop here what happens");
			res.json(datasets[req.dataset_id]);
		} else {
			res.statusCode = 404 ;
			res.setHeader("Content-Type", "application/html");
			res.end("<html><body><h1> " +
					"Datase: or User " + req.dataset_id + " or " + req.username + " not found! " +
					"</h1></body></html>");
			console.log("»»» Dataset or User " + req.dataset_id + " or " + req.username + " not found! ");
		}
		
	})
	.put(function(req, res) {
		//for debug
		//console.log(req.body.fullName + req.username + req.body.password);
		if (req.username && req.dataset_id) {
						
			//TODO = Develop here what happens
			console.log("»»» Accepted PUT to this resource. Develop here what happens");
						
			// send 200 response
			res.statusCode = 200;
			res.setHeader("Content-Type", "application/html");
			res.end("<html><body><h1> " +
					"Dataset: " + req.dataset_id + " successfully updated! " +
					"</h1></body></html>");
			console.log("»»» Dataset: " + req.dataset_id + " successfully updated!");
		}
		else {
			if (req.username === undefined || req.dataset_id === undefined ) {
				res.statusCode = 404 ;
				res.setHeader("Content-Type", "application/html");
				res.end("<html><body><h1> " +
						"Dataset or User " + req.dataset_id + " or " + req.username + " not found! " +
						"</h1></body></html>");
				console.log("»»» Dataset or User " + req.dataset_id + " or " + req.username + " not found! ");		
			} else {
				res.statusCode = 400;
				res.setHeader("Content-Type", "application/html");
				res.end("<html><body><h1> " +
						"Bad request. Check the definition documentation. " +
						"</h1></body></html>");
				console.log("»»» Bad request. Check the definition documentation.");
			}
		}
	})
	.post(function(req, res) {
		res.statusCode = 405;
		res.setHeader("Content-Type", "application/html");
		res.end("<html><body><h1> " +
				"Method not allowed in this resource. Check the definition documentation " +
				"</h1></body></html>");
	})
	.delete(function(req, res) {
		if (req.username === undefined || req.dataset_id === undefined ) {
			
			console.log("»»» Accepted DELETE to this resource. Develop here what happens");
			
			res.statusCode = 404 ;
			res.setHeader("Content-Type", "application/html");
			res.end("<html><body><h1> " +
					"Dataset or User " + req.dataset_id + " or " + req.username + " not found! " +
					"</h1></body></html>");
			console.log("»»» Dataset or User " + req.dataset_id + " or " + req.username + " not found! ");
		}
		else {
			if (req.username && req.dataset_id) {
				
				delete datasets[req.dataset_id];
				
				console.log("»»» Accepted DELETE to this resource. Develop here what happens");
				
				res.statusCode = 200 ;
				res.setHeader("Content-Type", "application/html");
				res.end("<html><body><h1> " +
						"Dataset: " + req.dataset_id + " successfully deleted for username: " + req.username +
						"</h1></body></html>");
				console.log("»»» Dataset: " + req.dataset_id + " successfully deleted for username: " + req.username);
			} else {
				res.statusCode = 400;
				res.setHeader("Content-Type", "application/html");
				res.end("<html><body><h1> " +
						"Bad request. Check the definition documentation. " +
						"</h1></body></html>");
				console.log("»»» Bad request. Check the definition documentation.");
			}
		}
	});

///MACROS

//
//handling individual items in the collection
//
//URL: /Users/:userID/Macros
//
//GET 		return all users, returns 200
//POST		create new entry, returns 201 or 400
//PUT 		not allowed, returns 405
//DELETE 	not allowed, returns  405
//

app.route("/Users/:userID/Macros") 
	.get(function(req, res) {
		//for debug
		//console.log(req.username);
		console.log("»»» Accepted GET to this resource. Develop here what happens");
		res.json(macros);
		
	})
	.post(function(req, res) {
		//for debug
		//console.log(req.username + req.body.macro_id);
		//inserir function para iterar os valores informados para criar a macro
		//inserir function para validar se a quantidade linhas x colunas fazem match com os valores informados
		
		if (req.username && req.body.macro_id && req.body.stat_id && req.body.transf_id && req.body.chart_id ) {
						
			//TODO = Develop here what happens
			console.log("»»» Accepted POST to this resource. Develop here what happens");
			
			// send 201 response
			res.statusCode = 201;
			res.setHeader("Content-Type", "application/html");
			res.end("<html><body><h1> " +
					"The Macro: " + req.body.macro_id + " was successfully created for username: " + req.username +
					"</h1></body></html>");
			console.log("»»» Macro: " + req.body.macro_id + " was successfully created for username: " + req.username);
		}
		else {
			res.statusCode = 400;
			res.setHeader("Content-Type", "application/html");
			res.end("<html><body><h1> " +
					"Bad request. Check the definition documentation. " +
					"</h1></body></html>");
			console.log("»»» Bad request. Check the definition documentation.");	
		}
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
	});

//
//handling individual items in the collection
//
//URL: /Users/:userID/Macros/:macroID
//
//GET 		return specific user 200 or 404
//POST 		not allowed, returns 405
//PUT 		overwrite data for existent user, returns 200, 400 or 404 
//DELETE 	delete an user, returns 200 or 404
//

app.param('macroID', function(req, res, next, macroID){
	req.macro_id = macroID;
	return next()
	})

app.route("/Users/:userID/Macros/:macroID") 
	.get(function(req, res) {
		//for debug
		//console.log(req.username + req.macro_id);
		if (req.macro_id) {
			console.log("»»» Accepted GET to this resource. Develop here what happens");
			res.json(macros[req.macro_id]);
		} else {
			res.statusCode = 404 ;
			res.setHeader("Content-Type", "application/html");
			res.end("<html><body><h1> " +
					"Macro or User " + req.macro_id + " or " + req.username + " not found! " +
					"</h1></body></html>");
			console.log("»»» Macro or User " + req.macro_id + " or " + req.username + " not found! ");
		}
		
	})
	.put(function(req, res) {
		//for debug
		//console.log(req.username + req.macro_id);
		if (req.username && req.macro_id) {
						
			//TODO = Develop here what happens
			console.log("»»» Accepted PUT to this resource. Develop here what happens");
						
			// send 200 response
			res.statusCode = 200;
			res.setHeader("Content-Type", "application/html");
			res.end("<html><body><h1> " +
					"Macro: " + req.macro_id + " successfully updated! " +
					"</h1></body></html>");
			console.log("»»» Macro: " + req.macro_id + " successfully updated!");
		}
		else {
			if (req.username === undefined || req.macro_id === undefined ) {
				res.statusCode = 404 ;
				res.setHeader("Content-Type", "application/html");
				res.end("<html><body><h1> " +
						"Macro: or User " + req.macro_id + " or " + req.username + " not found! " +
						"</h1></body></html>");
				console.log("»»» Macro: or User " + req.macro_id + " or " + req.username + " not found! ");		
			} else {
				res.statusCode = 400;
				res.setHeader("Content-Type", "application/html");
				res.end("<html><body><h1> " +
						"Bad request. Check the definition documentation. " +
						"</h1></body></html>");
				console.log("»»» Bad request. Check the definition documentation.");
			}
		}
	})
	.post(function(req, res) {
		res.statusCode = 405;
		res.setHeader("Content-Type", "application/html");
		res.end("<html><body><h1> " +
				"Method not allowed in this resource. Check the definition documentation " +
				"</h1></body></html>");
	})
	.delete(function(req, res) {
		if (req.username === undefined || req.macro_id === undefined ) {
			
			console.log("»»» Accepted DELETE to this resource. Develop here what happens");
			
			res.statusCode = 404 ;
			res.setHeader("Content-Type", "application/html");
			res.end("<html><body><h1> " +
					"Macro or User " + req.macro_id + " or " + req.username + " not found! " +
					"</h1></body></html>");
			console.log("»»» Macro or User " + req.macro_id + " or " + req.username + " not found! ");
		}
		else {
			if (req.username && req.macro_id) {
				
				delete macros[req.macro_id];
				
				console.log("»»» Accepted DELETE to this resource. Develop here what happens");
				
				res.statusCode = 200 ;
				res.setHeader("Content-Type", "application/html");
				res.end("<html><body><h1> " +
						"Macro: " + req.macro_id + " successfully deleted for username: " + req.username +
						"</h1></body></html>");
				console.log("»»» Macro: " + req.macro_id + " successfully deleted for username: " + req.username);
			} else {
				res.statusCode = 400;
				res.setHeader("Content-Type", "application/html");
				res.end("<html><body><h1> " +
						"Bad request. Check the definition documentation. " +
						"</h1></body></html>");
				console.log("»»» Bad request. Check the definition documentation.");
			}
		}
	});



/////////////////////////////
// STARTING ...

app.listen(port, function() {
  console.log("Listening on " + port);
});