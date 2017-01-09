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
var Matrix = require("xirtam");

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

const port = process.env.PORT || 3002;

var errors = {};
errors['404'] = {code: 404, message: "Transformations type not found!"};
errors['400'] = {code: 400, message: "Bad Request!"};
errors['500'] = {code: 500, message: "Error while processing your request. Please try again later"};

/************
global functions
************/
function calcTranspose(serverCallbackURL, dataset) {

	console.log("Dataset before transpose", dataset);
    var myMatrix = new Matrix([dataset.values]);
    var result = myMatrix.transpose();
	dataset.numRows = result.rows;
    dataset.numCols = result.cols;
    dataset.values = result.data;
    console.log("Dataset after transpose", dataset);
	
	request({
		uri : serverCallbackURL,
		method: "POST",
		json : {result : dataset}
        },
	   function(err, res){
			if (!err) {
				console.log("»»» Posted callback successfully in the URL: " + serverCallbackURL +
					" and got StatusCode: " + res.statusCode);
				if (204 != res.statusCode ) {
					console.log("»»» Error trying to reach Datasheet server. " +
						"Please contact system administrator ");
				} 
			}
			else {
				console.log("»»» Unknown Error. Maybe Datasheet server is unavailable. " +
					"Please contact system administrator" + err);
			}
	});
}

function calcScale(serverCallbackURL, operID, dataset, scale) {

    console.log("Dataset before scale", dataset);
    var myMatrix = new Matrix(dataset.values);
    //Multiply scalar
    if (operID == 2) {
        var result = myMatrix.scalarMultiply(parseInt(scale));
        console.log(result);
    }
    //Add Scalar
    else if (operID == 3) {
        var sum = 0;
        var result = myMatrix.foreach(
            function () {
                myMatrix.setDataPoint(0, sum, (myMatrix.get(0, sum) + parseInt(scale) ));
                sum++;
            });
    }
    dataset.values = result.data;
    console.log("Dataset after scale", dataset);

    request({
            uri : serverCallbackURL,
            method: "POST",
            json : {result : dataset}
        },
        function(err, res){
            if (!err) {
                console.log("»»» Posted callback successfully in the URL: " + serverCallbackURL +
                    " and got StatusCode: " + res.statusCode);
                if (204 != res.statusCode ) {
                    console.log("»»» Error trying to reach Datasheet server. " +
                        "Please contact system administrator ");
                }
            }
            else {
                console.log("»»» Unknown Error. Maybe Datasheet server is unavailable. " +
                    "Please contact system administrator" + err);
            }
        });
}

function addOrMultiply(serverCallbackURL, operID, datasetV1, datasetV2) {

    var myMatrix = new Matrix(datasetV1.values);
    var myMatrix2 = new Matrix(datasetV2.values);
    //Add matrix
    if (operID == 4) {
        console.log("Datasets before add ", datasetV1.values, datasetV2.values);
        var datasetV3 = myMatrix.add( myMatrix2 );
        console.log("Dataset after add ", datasetV3);
    }
    //Multiply matrix
    else if (operID == 5) {
        console.log("Datasets before Multiply", datasetV1.values, datasetV2.values);
        var datasetV3 = myMatrix.elementWiseMultiplication( myMatrix2 );
        console.log("Dataset after Multiply", datasetV3);
    }

    request({
            uri : serverCallbackURL,
            method: "POST",
            json : {result : datasetV3}
        },
        function(err, res){
            if (!err) {
                console.log("»»» Posted callback successfully in the URL: " + serverCallbackURL +
                    " and got StatusCode: " + res.statusCode);
                if (204 != res.statusCode ) {
                    console.log("»»» Error trying to reach Datasheet server. " +
                        "Please contact system administrator ");
                }
            }
            else {
                console.log("»»» Unknown Error. Maybe Datasheet server is unavailable. " +
                    "Please contact system administrator" + err);
            }
        });
}
/**
 * URL: 	/HeavyOps/:operID
 * GET 		return specific accepted 202 or server error 500
 * POST 	not allowed, returns 405
 * PUT 		not allowed, returns 405
 * DELETE 	not allowed, returns 405
**/

app.param('operID', function(req, res, next, operID){
	req.oper_id = operID;
    console.log("»»» Accepted POST request to /HeavyOps with operID: " + req.oper_id );
	return next()
	});

app.route("/HeavyOps/:operID")
	.post(function(req, res) {
        var TID = req.oper_id;

        if ( TID == 1) {
        	console.log("»»» Calculating Transpose");
			calcTranspose(req.body.serverCallbackURL, req.body.datasetV);
            return res.sendStatus(202);
		}
		else if ( TID == 2 || TID == 3) {
            console.log("»»» Scaling dataset in = " + req.body.scale);
            calcScale(req.body.serverCallbackURL, req.oper_id, req.body.datasetV, req.body.scale);
            return res.sendStatus(202);
        }
        else if ( TID == 4 || TID == 5) {
            console.log("»»» Got these datasets ID1 = " + req.body.datasetV1.idDataset + " e ID2 = " + req.body.datasetV2.idDataset);
            addOrMultiply(req.body.serverCallbackURL, req.oper_id, req.body.datasetV1, req.body.datasetV2);
            return res.sendStatus(202);
        }

		
	})
	.get(function(req, res) {
		res.statusCode = 405;
		res.setHeader("Content-Type", "application/html");
        res.json(errors[res.statusCode]);
	})
	.put(function(req, res) {
		res.statusCode = 405;
		res.setHeader("Content-Type", "application/html");
        res.json(errors[res.statusCode]);
	})
	.delete(function(req, res) {
		res.statusCode = 405;
		res.setHeader("Content-Type", "application/html");
        res.json(errors[res.statusCode]);
	});


///RUNNING...

//Starting Listening to Main Server
app.listen(port, function() {
	console.log("Listening requests on " + port);
});
	
	
	
	
	
	
