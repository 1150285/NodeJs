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
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    autoIncrement = require('mongoose-auto-increment');
var jsonParser = bodyParser.json();
var json2html = require('json-to-html')
var matrix = require("node-matrix")
var get = require('simple-object-query').get;
var where = require('simple-object-query').where;

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
//app.use(methodOverride());

var callbackApp = express();
callbackApp.use(bodyParser.json());
callbackApp.use(bodyParser.urlencoded({extended:true}));

// logging : DEBUG
//app.use(express.logger('dev'));

const port = process.env.PORT || 3001;
const SERVER_ROOT = "http://localhost:" + port;

const serverHeavyOpsPort = process.env.PORT || 3002;
const serverHeavyOps = "http://localhost:" + serverHeavyOpsPort;

const callbackPort = process.env.PORT || 3005;
const CALLBACK_ROOT = "http://localhost:" + callbackPort;

var SequenceID = 1;

/************
 data store
************/


var db = mongoose.connection;

db.on('error', console.error);
db.once('open', function() {

});

var datasetSchema = new mongoose.Schema({
	idDataset: Number,
    numRows: Number,
    numCols: Number,
    values: [Number]
});

var connection = mongoose.createConnection('mongodb://localhost/datasetdb');
var Dataset = connection.model('Dataset', datasetSchema);
autoIncrement.initialize(connection);
datasetSchema.plugin(autoIncrement.plugin, { model: 'Dataset', field: 'idDataset' });

var users =  {};
var datasets =  {};
var datasetTableValues = "";
var macros =  {};
var stats =  {};
var transfs =  {};
var charts = {}
var resultsStoreList = [];
var now = new Date();

// INITIAL DATA

//3 users as initial example
users['u1'] = {username: "u1", fullName:"Paulo Afonso",			Password:"node1234", 	createdOn: now, updatedOn: now};
users['u2'] = {username: "u2", fullName:"Leonardo Andrade", 	Password:"node1234", 	createdOn: now, updatedOn: now};
users['u3'] = {username: "u3", fullName:"Paulo Russo",			Password:"node1234", 	createdOn: now, updatedOn: now};


//3 Random Datasets as initial example
function buildRandomDataset(lines, columns) {

    var values = [];
	var dataset_id = "";
	var dataMatrix = matrix({ rows: lines, columns: columns, values: Math.random });
    
    for(var row = 0; row < dataMatrix.numRows; row++) {
    	for(var col = 0; col < dataMatrix.numCols; col++) {
            values.push( 
				Math.round((dataMatrix[row][col]*100), 3) 
			);
        }
    }

    var id = mongoose.Types.ObjectId();
    var dataset = new Dataset({
        numRows: dataMatrix.numRows,
        numCols: dataMatrix.numCols,
        values: values
    });

    dataset.save(
		function(err, dataset) {
			if (err) return console.error(err);
			console.log(dataset);
			dataset_id = dataset.idDataset;
		}
    );	
}

