var Dataset = require('../models/dataset');
var Functions = require('../controllers/functions');
var matrix = require("node-matrix");
var mongoose = require('mongoose');

//Functions.buildRandomDataset(2, 2);
//Functions.buildRandomDataset(3, 5);
//Functions.buildRandomDataset(2, 7);

exports.getDatasets = function(req, res, user) {

	console.log("»»» Accepted GET to .../Datasets/ resource");
	
	//check if the user is validUser before check Dataset
	
	var dataset = "";
	Dataset.find(function (err, datasets) {
		if (err) {
			res.statusCode = 404 ;
			res.setHeader("Content-Type", "application/html");
			res.end("<html><body><h1> " +
					"Dataset: " + req.dataset_id + " was not found! " +
					"</h1></body></html>");
			console.log("»»» None datasets found! ");
			return console.error(err);
		}
		else {
			if (datasets.length === 0) {

				res.statusCode = 404;
				res.setHeader("Content-Type", "application/html");
				res.end("<html><body><h1> " +
						"None datasets found! " +
						"Create one doing POST to <a href='http://localhost:3001/Datasets'>http://localhost:3001/Datasets</a>" +
						"</h1></body></html>");
				console.log(datasets);
				console.log("»»» None datasets found! ");
			}
			else {
				res.statusCode = 200;
				res.setHeader("Content-Type", "application/html");
				res.end(Functions.printDatasetHTML(datasets));
				console.log("»»» Returned GET with an existent Dataset");
			}
		}
	});	
};

