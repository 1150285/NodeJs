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
var request = require('request');
var passport = require('passport');

var userController = require('./controllers/user');
var datasetController = require('./controllers/dataset');
var authController = require('./controllers/auth');
var macroController = require('./controllers/macro');
var transformationController = require('./controllers/transformation');
var statisticalController = require('./controllers/statistical');

var User = require('./models/user');
var Dataset = require('./models/dataset');

/*var connection = require('./db/db')
var Dataset = require('./models/dataset');*/

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
// Use the passport package in our application
app.use(passport.initialize());

var callbackApp = express();
callbackApp.use(bodyParser.json());
callbackApp.use(bodyParser.urlencoded({extended:true}));

/************
 data store
************/

var stats =  {};
var transfs =  {};
var charts = {};
var resultsStoreList = [];
var errors = {};

// INITIAL DATA

//Calculate statistical measures of a row, column, entire data set
stats['s1'] = {stat_id: "1",  	desc_stat:"Geometric mean" };
stats['s2'] = {stat_id: "2",  	desc_stat:"Median" };
stats['s3'] = {stat_id: "3",  	desc_stat:"Mode" };
stats['s4'] = {stat_id: "4",  	desc_stat:"Midrange" };
stats['s5'] = {stat_id: "5",  	desc_stat:"Variance" };
stats['s6'] = {stat_id: "6",  	desc_stat:"Standard deviation"};

//Perform transformations on the data set (without changing the original data set)
transfs['t1'] = {transf_id: "t1", desc_transfs:"Transpose the dataset" };
transfs['t2'] = {transf_id: "t2", desc_transfs:"Scale" };
transfs['t3'] = {transf_id: "t3", desc_transfs:"Add a scalar" };
transfs['t4'] = {transf_id: "t4", desc_transfs:"Add two data sets" };
transfs['t5'] = {transf_id: "t5", desc_transfs:"Multiply two data sets" };
transfs['t6'] = {transf_id: "t6", desc_transfs:"Augment the data set using linear interpolation on the rows or columns"};

//Return a chart representation (image binary file) of the dataset
charts['c1'] = {chart_id: "c1",		desc_chart:"Pie chart of a desired row / column"};
charts['c2'] = {chart_id: "c2",		desc_chart:"Line / bar chart of a desired row / column"};
charts['c3'] = {chart_id: "c3",		desc_chart:"Line / bar chart of the entire data set"};

//Erros List
errors['404'] = {code: 404, message: "User not found!"};
errors['400'] = {code: 400, message: "Bad Request!"};
errors['405'] = {code: 405, message: "Method not allowed in this resource!"};

//Store Heavy Ops for later consulting
resultsStoreList [1] = {ResultNumber: "No results from Heavy Ops to see yet"} ;

// Create our Express router
var router = express.Router();
// Register all our routes with /api
app.use('/', router);


/// Users

//
//URL: /Users/
//GET 		return all users, returns 200
//POST		create new user, returns 201 or 400
//PUT 		not allowed, returns 405
//DELETE 	not allowed, returns 405
//
router.route('/Users')
	.get(userController.getUsers)
    .post(userController.postUsers)
	.put(userController.putUsers)
	.delete(userController.deleteUsers);

//
//URL: /Users/:userID
//GET 		return specific user 200 or 404
//POST 		not allowed, returns 405
//PUT 		overwrite data for existent user, returns 200, 400 or 404  
//DELETE 	delete an user, returns 200 or 404
//
app.param('userID', function(req, res, next, userID){
	//req.username = userID;

    User.findOne({username: userID}, {username: 1},
        function (err, user) {
            if (!err) {
                console.log("»»» User founded");
                if (user == null) {
                    res.statusCode = 404;
                    res.setHeader("Content-Type", "application/json");
                    res.json(errors[res.statusCode]);
                    console.log("»»» User " + userID + " was not found! ");

                }
                else {
                    return next()
                }
            }
            else {
                return err
            }
        }
	);
})
app.route("/Users/:userID")
	.get(userController.getUser)
	.post(userController.postUser)
	.put(userController.putUser)
	.delete(userController.deleteUser);

///DATASETS

//
//URL: /Users/:userID/Datasets
//GET 		return all datasets, returns 200
//POST		create new dataset, returns 201 or 400
//PUT 		not allowed, returns 405
//DELETE 	not allowed, returns 405

app.route("/Users/:userID/Datasets")
    .get(authController.isAuthenticated,datasetController.getDatasets)
	.post(authController.isAuthenticated,datasetController.postDatasets)
	.put(authController.isAuthenticated,datasetController.putDatasets)
	.delete(authController.isAuthenticated,datasetController.deleteDatasets)
    ;

