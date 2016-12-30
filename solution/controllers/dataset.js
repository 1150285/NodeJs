var Dataset = require('../models/dataset');
var matrix = require("node-matrix");

exports.postDatasets = function(req, res) {
	console.log("»»» Accepted POST to .../Datasets/ resource");
	//inserir function para validar se a quantidade linhas x colunas fazem match com os valores informados
	
	if (Number (req.body.rows) && Number (req.body.cols) && req.body.values ) {
		
		var numbers = req.body.values;
		var RowXCol = numbers.split(",");
		var eachNumber = [];
		for (var i =0; i < RowXCol.length; i++) {
			eachNumber.push(parseInt(RowXCol[i]));
			console.log(eachNumber[i]);
		}
		console.log(eachNumber.length);
		
		var arraySize = (req.body.rows * req.body.cols) ;
		console.log(arraySize);
		
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
								"The specific Dataset: " + dataset_id + " was successfully created for username: " + req.username +
								"</h1></body></html>");
						console.log("»»» The specific Dataset: " + dataset_id + " was successfully created for username: " + req.username);
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

exports.getDatasets = function(req, res) {

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
		res.end(printDatasetHTML(datasets));
	});	
	console.log("»»» Returned GET for all existents Datasets");
};

exports.getDataset = function(req, res) {

	console.log("»»» Accepted GET to /Datasets/ID? resource.");
	if (req.dataset_id) {

		Dataset.find({ idDataset: req.dataset_id },function (err, dataset) {
			if (err) {
				res.statusCode = 404 ;
				res.setHeader("Content-Type", "application/html");
				res.end("<html><body><h1> " +
						"Dataset: " + req.dataset_id + " or User: " + req.username + " not found! " +
						"</h1></body></html>");
				console.log("»»» Dataset: " + req.dataset_id + " or User " + req.username + " not found! ");
				return console.error(err);
			}
			else {
				if (dataset.length === 0) {
					res.statusCode = 404 ;
					res.setHeader("Content-Type", "application/html");
					res.end("<html><body><h1> " +
							"Dataset: " + req.dataset_id + " or User: " + req.username + " not found! " +
							"</h1></body></html>");
					console.log("»»» Dataset: " + req.dataset_id + " or User: " + req.username + " not found! ");
					console.log(dataset);
				}
				else {
					res.statusCode = 200;
					res.setHeader("Content-Type", "application/html");
					res.end(printDatasetHTML(dataset));
					console.log("»»» Returned GET for the existent Dataset");
				}
			}
		})
	} 
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
						"Dataset: " + req.dataset_id + " or User: " + req.username + " not found! " +
						"</h1></body></html>");
				console.log("»»» Dataset: " + req.dataset_id + " or User " + req.username + " not found! ");
				return console.error(err);
			}
			else {
				if (dataset.length === 0) {
					res.statusCode = 404 ;
					res.setHeader("Content-Type", "application/html");
					res.end("<html><body><h1> " +
							"Dataset: " + req.dataset_id + " or User: " + req.username + " not found! " +
							"</h1></body></html>");
					console.log("»»» Dataset: " + req.dataset_id + " or User: " + req.username + " not found! ");
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
							datasetAfterPut = dataset[0];
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
		datasetAfterPut.save(function(err, datasetAfterPut) {
			if (err) return console.error(err);
			console.dir(datasetAfterPut);
			
			res.statusCode = 200;
			res.setHeader("Content-Type", "application/html");
			res.end(printDatasetHTML(dataset));
			console.log(dataset);
			console.log("»»» Returned PUT updating the existent Dataset");	
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
    if (req.username === undefined || req.dataset_id === undefined ) {

        console.log("»»» Accepted DELETE to this resource. Develop here what happens");
        //TODO eliminar da base de dados o dataset
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
			
			/*
				dataset.findByIdAndRemove({datasetId: req.dataset_id}, {}, function(err, obj) {
					if (err) next(err);
					req.session.destroy(function(error) {
					  if (err) {
						next(err)
					  }
					});
					res.json(200, obj);
				  });
			*/
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
};

exports.buildRandomDataset = function(lines, columns) {

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

    var dataset = new Dataset({
        numRows: dataMatrix.numRows,
        numCols: dataMatrix.numCols,
        values: values
    });



    /*    var id = mongoose.Types.ObjectId();
     var dataset = new Dataset({
     numRows: dataMatrix.numRows,
     numCols: dataMatrix.numCols,
     values: values
     });*/

    dataset.save(
        function(err, dataset) {
            if (err) return console.error(err);
            console.log(dataset);
            dataset_id = dataset.idDataset;
        }
    );
}