function printDatasetHTML(dataset) {

    var values = [];
    var datasetTableValuesFinal = "";
    for(item = 0; item < dataset.length; item++) {

    	var dataset_id = dataset[item].idDataset;
	    var datasetTableValues = "";
	    var rows = dataset[item].numRows;
	    var cols = dataset[item].numCols;
	    var line = 0;
	    var column = 0;
		var arrayPosition = 0;
	
	    var tableDatasetError = "<html><head>" +
	        "<style>table { font-family: arial, sans-serif; border-collapse: collapse; width: 100%; } " +
	        "td, th { border: 1px solid #dddddd; text-align: center; padding: 8px; } " +
	        "tr:nth-child(even) { background-color: #dddddd; } </style> " +
	        "</head><body><table>" +
	        "<tr>" +
	        "<th>Dataset</th>" +
	        "</tr>" +
	        "<tr>" +
	        "<td>Error. There are no Datasets to see yet. Create one first!</td>" +
	        "</tr>" +
	        "</table></body></html>"
	
	    if (rows != 0) {
	        if (cols != 0) {
	            const tableDatasetHead = "<html><head>" +
	                "<style>table { font-family: arial, sans-serif; border-collapse: collapse; width: 100%; } " +
	                "td, th { border: 1px solid #dddddd; text-align: center; padding: 8px; } " +
	                "tr:nth-child(even) { background-color: #dddddd; } </style> " +
	                "</head><body><table style='width:100%' >";
	
	            var tableDatasetBody =
	                "<tr>" +
	                "<th colspan='" + (cols + 1 ) + "'>Dataset ID: " + dataset_id + "</th>" +
	                "</tr>" +
	                "<tr>" +
	                "<td>Row X Col</td>";
	            for(column = 0; column < cols; column++) {
	
	                tableDatasetBody += "<td>" + (column + 1) + "</td>";
	            }
	            tableDatasetBody +=
	                "</tr>" +
	                "<tr>" ;
	            
                for(line = 0; line < rows; line++) {
                    tableDatasetBody += "<td>" + (line + 1) + "</td>" ;
                    for(column = 0; column < cols; column++) {
                        tableDatasetBody += "<td>" + dataset[item].values[arrayPosition] + "</td>" ;
                        arrayPosition++
                    }
                    tableDatasetBody +=
                        "</tr>" +
                        "<tr>" ;
                }
	            
	            const tableDatasetTail = "</tr></table></body></html>";
	            datasetTableValues = tableDatasetHead + tableDatasetBody + tableDatasetTail;
	        } else {
	            datasetTableValues = tableDatasetError;
	        }
	    } else {
	        datasetTableValues = tableDatasetError;
	    }
	        datasetTableValuesFinal = datasetTableValuesFinal.concat(datasetTableValues);
    }
    return datasetTableValuesFinal;
}
buildRandomDataset(2, 2);
buildRandomDataset(3, 5);
buildRandomDataset(2, 7);

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

//Store Heavy Ops for later consulting
resultsStoreList [1] = {ResultNumber: "No results from Heavy Ops to see yet"} 
/************
global functions
************/

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


/*
 * Function for auto-increment Callbacks ID
 */
function getSequence(seqtype) {
	if (seqtype = "stID")
		return SequenceID++; 
}

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

/**
 * URL: /Users/:userID
 * GET 		return specific user 200 or 404
 * POST 	not allowed, returns 405
 * PUT 		overwrite data for existent user, returns 200, 400 or 404 
 * DELETE 	delete an user, returns 200 or 404
**/

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
//URL: /Users/:userID/Datasets
//
//GET 		return all users, returns 200
//POST		create new entry, returns 201 or 400
//PUT 		not allowed, returns 405
//DELETE 	not allowed, returns 405