exports.postDatasets = function(req, res) {
	console.log("»»» Accepted POST to .../Datasets/ resource");
	
	if (Number (req.body.rows) && Number (req.body.cols) && req.body.values ) {
		var numbers = req.body.values;
		var RowXCol = numbers.split(",");
		var eachNumber = [];
		for (var i =0; i < RowXCol.length; i++) {
			eachNumber.push(parseInt(RowXCol[i]));
			//console.log(eachNumber[i]);
		}
		//console.log(eachNumber.length);

		var arraySize = (req.body.rows * req.body.cols) ;
		//console.log(arraySize);
		
		if ( arraySize === eachNumber.length) {
			
			var id = mongoose.Types.ObjectId();
			var dataset = new Dataset({
				dataset_id: id,
				numRows: req.body.rows,
				numCols: req.body.cols,
				values: eachNumber
			});
				dataset.save(
				function(err, dataset) {
					if (err) {
						res.statusCode = 400;
						res.setHeader("Content-Type", "application/html");
						res.end("<html><body><h1> " +
								"Bad request. Check the definition documentation. " +
								"</h1></body></html>");
						console.log("»»» Bad request. Check the definition documentation.");
						return console.error(err);
					}
					else {
						var dataset_id = dataset.idDataset;
						// send 201 response
						res.statusCode = 201;
						res.setHeader("Content-Type", "application/html");
						res.end("<html><body><h1> " +
								"Your specific Dataset: " + dataset_id + " was successfully created for username: " + req.username +
								"</h1></body></html>");
						console.log(dataset);
						console.log("»»» Your specific Dataset: " + dataset_id + " was successfully created for username: " + req.username);
					}
				}
			);
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
	else {
		if (Number (req.body.rows) && Number (req.body.cols) ) {
			
			var values = [];
			var dataset_id = "";
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
						res.setHeader("Content-Type", "application/html");
						res.end("<html><body><h1> " +
								"Bad request. Check the definition documentation. " +
								"</h1></body></html>");
						console.log("»»» Bad request. Check the definition documentation.");
						return console.error(err);
					} else {
						var dataset_id = dataset.idDataset;
						// send 201 response
						res.statusCode = 201;
						res.setHeader("Content-Type", "application/html");
						res.end("<html><body><h1> " +
								"A Random Dataset for username: " + req.username + " was successfully created. Your DatasetID = " + dataset_id +  
								"</h1></body></html>");
						console.log("»»» A Random Dataset for username: " + req.username + " was successfully created. Your DatasetID = " + dataset_id);
					}
					console.log(dataset);
				}
			);		
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
};

exports.putDatasets = function(req, res) {
		res.statusCode = 405;
		res.setHeader("Content-Type", "application/html");
		res.end("<html><body><h1> " +
				"Method not allowed in this resource. Check the definition documentation " +
				"</h1></body></html>");
};

exports.deleteDatasets = function(req, res) {
		res.statusCode = 405;
		res.setHeader("Content-Type", "application/html");
		res.end("<html><body><h1> " +
				"Method not allowed in this resource. Check the definition documentation " +
				"</h1></body></html>");
};

//////////////

exports.getDataset = function(req, res) {

	console.log("»»» Accepted GET to /Datasets/ID? resource.");
	if (req.dataset_id) {

		Dataset.find({ idDataset: req.dataset_id },function (err, dataset) {
			if (err) {
				res.statusCode = 404 ;
				res.setHeader("Content-Type", "application/html");
				res.end("<html><body><h1> " +
						"Dataset: " + req.dataset_id + " was not found! " +
						"</h1></body></html>");
				console.log("»»» Dataset: " + req.dataset_id + " was not found! ");
				return console.error(err);
			}
			else {
				if (dataset.length === 0) {
					res.statusCode = 404 ;
					res.setHeader("Content-Type", "application/html");
					res.end("<html><body><h1> " +
							"Dataset: " + req.dataset_id + " was not found! " +
							"</h1></body></html>");
					console.log("»»» Dataset: " + req.dataset_id + " was not found! ");
					console.log(dataset);
				}
				else {
					res.statusCode = 200;
					res.setHeader("Content-Type", "application/html");
					res.end(Functions.printDatasetHTML(dataset));
					console.log(dataset);
					console.log("»»» Returned GET for the existent Dataset");
				}
			}
		});
	} 
};

exports.postDataset = function(req, res) {
		res.statusCode = 405;
		res.setHeader("Content-Type", "application/html");
		res.end("<html><body><h1> " +
				"Method not allowed in this resource. Check the definition documentation " +
				"</h1></body></html>");
};

exports.putDataset = function(req, res) {

	console.log("»»» Accepted PUT to /Datasets/ID resource.");
	if (Number (req.body.row) && Number (req.body.col) && Number (req.body.newValue) ) {
        var datasetAfterPut = "";
        Dataset.find({ idDataset: req.dataset_id },function (err, dataset) {
            if (err) {
    			res.statusCode = 404 ;
    			res.setHeader("Content-Type", "application/html");
    			res.end("<html><body><h1> " +
    					"Dataset: " + req.dataset_id + " was not found! " +
    					"</h1></body></html>");
    			console.log("»»» Dataset: " + req.dataset_id + " was not found! ");
            	return console.error(err);
            }
            else {
                if (dataset.length === 0) {
                	res.statusCode = 404 ;
        			res.setHeader("Content-Type", "application/html");
        			res.end("<html><body><h1> " +
        					"Dataset: " + req.dataset_id + " was not found! " +
        					"</h1></body></html>");
        			console.log("»»» Dataset: " + req.dataset_id + " was not found! ");
        			console.log(dataset);
                }
                else {
            	    var rows = dataset[0].numRows;
            	    var cols = dataset[0].numCols;
                	if ( parseInt (req.body.row) < parseInt (rows + 1) 
                			&& parseInt (req.body.col) < parseInt (cols + 1) ) {

                		var arrayPosition = 0;
                		if (parseInt(req.body.row) <= 1){
                			arrayPosition = parseInt (req.body.col - 1);
                		}
                		else {
                			arrayPosition = (  (parseInt(req.body.col) + 
                							( parseInt(cols) * (parseInt(req.body.row) -1) )
                							) - 1);
                		}
                    	                    		
                	    if (dataset[0].values[arrayPosition]) {
                	    	dataset[0].values[arrayPosition] = parseInt (req.body.newValue);
                	    	//Data with new values
            	            datasetAfterPut = dataset[0].values;
            	            console.log(dataset[0].values);
            	    		Dataset.findOneAndUpdate({ idDataset: req.dataset_id }, { $set: { values: dataset[0].values }}, function (err, dataset) {
            	    			if (!err) {
            						res.statusCode = 200;
            						res.setHeader("Content-Type", "application/html");
                    				res.end("<html><body><h1> " +
                    						"Update OK. Do a GET to this DatasetID " + req.dataset_id  + " to see the results " +
                    						"</h1></body></html>");
                    				console.log("»»» Update OK. Do a GET do see Results");
            	    			}
            	    			else {
            	    				return console.error(err);
            	    			}
            	    		});
                	    }
                	}
            	    else {
        				res.statusCode = 400;
        				res.setHeader("Content-Type", "application/html");
        				res.end("<html><body><h1> " +
        						"Bad request. This position does not exist in Dataset. Check values and try again " +
        						"</h1></body></html>");
        				console.log("»»» Bad request. Check the definition documentation.");
            	    }
            	}
            }
        });
	}
	else {
		res.statusCode = 400;
		res.setHeader("Content-Type", "application/html");
		res.end("<html><body><h1> " +
				"Bad request. Check the definition documentation. " +
				"</h1></body></html>");
		console.log("»»» Bad request. Check the definition documentation.");
	}
};

exports.deleteDataset = function(req, res) {

    console.log("»»» Accepted DELETE to this resource. Develop here what happens");
	Dataset.findOneAndRemove({ idDataset: req.dataset_id }, function (err, dataset) {
		if (!err) {
			console.log("»»» Delete OK. Do a GET do see Results");
			
			res.statusCode = 200;
			res.setHeader("Content-Type", "application/html");
			res.end("<html><body><h1> " +
					"The DatasetID " + req.dataset_id  + " was delete sucessfully" +
					"</h1></body></html>");
		}
		else {
        	res.statusCode = 404 ;
			res.setHeader("Content-Type", "application/html");
			res.end("<html><body><h1> " +
					"The Dataset: " + req.dataset_id + " was not found for Delete! " +
					"</h1></body></html>");
			console.log("»»» The Dataset: " + req.dataset_id + " was not found for Delete! ");
			console.log(dataset);
			return console.error(err);
		}
	});
};
