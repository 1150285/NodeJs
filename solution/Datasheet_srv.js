///////////////////////////////////////////////////////
//
// Leonardo Marques de Andrade, Paulo Afonso, Paulo Russo (1160091, 1161660 e 1150285)
// PSIDI / MEI / ISEP
// (c) 2016
//
///////////////////////////////////////////////////////


//
// Check Readme and Documentation to understand how this servers works
//


var express = require('express');
var bodyParser = require('body-parser');
//var methodOverride = require('method-override');

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
//app.use(methodOverride());

// logging : DEBUG
//app.use(express.logger('dev'));


/************/
// data
/************/

const port = process.env.PORT || 3001;
const SERVER_ROOT = "http://localhost:" + port;

// DATA STORE

var users =  {};
var datasets =  {};
var datasetsValues1 = [];
var datasetsValues2 = [];
var macros =  {};
var stats =  {};
var transfs =  {};
var charts = {}

// INITIAL DATA

var now = new Date();

users['u1'] = {username: "u1", fullName:"Paulo Afonso",			Password:"node1234", 	createdOn: now, updatedOn: now};
users['u2'] = {username: "u2", fullName:"Leonardo Andrade", 	Password:"node1234", 	createdOn: now, updatedOn: now};
users['u3'] = {username: "u3", fullName:"Paulo Russo",			Password:"node1234", 	createdOn: now, updatedOn: now};

datasetsValues1[1,2,3,4];
datasetsValues2[1,2,3,4,5,6,7,8,9];

datasets['d1'] = {dataset_id: "a1", rows:2, 	cols:2, 	values:datasetsValues1, 	createdOn: now, updatedOn: now};
datasets['d2'] = {dataset_id: "b2", rows:3, 	cols:3, 	values:datasetsValues2, 	createdOn: now, updatedOn: now};

//A group of functions to Calculate Stats or Transfs and Prints Charts in a row 
macros['m1'] = {content: "s1,t1,c1", 			createdOn: now, updatedOn: now};
macros['m2'] = {content: "s1,t1,c1,s2,t2,c2", 	createdOn: now, updatedOn: now};

//Calculate statistical measures of a row, column, entire data set
stats['s1'] = {stat_id: "s1",  	desc_stat:"Geometric mean" };
stats['s2'] = {stat_id: "s2",  	desc_stat:"Median" };
stats['s3'] = {stat_id: "s3",  	desc_stat:"Mode" };
stats['s4'] = {stat_id: "s4",  	desc_stat:"Midrange" };
stats['s5'] = {stat_id: "s5",  	desc_stat:"Variance" };
stats['s6'] = {stat_id: "s6",  	desc_stat:"Standard deviation"};

//Perform transformations on the data set (without changing the original data set)
transfs['t1'] = {transf_id: "t1", desc_transfs:"Transpose the dataset" };
transfs['t2'] = {transf_id: "t2", desc_transfs:"Scale" };
transfs['t3'] = {transf_id: "t3", desc_transfs:"Add a scalar" };
transfs['t4'] = {transf_id: "t4", desc_transfs:"Add two data sets" };
transfs['t5'] = {transf_id: "t5", desc_transfs:"Multiply two data sets" };
transfs['t6'] = {transf_id: "t6", desc_transfs:"Augment the data set using linear interpolation on the rows or columns",};

//Return a chart representation (image binary file) of the dataset
charts['c1'] = {chart_id: "c1",		desc_chart:"Pie chart of a desired row / column"};
charts['c2'] = {chart_id: "c2",		desc_chart:"Line / bar chart of a desired row / column"};
charts['c3'] = {chart_id: "c3",		desc_chart:"Line / bar chart of the entire data set"};

//
// helper functions
//

function buildMessageCreation(newID, text, user){
	const now = new Date();
	return {
			id : newID, 
			text : text,
			sender : user, 
			createdOn : now,
		};
}

function buildMessageUpdate(newID, text, user){
	const now = new Date();
	return {
			id : newID, 
			text : text,
			sender : user, 
			updatedOn: now,
		};
}

const request = require('request');


/////////////////////////////
// STARTING ...

app.listen(port, function() {
  console.log("Listening on " + port);
});