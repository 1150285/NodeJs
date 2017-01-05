/************
global functions
************/

var User = require('../models/user');

exports.printDatasetHTML = function (dataset) {

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