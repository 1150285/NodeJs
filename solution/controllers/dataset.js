var Dataset = require('../models/dataset');
var Functions = require('../controllers/functions');
var matrix = require("node-matrix");
var mongoose = require('mongoose');

//Functions.buildRandomDataset(2, 2);
//Functions.buildRandomDataset(3, 5);
//Functions.buildRandomDataset(2, 7);

var errors = {};
errors['404'] = {code: 404, message: "Item not found!"};
errors['409'] = {code: 409, message: "Conflict, item already exists!"};
errors['400'] = {code: 400, message: "Bad Request!"};
errors['405'] = {code: 405, message: "Method not allowed in this resource!"};

exports.getDatasets = function(req, res) {

	console.log("»»» Accepted GET to .../Datasets/ resource");

        Dataset.find({}, {_id: 0, __v: 0}, function (err, datasets) {
            if (err) {
                res.statusCode = 404;
                res.setHeader("Content-Type", "application/json");
                res.json(errors[statusCode]);
                console.log("»»» None datasets found! ");
                return console.error(err);
            }
            else {
                if (datasets.length === 0) {

                    res.statusCode = 404;
                    res.setHeader("Content-Type", "application/json");
                    res.json(errors[statusCode]);
                    console.log(datasets);
                    console.log("»»» None datasets found! ");
                }
                else {
                    res.statusCode = 200;
                    res.setHeader("Content-Type", "application/json");
                    res.json(datasets);
                    console.log("»»» Returned GET with an existent Dataset");
                }
            }
        });

};

exports.postDatasets = function(req, res) {
	console.log("»»» Accepted POST to .../Datasets/ resource");

	//check if array exists. If create a random.
    if ( req.body.values.length ) {

    	if (Number (req.body.rows) && Number (req.body.cols) && req.body.values ) {

		    var arraySize = (req.body.rows * req.body.cols );
            if (arraySize === req.body.values.length) {

                var dataset = new Dataset({
                    dataset_id: mongoose.Types.ObjectId(),
                    numRows: req.body.rows,
                    numCols: req.body.cols,
                    values: req.body.values
                });
                dataset.save(
                    function (err, dataset) {
                        if (err) {
                            res.statusCode = 400;
                            res.setHeader("Content-Type", "application/json");
                            res.json(errors[res.statusCode]);
                            console.log("»»» Bad request. Check the definition documentation.");
                            return console.error(err);
                        }
                        else {
                            var dataset_id = dataset.idDataset;
                            // send 201 response

                            res.statusCode = 201;
                            res.setHeader("Content-Type", "application/json");
                            res.json({"dataset_id": dataset_id});
                            console.log(dataset);
                            console.log("»»» Your specific Dataset: " + dataset_id + " was successfully created for username: " + req.username);
                        }
                    }
                );
            } else {
                res.statusCode = 400;
                res.setHeader("Content-Type", "application/json");
                res.json(errors[res.statusCode]);
                console.log("»»» Bad request. Check the definition documentation.");
            }
        }
        else if (Number (req.body.rows) && Number (req.body.cols) ) {
			
			var values = [];
			var dataMatrix = matrix({ rows: req.body.rows, columns: req.body.cols, values: Math.random });
			
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
					if (err) {
						res.statusCode = 400;
						res.setHeader("Content-Type", "application/json");
						res.json(errors[res.statusCode]);
						console.log("»»» Bad request. Check the definition documentation.");
						return console.error(err);
					} else {
						var dataset_id = dataset.idDataset;
						// send 201 response
						res.statusCode = 201;
						res.setHeader("Content-Type", "application/json");
                        res.json( {"dataset_id": dataset_id} );
						console.log("»»» A Random Dataset for username: " + req.username + " was successfully created. Your DatasetID = " + dataset_id);
					}
					console.log(dataset);
				}
			);		
		} else {
			res.statusCode = 400;
			res.setHeader("Content-Type", "application/json");
			res.json(errors[res.statusCode]);
			console.log("»»» Bad request. Check the definition documentation.");
		}
	} else {
        res.statusCode = 400;
        res.setHeader("Content-Type", "application/json");
        res.json(errors[res.statusCode]);
        console.log("»»» Bad request. Check the definition documentation.");
    }
};

