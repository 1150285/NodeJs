var Dataset = require('../models/dataset');

exports.postDatasets = function(req, res) {
    if (Number (req.body.numRows) && Number (req.body.numCols) && req.body.values ) {
        var datasetId = "";

        var dataset = new Dataset({
            numRows: req.body.numRows,
            numCols: req.body.numCols,
            values: req.body.values
        });

        dataset.save(function(err, dataset) {
            if (err) return console.error(err);
            console.dir(dataset);
            datasetId = dataset;
            // send 201 response
            res.statusCode = 201;
            res.setHeader("Content-Type", "application/html");
            res.end("<html><body><h1> " +
                "The specific Dataset: " + datasetId + " was successfully created for username: " + req.username +
                "</h1></body></html>");
            console.log("»»» The specific Dataset: " + datasetId + " was successfully created for username: " + req.username);
        });

    }
    else {
        if (Number (req.body.rows) && Number (req.body.cols) ) {

            buildRandomDataset(req.body.rows, req.body.cols);

            // send 201 response
            res.statusCode = 201;
            res.setHeader("Content-Type", "application/html");
            res.end("<html><body><h1> " +
                "A Random Dataset for username: " + req.username + " was successfully created. Your DatasetID = " + dataset_id +
                "</h1></body></html>");
            console.log("»»» A Random Dataset for username: " + req.username + " was successfully created. Your DatasetID = " + dataset_id);
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

    //TODO = Develop here what happens
    console.log("»»» Accepted GET to this resource. Develop here what happens");
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/html");
    Dataset.find(function (err, datasets) {
        if (err) return console.error(err);
        //console.log(datasets);
        res.end(printDatasetHTML(datasets));
    });
};

exports.getDataset = function(req, res) {

    console.log("»»» Accepted GET to this resource. Develop here what happens");
    if (req.dataset_id) {
        console.log("»»» Accepted GET to /Datasets/ID? resource. ");
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/html");

        Dataset.find({ idDataset: req.dataset_id },function (err, dataset) {
            if (err) return console.error(err);
            console.log(dataset);
            res.end(printDatasetHTML(dataset));
        })

    } else {
        res.statusCode = 404 ;
        res.setHeader("Content-Type", "application/html");
        res.end("<html><body><h1> " +
            "Datase: or User " + req.dataset_id + " or " + req.username + " not found! " +
            "</h1></body></html>");
        console.log("»»» Dataset or User " + req.dataset_id + " or " + req.username + " not found! ");
    }
};

exports.putDataset = function(req, res) {

    if (req.username && req.dataset_id) {

        //TODO = atualiza a o data set na base de dados
        console.log("»»» Accepted PUT to this resource. Develop here what happens");

        // send 200 response
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/html");
        res.end("<html><body><h1> " +
            "Dataset: " + req.dataset_id + " successfully updated! " +
            "</h1></body></html>");
        console.log("»»» Dataset: " + req.dataset_id + " successfully updated!");
    }
    else {
        if (req.username === undefined || req.dataset_id === undefined ) {
            res.statusCode = 404 ;
            res.setHeader("Content-Type", "application/html");
            res.end("<html><body><h1> " +
                "Dataset or User " + req.dataset_id + " or " + req.username + " not found! " +
                "</h1></body></html>");
            console.log("»»» Dataset or User " + req.dataset_id + " or " + req.username + " not found! ");
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