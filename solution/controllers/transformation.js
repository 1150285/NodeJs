var Dataset = require('../models/dataset');
var Transformation = require('../models/transformation');
var Function = require('../controllers/functions');
var request = require('request');

var errors = {};
errors['404'] = {code: 404, message: "Transformations type not found!"};
errors['400'] = {code: 400, message: "Bad Request!"};
errors['500'] = {code: 500, message: "Error while processing your request. Please try again later"};

//Perform transformations on the data set (without changing the original data set)
const Transpose_dataset = 1;
const Scale = 2;
const Add_scalar = 3;
const Add_two_datasets = 4;
const Multiply_two_datasets = 5;
const Augment_interpolation = 6;

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

    //noinspection JSUnresolvedVariable
    var TID = req.query.TransfID;

    if ( Number (TID) ) {

        if ( TID == Transpose_dataset ) {

            var callbackID = Function.getSequence();
            var userPoolingURL = SERVER_ROOT + "/Users/" + Function.getUserID() + "/Results/" + callbackID;
            var serverCallbackURL = CALLBACK_ROOT + "/Callback/" + callbackID;

            Dataset.findOne({idDataset: Function.getDatasetID()}, {_id: 0, __v: 0}, function (err, dataset) {
                if (err) return console.log(err);

                request(
                    {
                        uri: serverHeavyOps + "/HeavyOps/" + req.query.TransfID,
                        method: "POST",
                        json: {
                            sender: "Datasheet_srv",
                            serverCallbackURL: serverCallbackURL,
                            datasetV: dataset
                        }
                    },
                    function (err, recall) {
                        if (recall === undefined) {
                            console.log("»»» Error trying to reach HeavyOps server. Please contact system administrator.");
                            res.statusCode = 500;
                            res.setHeader("Content-Type", "application/json");
                            res.json(errors[res.statusCode]);
                        }
                        if (!err) {
                            console.log("»»» Posted a Heavy Operation request and got 202 success");
                            console.log("»»» Response to client with pooling URL = " + userPoolingURL);
                            res.statusCode = 202;
                            res.setHeader("Content-Type", "application/json");
                            res.json({result_url: userPoolingURL});
                        }
                    }
                );
            });
        }
        else if ( TID == Scale && Number (req.body.value) ||
                  TID == Add_scalar && Number (req.body.value)) {

            var scalar = req.body.value;
            var callbackID = Function.getSequence();
            var userPoolingURL = SERVER_ROOT + "/Users/" + Function.getUserID() + "/Results/" + callbackID;
            var serverCallbackURL = CALLBACK_ROOT + "/Callback/" + callbackID;

            Dataset.findOne({idDataset: Function.getDatasetID()}, {_id: 0, __v: 0}, function (err, dataset) {
                if (err) return console.log(err);

                request(
                    {
                        uri: serverHeavyOps + "/HeavyOps/" + req.query.TransfID,
                        method: "POST",
                        json: {
                            sender: "Datasheet_srv",
                            serverCallbackURL: serverCallbackURL,
                            datasetV: dataset,
                            scale: scalar
                        }
                    },
                    function (err, recall) {
                        if (recall === undefined) {
                            console.log("»»» Error trying to reach HeavyOps server. Please contact system administrator.");
                            res.statusCode = 500;
                            res.setHeader("Content-Type", "application/json");
                            res.json(errors[res.statusCode]);
                        }
                        if (!err) {
                            console.log("»»» Posted a Heavy Operation request and got 202 success");
                            console.log("»»» Response to client with pooling URL = " + userPoolingURL);
                            res.statusCode = 202;
                            res.setHeader("Content-Type", "application/json");
                            res.json({result_url: userPoolingURL});
                        }
                    }
                );
            });
        }
        else if ( TID == Add_two_datasets && Number (req.body.value) ||
                  TID == Multiply_two_datasets && Number (req.body.value) ) {

            var secondDatasetID = req.body.value;
            var callbackID = Function.getSequence();
            var userPoolingURL = SERVER_ROOT + "/Users/" + Function.getUserID() + "/Results/" + callbackID;
            var serverCallbackURL = CALLBACK_ROOT + "/Callback/" + callbackID;

            Dataset.findOne({idDataset: Function.getDatasetID()}, {_id: 0, __v: 0}, function (err, dataset1) {
                if (err) return console.log(err);

                Dataset.findOne({idDataset: secondDatasetID }, {_id: 0, __v: 0}, function (err, dataset2) {
                    if (err) return console.log(err);

                    request(
                        {
                            uri: serverHeavyOps + "/HeavyOps/" + req.query.TransfID,
                            method: "POST",
                            json: {
                                sender: "Datasheet_srv",
                                serverCallbackURL: serverCallbackURL,
                                datasetV1: dataset1,
                                datasetV2: dataset2
                            }
                        },
                        function (err, recall) {
                            if (recall === undefined) {
                                console.log("»»» Error trying to reach HeavyOps server. Please contact system administrator.");
                                res.statusCode = 500;
                                res.setHeader("Content-Type", "application/json");
                                res.json(errors[res.statusCode]);
                            }
                            if (!err) {
                                console.log("»»» Posted a Heavy Operation request and got 202 success");
                                console.log("»»» Response to client with pooling URL = " + userPoolingURL);
                                res.statusCode = 202;
                                res.setHeader("Content-Type", "application/json");
                                res.json({result_url: userPoolingURL});
                            }
                        }
                    );
                });
            });
        }

        else {
            res.statusCode = 400;
            res.setHeader("Content-Type", "application/json");
            res.json(errors[res.statusCode]);
        }
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


