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

var jsonParser = bodyParser.json();
var json2html = require('json-to-html')
var get = require('simple-object-query').get;
var where = require('simple-object-query').where;
var passport = require('passport');

var userController = require('./controllers/user');
var datasetController = require('./controllers/dataset');
var authController = require('./controllers/auth');
var macroController = require('./controllers/macro');
var transformationController = require('./controllers/transformation');
var statisticalController = require('./controllers/statistical');

/*var connection = require('./db/db')
var Dataset = require('./models/dataset');*/


var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
//app.use(methodOverride());

// Use the passport package in our application
app.use(passport.initialize());

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



/************
 data store
************/

/*

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

 */
//var connection = mongoose.createConnection('mongodb://localhost/datasetdb');
//var Dataset = connection.model('Dataset', datasetSchema);




//mongoose.connect('mongodb://localhost/datasetdb');

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

datasetController.buildRandomDataset(2, 2);
datasetController.buildRandomDataset(3, 5);
datasetController.buildRandomDataset(2, 7);

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





// Create our Express router
var router = express.Router();
// Register all our routes with /api
app.use('/', router);

//
//URL: /Users
//
//GET 		return all users, returns 200
//POST		create new entry, returns 201 or 400
//PUT 		not allowed, returns 405
//DELETE 	not allowed, returns 405
//
router.route('/Users')
    .post(userController.postUsers)
	.put(userController.putUsers)
    .get(userController.getUsers);

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
	.get(userController.getUser)
	.put(authController.isAuthenticated,userController.putUser)
	.delete(authController.isAuthenticated,userController.deleteUser);

///DATASETS

//
//URL: /Users/:userID/Datasets
//
//GET 		return all users, returns 200
//POST		create new entry, returns 201 or 400
//PUT 		not allowed, returns 405
//DELETE 	not allowed, returns 405

app.route("/Users/:userID/Datasets")
    .post(datasetController.postDatasets)
    .get(datasetController.getDatasets);

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
	});

app.route("/Users/:userID/Datasets/:datasetID")
    .put(datasetController.putDataset)
    .get(datasetController.getDataset)
	.delete(datasetController.deleteDataset);


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
	.get(macroController.getMacros)
	.post(macroController.postMacros);

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
	.get(macroController.getMacro)
	.put(macroController.putMacro)
	.delete(macroController.deleteMacro);

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
	.post(statisticalController.postStatisticals);

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
	.post(transformationController.postTransformations);

//
//URL: /Users/:userID/Datasets/:datasetID/:macroID
//
//GET 		not allowed, returns 405
//POST 		return specific user 202 or 400
//PUT 		not allowed, returns 405
//DELETE 	not allowed, returns 405
//
	
app.route("/Users/:userID/Datasets/:datasetID/:macroID")
	.post(macroController.postMacro);

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