//
//URL: /Users/:userID/Datasets/:datasetID
//GET 		return specific dataset 200 or 404
//POST 		not allowed, returns 405
//PUT 		overwrite data for existent dataset, returns 200, 400 or 404 
//DELETE 	delete an dataset, returns 200 or 404

app.param('datasetID', function(req, res, next, datasetID){
	//req.dataset_id = datasetID;
    Dataset.findOne({idDataset: datasetID}, {idDataset: 1},
        function (err, user) {
            if (!err) {
                console.log("»»» Dataset founded");
                if (user == null) {
                    res.statusCode = 404;
                    res.setHeader("Content-Type", "application/json");
                    res.json(errors[res.statusCode]);
                    console.log("»»» Dataset " + datasetID + " was not found! ");
                }
                else {
                    return next()
                }
            }
            else {
                return err
            }
        }
    );

});
app.route("/Users/:userID/Datasets/:datasetID")
    .get(authController.isAuthenticated,datasetController.getDataset)
	.post(authController.isAuthenticated,datasetController.postDataset)	
	.put(authController.isAuthenticated,datasetController.putDataset)
	.delete(authController.isAuthenticated,datasetController.deleteDataset);


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

/*app.param('macroID', function(req, res, next, macroID){
	req.macro_id = macroID;
	return next()
	})*/

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
		res.setHeader("Content-Type", "application/json");
		res.json(errors[res.statusCode]);
	})
	.post(function(req, res) {
		res.statusCode = 405;
		res.setHeader("Content-Type", "application/json");
		res.json(errors[res.statusCode]);
	})
	.delete(function(req, res) {
		res.statusCode = 405;
		res.setHeader("Content-Type", "application/json");
		res.json(errors[res.statusCode]);
	});

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
		res.setHeader("Content-Type", "application/json");
        res.json(errors[res.statusCode]);
	})
	.post(function(req, res) {
		res.statusCode = 405;
		res.setHeader("Content-Type", "application/json");
        res.json(errors[res.statusCode]);
	})
	.delete(function(req, res) {
		res.statusCode = 405;
		res.setHeader("Content-Type", "application/json");
        res.json(errors[res.statusCode]);
	});
	
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
		res.setHeader("Content-Type", "application/json");
        res.json(errors[res.statusCode]);
	})
	.post(function(req, res) {
		res.statusCode = 405;
		res.setHeader("Content-Type", "application/json");
        res.json(errors[res.statusCode]);
	})
	.delete(function(req, res) {
		res.statusCode = 405;	
		res.setHeader("Content-Type", "application/json");
        res.json(errors[res.statusCode]);
	});

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
	res.setHeader("Content-Type", "application/json");
	res.end("<html><body><h1> Results stored untill now </h1>" +
			stringList +
			"</body></html>");	
	})
	.put(function(req, res) {
		res.statusCode = 405;
		res.setHeader("Content-Type", "application/json");
		res.json(errors[res.statusCode]);
	})
	.post(function(req, res) {
		res.statusCode = 405;
		res.setHeader("Content-Type", "application/json");
		res.json(errors[res.statusCode]);
	})
	.delete(function(req, res) {
		res.statusCode = 405;
		res.setHeader("Content-Type", "application/json");
		res.json(errors[res.statusCode]);
	});

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
	
app.route("/Users/:userID/Datasets/:datasetID/Stats")
	.post(statisticalController.postStatisticals);

callbackApp.route("/Users/:userID/Datasets/:datasetID/Transf/:transfID/Results/:callbackID")
    .get(function(req, res) {
        res.statusCode = 405;
        res.setHeader("Content-Type", "application/json");
        res.json(errors[res.statusCode]);
    })
    .post(function(req, res) {
        // reply back
        res.status(204).send("No Content");
        // process the response to our callback request
        // handle callbacks that are not sent by our server "security". postman can't invoke this endpoint directly.
        //persists the result in the resultsStoreList[].
        console.log( "The result of dataset "+ req.params.statID +" callback number " + req.params.callbackID + " is " + req.url );

        var resultJson = {};
        resultJson.key = req.url;
        resultJson.value = req.body.myRefValue;

        resultsStoreList [req.params.myRefID] = resultJson;
        console.log("»»» Received a callback request with: " + req.body.result + " for cliRef = " + req.url);
    });
	//
//URL: /Users/:userID/Datasets/:datasetID/:transfID
//
//GET 		not allowed, returns 405
//POST 		return specific user 202 or 400
//PUT 		not allowed, returns 405
//DELETE 	not allowed, returns 405
//

app.route("/Users/:userID/Datasets/:datasetID/Transf")
	.get(transformationController.getTransformations)
	.post(transformationController.postTransformations)
	.put(transformationController.putTransformations)
	.delete(transformationController.deleteTransformations);

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