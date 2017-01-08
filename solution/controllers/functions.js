/************
global functions
************/

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

    dataset.save(
        function(err, dataset) {
            if (err) return console.error(err);
            console.log(dataset);
            dataset_id = dataset.idDataset;
        }
    );
};

/*
 * Function for auto-increment Callbacks
 */
var SequenceID = 1;

exports.getSequence = function () {
    return SequenceID++;
};

/*
 * Function for store userID e DatasetID
 */
var userID = "";
exports.getUserID = function () {
    return this.userID;
};
exports.setUserID = function (userID) {
    this.userID = userID;
};

var datasetID = "";
exports.getDatasetID = function () {
    return this.datasetID;
};
exports.setDatasetID = function (datasetID) {
    this.datasetID = datasetID;
};


