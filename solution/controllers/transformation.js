var Dataset = require('../models/dataset');
var Transformation = require('../models/transformation');
var Function = require('../controllers/functions');
var request = require('request');

const GEOMETRIC_MEAN = 1;
const MEDIAN = 2;
const MODE = 3;
const MID_RANGE = 4;
const VARIANCE = 5;
const STD_DEVIATION = 6;

var errors = {};
errors['404'] = {code: 404, message: "Transformations type not found!"};
errors['400'] = {code: 400, message: "Bad Request!"};
errors['500'] = {code: 500, message: "Error while processing your request. Please try again later"};

const port = process.env.PORT || 3001;
const SERVER_ROOT = "http://localhost:" + port;

const serverHeavyOpsPort = process.env.PORT || 3002;
const serverHeavyOps = "http://localhost:" + serverHeavyOpsPort;

const callbackPort = process.env.PORT || 3005;
const CALLBACK_ROOT = "http://localhost:" + callbackPort;

exports.getTransformations = function(req, res) {
		res.statusCode = 405;
		res.setHeader("Content-Type", "application/json");
		res.json(errors[res.statusCode]);
};

exports.postTransformations = function(req, res) {

    console.log("»»» Accepted POST to /Transformation resource for TransfID: "
        + req.query.TransfID + " for DatasetID: " + Function.getDatasetID() + " and UserID: " + Function.getUserID() );

    //if de operations type

    if (req.query.TransfID ) {
        callbackID = Function.getSequence();
        var userPoolingURL = SERVER_ROOT + "/Users/" + Function.getUserID() + "/Results/" + callbackID;
        var serverCallbackURL = CALLBACK_ROOT + "/Callback/" + callbackID;

        Dataset.find({ idDataset: Function.getDatasetID() },function (err, dataset) {
            if (err) return console.log(err);
            var datasetV = dataset[0].values;
            console.log(datasetV);
            //setTimeout(function () {
                request({
                        uri: serverHeavyOps + "/HeavyOps/" + Function.getUserID() + "/" + Function.getDatasetID() + "/" + req.query.TransfID,
                        method: "POST",
                        json: {
                            sender: "Datasheet_srv",
                            callbackURL: serverCallbackURL,
                            dataset: datasetV
                        },
                    },
                    function (err) {

                        if (!err && 202 === res.statusCode) {
                            console.log("»»» Posted a Heavy Operation request and got " + res.statusCode);
                            console.log("»»» User Pooling URL = " + userPoolingURL);
                            res.statusCode = 202;
                            res.setHeader("Content-Type", "application/json");
                            res.json( {result_url : userPoolingURL} );
                            
                        } else {
                            console.log("»»» Error trying to reach HeavyOps server. Please contact system administrator.");
                            res.statusCode = 500;
                            res.setHeader("Content-Type", "application/json");
                            res.json(errors[res.statusCode]);
                        }
                    });
            //}, 2000);
        });
    } else {
        res.statusCode = 400;
        res.setHeader("Content-Type", "application/json");
        res.json(errors[res.statusCode]);
    }
};

exports.putTransformations = function(req, res) {
		res.statusCode = 405;
		res.setHeader("Content-Type", "application/json");
        res.json(errors[res.statusCode]);
};

exports.deleteTransformations = function(req, res) {
		res.statusCode = 405;
		res.setHeader("Content-Type", "application/json");
        res.json(errors[res.statusCode]);
};