exports.putDatasets = function(req, res) {
		res.statusCode = 405;
		res.setHeader("Content-Type", "application/json");
		res.json(errors[res.statusCode]);
};

exports.deleteDatasets = function(req, res) {
		res.statusCode = 405;
		res.setHeader("Content-Type", "application/json");
		res.json(errors[res.statusCode]);
};

//////////////

exports.getDataset = function(req, res) {

	console.log("»»» Accepted GET to /Datasets/ID? resource.");
	if (req.dataset_id) {

		Dataset.find({ idDataset: req.dataset_id } ,{_id:0, __v:0},function (err, dataset) {
			if (err) {
				res.statusCode = 404 ;
				res.setHeader("Content-Type", "application/json");
				res.json(errors[statusCode]);
				console.log("»»» Dataset: " + req.dataset_id + " was not found! ");
				return console.error(err);
			}
			else {
				if (dataset.length === 0) {
					res.statusCode = 404 ;
					res.setHeader("Content-Type", "application/json");
					res.json(errors[statusCode]);
					console.log("»»» Dataset: " + req.dataset_id + " was not found! ");
					console.log(dataset);
				}
				else {
					res.statusCode = 200;
					res.setHeader("Content-Type", "application/json");
					res.json(Functions.printOneDatasetJson(dataset));
					console.log(dataset);
					console.log("»»» Returned GET for the existent Dataset");
				}
			}
		});
	}
};

exports.postDataset = function (req, res) {
    res.statusCode = 405;
    res.setHeader("Content-Type", "application/json");
    res.json(errors[statusCode]);
};

exports.putDataset = function (req, res) {

    console.log("»»» Accepted PUT to /Datasets/ID resource.");

    //check if array exists. If create a random.
    if ( req.body.values.length ) {

        if (Number (req.body.numRows) && Number (req.body.numCols) && req.body.values ) {

            var arraySize = (req.body.numRows * req.body.numCols );
            if (arraySize === req.body.values.length) {

                Dataset.findOneAndUpdate(
                    {idDataset: req.params.datasetID},
                    {$set: {numRows: req.body.numRows,numCols: req.body.numCols,values: req.body.values}},
                    {projection: {_id: 0, __v: 0}, new: true},
                    function (err, dataset) {
                        if (!err) {
                            if (dataset != null) {
                                res.statusCode = 200;
                                res.setHeader("Content-Type", "application/json");
                                res.json(dataset);
                                console.log("»»» Update OK. Do a GET do see Results");
                            }
                            else {
                                res.statusCode = 404;
                                res.setHeader("Content-Type", "application/json");
                                res.json(errors[statusCode]);
                                console.log("»»» Dataset: " + req.params.datasetID + " was not found! ");
                                console.log(dataset);

                            }
                        }
                        else {
                            return console.error(err);
                        }
                    });
            } else {
                res.statusCode = 400;
                res.setHeader("Content-Type", "application/json");
                res.json(errors[res.statusCode]);
                console.log("»»» Bad request. Check the definition documentation.");
            }
        }
    }
};

exports.deleteDataset = function(req, res) {

    console.log("»»» Accepted DELETE to this resource. Develop here what happens");
    Dataset.findOneAndRemove({idDataset: req.dataset_id}, function (err, dataset) {
        if (!err) {

            if (dataset === null) {
                res.statusCode = 404;
                res.setHeader("Content-Type", "application/json");
                res.json(errors[res.statusCode]);
                console.log("»»» The Dataset: " + req.dataset_id + " was not found for Delete! ");
            }
            else {
                console.log("»»» Delete OK. Do a GET do see Results");
                res.statusCode = 204;
                res.setHeader("Content-Type", "application/json");
                res.json();
            }
        }
        else {
            res.statusCode = 404;
            res.setHeader("Content-Type", "application/json");
            res.json(errors[res.statusCode]);
            console.log("»»» The Dataset: " + req.dataset_id + " was not found for Delete! ");
        }

    });
};