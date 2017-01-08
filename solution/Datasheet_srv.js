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
var passport = require('passport');

var userController = require('./controllers/user');
var datasetController = require('./controllers/dataset');
var authController = require('./controllers/auth');
var macroController = require('./controllers/macro');
var transformationController = require('./controllers/transformation');
var statisticalController = require('./controllers/statistical');
var Function = require('./controllers/functions');

var User = require('./models/user');
var Dataset = require('./models/dataset');

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
// Use the passport package in our application
app.use(passport.initialize());

var callbackApp = express();
callbackApp.use(bodyParser.json());
callbackApp.use(bodyParser.urlencoded({extended:true}));

const port = process.env.PORT || 3001;
const callbackPort = process.env.PORT || 3005;

/************
 data store
************/

var stats =  {};
var transfs =  {};
var charts = {};
var resultsStoreList = [];
var errors = {};

// FIXED DATA

//Calculate statistical measures of a row, column, entire data set
stats['s1'] = {stat_id: "1",  	desc_stat:"Geometric mean" };
stats['s2'] = {stat_id: "2",  	desc_stat:"Median" };
stats['s3'] = {stat_id: "3",  	desc_stat:"Mode" };
stats['s4'] = {stat_id: "4",  	desc_stat:"Midrange" };
stats['s5'] = {stat_id: "5",  	desc_stat:"Variance" };
stats['s6'] = {stat_id: "6",  	desc_stat:"Standard deviation"};

//Perform transformations on the data set (without changing the original data set)
transfs['t1'] = {transf_id: "1", desc_transfs:"Transpose the dataset" };
transfs['t2'] = {transf_id: "2", desc_transfs:"Scale" };
transfs['t3'] = {transf_id: "3", desc_transfs:"Add a scalar" };
transfs['t4'] = {transf_id: "4", desc_transfs:"Add two data sets" };
transfs['t5'] = {transf_id: "5", desc_transfs:"Multiply two data sets" };
transfs['t6'] = {transf_id: "6", desc_transfs:"Augment the data set using linear interpolation on the rows or columns"};

//Return a chart representation (image binary file) of the dataset
charts['c1'] = {chart_id: "c1",		desc_chart:"Pie chart of a desired row / column"};
charts['c2'] = {chart_id: "c2",		desc_chart:"Line / bar chart of a desired row / column"};
charts['c3'] = {chart_id: "c3",		desc_chart:"Line / bar chart of the entire data set"};

//Erros List
errors['404'] = {code: 404, message: "User or Dataset not found!"};
errors['400'] = {code: 400, message: "Bad Request!"};
errors['405'] = {code: 405, message: "Method not allowed in this resource!"};

//Store Heavy Ops for later consulting
resultsStoreList [0] = {ResultID : 0 , Content: "No results from Heavy Ops to see yet"} ;

// Create our Express router
var router = express.Router();
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
                if (user == null) {
                    res.statusCode = 404;
                    res.setHeader("Content-Type", "application/json");
                    res.json(errors[res.statusCode]);
                    console.log("»»» User " + userID + " was not found! ");

                }
                else {
                    console.log("»»» User " + userID + " founded");
                    Function.setUserID(userID);
                    return next()
                }
            }
            else {
                return err
            }
        }
	);

});
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
        function (err, dataset) {
            if (!err) {
                if (dataset == null) {
                    res.statusCode = 404;
                    res.setHeader("Content-Type", "application/json");
                    res.json(errors[res.statusCode]);
                    console.log("»»» Dataset " + datasetID + " was not found! ");
                }
                else {
                    console.log("»»» Dataset " + datasetID + " founded");
                    Function.setDatasetID(datasetID);
                    return next();
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
	.post(macroController.postMacros)
    .put(macroController.postMacros)
    .delete(macroController.postMacros);

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
app.route("/Users/:userID/Macros/:macroID")
	.get(macroController.getMacro)
    .post(macroController.getMacro)
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
		console.log("»»» Accepted GET to /Stat resource.");
		res.json(stats);
		console.log("»»» Response OK to GET /Stat resource.");
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
		console.log("»»» Accepted GET to /Transfs resource.");
		res.json(transfs);
        console.log("»»» Response OK to GET /Transfs resource.");
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
		console.log("»»» Accepted GET to /Charts resource.");
		res.json(charts);
        console.log("»»» Response OK to GET /Charts resource.");
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

///RESULTS

//
//URL: /Users/:userID/Results
//
//GET 		return stored results for HeavyOps, when ready 200
//POST 		not allowed, returns 405
//PUT 		not allowed, returns 405
//DELETE 	not allowed, returns 405
//
app.route("/Users/:userID/Results/:resultID")
	.get(function(req, res) {
		
		console.log("»»» Accepted GET to /Result resource.");
		res.statusCode = 200;
		res.setHeader("Content-Type", "application/json");
		res.json( resultsStoreList );

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
//URL: /callback/:myRefID
//
//internal usage
//
callbackApp.route("/Callback/:myRefID")
    .post(function(req, res) {

    	res.status(204).send("No Content");

        //persists the result in the resultsStoreList[].
        console.log( "»»» The callback number " + req.params.myRefID + " comes OK and replied 204 to server HeavyOps");
        var resultJson = {};
        resultJson.ResultID = req.params.myRefID;
        resultJson.Content = req.body.result;
        resultsStoreList [ (parseInt(req.params.myRefID) - 1)] = resultJson;
    });

///HEAVY OPS

//
//URL: /Users/:userID/Datasets/:datasetID/Stats?StatID=(?)
//
//GET 		not allowed, returns 405
//POST 		return specific user 202 or 400
//PUT 		not allowed, returns 405
//DELETE 	not allowed, returns 405
//
app.route("/Users/:userID/Datasets/:datasetID/Stats")
    .get(statisticalController.getStatisticals)
    .post(statisticalController.postStatisticals)
    .put(statisticalController.putStatisticals)
    .delete(statisticalController.deleteStatisticals);

//
//URL: /Users/:userID/Datasets/:datasetID/Transfs/:transfID
//
//GET 		not allowed, returns 405
//POST 		return specific user 202 or 400
//PUT 		not allowed, returns 405
//DELETE 	not allowed, returns 405
//
app.route("/Users/:userID/Datasets/:datasetID/Transfs")
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

///RUNNING...

//Starting Listening to Main Server
app.listen(port, function() {
  console.log("Listening requests on " + port);
});

//Starting Listening to Callback Derver
callbackApp.listen(callbackPort, function() {
  console.log("Listening callbacks on " + callbackPort);
});