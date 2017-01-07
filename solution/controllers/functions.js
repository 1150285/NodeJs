/************
global functions
************/

var User = require('../models/user');
var errors =  {};
errors['404'] = {code: 404, message: "Dataset not found!"};
var allDatasets = [];
var dataset = {};
var contentValues = [];

exports.printAllDatasetsJson = function (dataset) {

    var values = [];
	
    for(var item = 0; item < dataset.length; item++) {
		
		allDatasets.push(dataset[item]);
					
	}
    return allDatasets;
}

exports.printOneDatasetJson = function (dataset) {

    return dataset[0];
}

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

exports.validUser = function(username) {
	console.log("»»» Accepted GET to validate User");

	var statusCode = User.find( { username: username }, { _id:0, __v:0 }, function(err, user) {
		if (err) {
			returnstatusCode = 404 ;
		}
		else {
			if (user.length === 0) {

				return statusCode = 404;
				console.log(user);
				console.log("»»» User: " + username + " not valid! ");
			}	else {
				return statusCode = 200;
			}
		}
	});
	return statusCode;
};