app.route("/Users/:userID/Datasets") 
	.get(function(req, res) {
		console.log("»»» Accepted GET to .../Datasets/ resource");
		//var result = "There are no Datasets to this user";
		var result = "";
		var allDatasets = "";
		for(i=0; i < Object.keys(datasets).length; i++){
			allDatasets = "d" + (i+1) + ".datasetValues" ;
			result += get(datasets, allDatasets) ;
		}
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/html");
        Dataset.find(function (err, datasets) {
            if (err) return console.error(err);
            //console.log(datasets);
            res.end(printDatasetHTML(datasets));
        });	
        console.log("»»» Returned GET for all existents Datasets");
	})
	.post(function(req, res) {
		//for debug
		//console.log(req.username + req.body.dataset_id);
		//inserir function para iterar os valores informados para criar o dataset
		//inserir function para validar se a quantidade linhas x colunas fazem match com os valores informados
		
		if (Number (req.body.rows) && Number (req.body.cols) && req.body.values ) {
			console.log("entrei no full");
			var id = mongoose.Types.ObjectId();
            var dataset = new Dataset({
                dataset_id: id,
                rows: req.body.rows,
                cols: req.body.cols,
                values: req.body.values
            });

            dataset.save(function(err, thor) {
                if (err) return console.error(err);
                console.dir(thor);
            });
			
			// send 201 response
			res.statusCode = 201;
			res.setHeader("Content-Type", "application/html");
			res.end("<html><body><h1> " +
					"The specific Dataset: " + dataset_id + " was successfully created for username: " + req.username +
					"</h1></body></html>");
			console.log("»»» The specific Dataset: " + dataset_id + " was successfully created for username: " + req.username);
		} 
		else {
			if (Number (req.body.rows) && Number (req.body.cols) ) {
				
				buildRandomDataset(req.body.rows, req.body.cols);
				
				// send 201 response
				res.statusCode = 201;
				res.setHeader("Content-Type", "application/html");
				res.end("<html><body><h1> " +
						"A Random Dataset for username: " + req.username + " was successfully created. Your DatasetID = " + dataset_id +  
						"</h1></body></html>");
				console.log("»»» A Random Dataset for username: " + req.username + " was successfully created. Your DatasetID = " + dataset_id);
			} 
			else {
			
			res.statusCode = 400;
			res.setHeader("Content-Type", "application/html");
			res.end("<html><body><h1> " +
					"Bad request. Check the definition documentation. " +
					"</h1></body></html>");
			console.log("»»» Bad request. Check the definition documentation.");
			}
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
//URL: /Users/:userID/Datasets/:datasetID
//
//GET 		return specific user 200 or 404
//POST 		not allowed, returns 405
//PUT 		overwrite data for existent user, returns 200, 400 or 404 
//DELETE 	delete an user, returns 200 or 404

app.param('datasetID', function(req, res, next, datasetID){
	req.dataset_id = datasetID;
	return next()
	})

app.route("/Users/:userID/Datasets/:datasetID") 
	.get(function(req, res) {

		if (req.dataset_id) {
			console.log("»»» Accepted GET to /Datasets/ID? resource. ");
			res.statusCode = 200;
			res.setHeader("Content-Type", "application/html");
			//res.end( datasets[req.dataset_id].datasetValues );

            Dataset.find({ idDataset: req.dataset_id },function (err, dataset) {
                if (err) return console.error(err);
                console.log(dataset);
                res.end(printDatasetHTML(dataset));
            })

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
				console.log("»»» Nada a ver " + req.dataset_id + " successfully deleted for username: " + req.username);
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
		
		if (req.username && req.body.macro_id) {
			if (req.body.stat_id || req.body.transf_id || req.body.chart_id) {
											
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
			if (req.body.stat_id || req.body.transf_id || req.body.chart_id) {
									
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

//
//handling individual items in the collection
//
//URL: /Stats
//
//GET 		return specific user 200 or 400
//POST 		not allowed, returns 405
//PUT 		not allowed, returns 405
//DELETE 	not allowed, returns 405
//

app.route("/Stats") 
	.get(function(req, res) {
	//for debug
	//console.log(req.username);
	console.log("»»» Accepted GET to this resource. Develop here what happens");
	res.json(stats);
	})
	.put(function(req, res) {
		res.statusCode = 405;
		res.setHeader("Content-Type", "application/html");
		res.end("<html><body><h1> " +
				"Method not allowed in this resource. Check the definition documentation " +
				"</h1></body></html>");
	})
	.post(function(req, res) {
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

//
//handling individual items in the collection
//
//URL: /Transfs
//
//GET 		return specific user 200 or 400
//POST 		not allowed, returns 405
//PUT 		not allowed, returns 405
//DELETE 	not allowed, returns 405
//
app.route("/Transfs") 
	.get(function(req, res) {
	//for debug
	//console.log(req.username);
	console.log("»»» Accepted GET to this resource. Develop here what happens");
	res.json(transfs);
	})
	.put(function(req, res) {
		res.statusCode = 405;
		res.setHeader("Content-Type", "application/html");
		res.end("<html><body><h1> " +
				"Method not allowed in this resource. Check the definition documentation " +
				"</h1></body></html>");
	})
	.post(function(req, res) {
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
	
//
//handling individual items in the collection
//
//URL: /Charts
//
//GET 		return specific user 200 or 400
//POST 		not allowed, returns 405
//PUT 		not allowed, returns 405
//DELETE 	not allowed, returns 405
//
app.route("/Charts") 
	.get(function(req, res) {
	//for debug
	//console.log(req.username);
	console.log("»»» Accepted GET to this resource. Develop here what happens");
	res.json(charts);
	})
	.put(function(req, res) {
		res.statusCode = 405;
		res.setHeader("Content-Type", "application/html");
		res.end("<html><body><h1> " +
				"Method not allowed in this resource. Check the definition documentation " +
				"</h1></body></html>");
	})
	.post(function(req, res) {
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

//
//URL: /Results
//
//GET 		return specific user 200
//POST 		not allowed, returns 405
//PUT 		not allowed, returns 405
//DELETE 	not allowed, returns 405
//
app.route("/Results") 
	.get(function(req, res) {
		
	var stringList = "";
	console.log("»»» Accepted GET to this resource. Develop here what happens ");
	
	for(var i = 1; i < resultsStoreList.length;i++) {
		stringList += "<p>"+ json2html(resultsStoreList[i]) + "</p>";
	}
	console.log(stringList);
	
	res.statusCode = 200;
	res.setHeader("Content-Type", "application/html");
	res.end("<html><body><h1> Results stored untill now </h1>" +
			stringList +
			"</body></html>");	
	})
	.put(function(req, res) {
		res.statusCode = 405;
		res.setHeader("Content-Type", "application/html");
		res.end("<html><body><h1> " +
				"Method not allowed in this resource. Check the definition documentation " +
				"</h1></body></html>");
	})
	.post(function(req, res) {
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

///HEAVY OPS

//
//URL: /callback/:myRefID
//
//internal usage
//
	
callbackApp.route("/callback/:myRefID") 
  .post(function(req, res) {
    // reply back
    res.status(204).send("No Content");
    // process the response to our callback request
    // handle callbacks that are not sent by our server "security". postman can't invoke this endpoint directly.
    //persists the result in the resultsStoreList[].
    console.log( "The result of callback number " + req.params.myRefID + " is " + req.body.myRefValue );
    
	var resultJson = {};
	resultJson.key = req.params.myRefID;
	resultJson.value = req.body.myRefValue;
	
    resultsStoreList [req.params.myRefID] = resultJson;
	console.log("»»» Received a callback request with: " + req.body.result + " for cliRef = " + req.params.myRefID + " Develop here what happens!!!");
  });


//
//URL: /Users/:userID/Datasets/:datasetID/:statID
//
//GET 		not allowed, returns 405
//POST 		return specific user 202 or 400
//PUT 		not allowed, returns 405
//DELETE 	not allowed, returns 405
//

/*app.param('statID', function(req, res, next, statID){
	req.stat_id = statID;
	return next()
	})*/
	
app.route("/Users/:userID/Datasets/:datasetID/Stats")
	.post(function(req, res) {

		console.log("»»» Accepted POST request to calculate statID:  " + req.query.StatID + "for DatasetID: " + req.dataset_id + " and UserID: " + req.username + " Develop here what happens");
		if (req.username && req.dataset_id && req.query.StatID ) {
			callbackID = getSequence("stID");
            var urlCallback = CALLBACK_ROOT + "/Users/" + req.username + "/Datasets/" + req.dataset_id + "/Stats/"+req.query.StatID+"/Results"

            var datasetV = "";
            Dataset.find({ idDataset: req.dataset_id },function (err, dataset) {
                if (err) return console.error(err);
                console.log(dataset);
                datasetV = dataset[0];
                //setTimeout(function() {
                request({
                        uri : serverHeavyOps + "/HeavyOps/" + req.username + "/" + req.dataset_id + "/" + req.query.StatID,
                        method: "POST",
                        json : {text:"test of callback post", sender:"Datasheet_srv.js", callbackURL: urlCallback, myRef:callbackID , dataset:datasetV},
                    },
                    function(err, res, body){

                        if (!err && 202 === res.statusCode) {
                            console.log("»»» Posted a Heavy Operation request and got " + res.statusCode );
                            console.log("»»» Success!... Gets your callback results within 30 seconds in " + urlCallback  );
                            res.statusCode = 202;
                        } else	{
                            console.log("»»» Internal error in HeavyOps server. Please contact system administrator. Status Code = " + res.statusCode);
                        }
                    });
                //}, 2000);
            })
			res.setHeader("Content-Type", "application/html");
			res.end("<html><body><h1> " +
					"<p>Success!... Your request operation number is " + callbackID + "</p>" +
					"<p>This is a heavy operation so gets your callback result within 30 seconds in <a href='" + urlCallback + "'" + ">Results</a></p>" +
					"<p>Or come back to Home Page to request more operations <a href='http://localhost:3001/index.html'>Home Page</a></p>" +
					"</h1></body></html>");
		} else {
			if (req.username === undefined || req.dataset_id === undefined || req.stat_id === undefined) {
				res.statusCode = 400;
				res.setHeader("Content-Type", "application/html");
				res.end("<html><body><h1> " +
						"Bad request. Check the definition documentation. " +
						"</h1></body></html>");
				console.log("»»» Bad request. Check the definition documentation.");
			} 
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



callbackApp.route("/Users/:userID/Datasets/:datasetID/Stats/:statID/Results/:callbackID")
    .get(function(req, res) {
        res.statusCode = 405;
        res.setHeader("Content-Type", "application/html");
        res.end("<html><body><h1> " +
            "Method not allowed in this resource. Check the definition documentation " +
            "</h1></body></html>");
    })
    .post(function(req, res) {
        // reply back
        res.status(204).send("No Content");
        // process the response to our callback request
        // handle callbacks that are not sent by our server "security". postman can't invoke this endpoint directly.
        //persists the result in the resultsStoreList[].
        console.log( "The result of dataset"+ req.params.statID +" callback number " + req.params.callbackID + " is " + req.url );

        var resultJson = {};
        resultJson.key = req.url;
        resultJson.value = req.body.myRefValue;

        resultsStoreList [req.params.myRefID] = resultJson;
        console.log("»»» Received a callback request with: " + req.body.result + " for cliRef = " + req.url + " Develop here what happens!!!");
    });
	//
//URL: /Users/:userID/Datasets/:datasetID/:transfID
//
//GET 		not allowed, returns 405
//POST 		return specific user 202 or 400
//PUT 		not allowed, returns 405
//DELETE 	not allowed, returns 405
//

app.param('transfID', function(req, res, next, transfID){
	req.transf_id = transfID;
	return next()
	})
	
app.route("/Users/:userID/Datasets/:datasetID/:transfID") 
	.post(function(req, res) {
		console.log("»»» Accepted POST request to calculate transfID: " + req.transf_id + " for DatasetID: " + req.dataset_id + " and UserID: " + req.username + " Develop here what happens");
		if (req.username && req.dataset_id && req.transf_id ) {
			callbackID = getSequence("stID");
						
			//setTimeout(function() {
				request({
					   uri : serverHeavyOps + "/HeavyOps/" + req.username + "/" + req.dataset_id + "/" + req.transf_id,
					   method: "POST",
					   json : {text:"test of callback post", sender:"Datasheet_srv.js", callbackURL: CALLBACK_ROOT + "/callback/", myRef:callbackID},
					}, 
				   function(err, res, body){
						
						if (!err && 202 === res.statusCode) {
							console.log("»»» Posted a Heavy Operation request and got " + res.statusCode );
							console.log("»»» Success!... Gets your callback results within 30 seconds in http://localhost:3001/Results/" + callbackID  );
							res.statusCode = 202;
						} else	{
							console.log("»»» Internal error in HeavyOps server. Please contact system administrator. Status Code = " + res.statusCode);
						}
					});
			//}, 2000);
			res.setHeader("Content-Type", "application/html");
			res.end("<html><body><h1> " +
					"<p>Success!... Your request operation number is " + callbackID + "</p>" +
					"<p>This is a heavy operation so gets your callback result within 30 seconds in <a href='" + "http://localhost:3001/Results/" + "'" + ">Results</a></p>" +
					"<p>Or come back to Home Page to request more operations <a href='http://localhost:3001/index.html'>Home Page</a></p>" +
					"</h1></body></html>");
		} else {
			if (req.username === undefined || req.dataset_id === undefined || req.transf_id === undefined) {
				res.statusCode = 400;
				res.setHeader("Content-Type", "application/html");
				res.end("<html><body><h1> " +
						"Bad request. Check the definition documentation. " +
						"</h1></body></html>");
				console.log("»»» Bad request. Check the definition documentation.");
			} 
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

//
//URL: /Users/:userID/Datasets/:datasetID/:macroID
//
//GET 		not allowed, returns 405
//POST 		return specific user 202 or 400
//PUT 		not allowed, returns 405
//DELETE 	not allowed, returns 405
//
	
app.route("/Users/:userID/Datasets/:datasetID/:macroID") 
	.post(function(req, res) {
		console.log("»»» Accepted POST request to calculate transf_id: " + req.macro_id + " for DatasetID: " + req.dataset_id + " and UserID: " + req.username + " Develop here what happens");
		if (req.username && req.dataset_id && req.macro_id ) {
			callbackID = getSequence("stID");
						
			//setTimeout(function() {
				request({
					   uri : serverHeavyOps + "/HeavyOps/" + req.username + "/" + req.dataset_id + "/" + req.macro_id,
					   method: "POST",
					   json : {text:"test of callback post", sender:"Datasheet_srv.js", callbackURL: CALLBACK_ROOT + "/callback/", myRef:callbackID},
					}, 
				   function(err, res, body){
						
						if (!err && 202 === res.statusCode) {
							console.log("»»» Posted a Heavy Operation request and got " + res.statusCode );
							console.log("»»» Success!... Gets your callback results within 30 seconds in http://localhost:3001/Results/" + callbackID  );
							res.statusCode = 202;
						} else	{
							console.log("»»» Internal error in HeavyOps server. Please contact system administrator. Status Code = " + res.statusCode);
						}
					});
			//}, 2000);
			res.setHeader("Content-Type", "application/html");
			res.end("<html><body><h1> " +
					"<p>Success!... Your request operation number is " + callbackID + "</p>" +
					"<p>This is a heavy operation so gets your callback result within 30 seconds in <a href='" + "http://localhost:3001/Results/" + "'" + ">Results</a></p>" +
					"<p>Or come back to Home Page to request more operations <a href='http://localhost:3001/index.html'>Home Page</a></p>" +
					"</h1></body></html>");
		} else {
			if (req.username === undefined || req.dataset_id === undefined || req.macro_id === undefined) {
				res.statusCode = 400;
				res.setHeader("Content-Type", "application/html");
				res.end("<html><body><h1> " +
						"Bad request. Check the definition documentation. " +
						"</h1></body></html>");
				console.log("»»» Bad request. Check the definition documentation.");
			} 
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

/*
 * RUNNING
 */
	
	
// STARTING ...
app.listen(port, function() {
  console.log("Listening requests on " + port);
});

//STARTING callback
callbackApp.listen(callbackPort, function() {
  console.log("Listening callbacks on " + callbackPort);
});