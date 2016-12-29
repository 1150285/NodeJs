# README #

This README would normally document whatever steps are necessary to get your application up and running.

### What is this repository for? ###

Repositório para versionar o Assigment de PSIDI - Mestrado em Engenharia Informática.

### How do I get set up? ###
Checklist:
	Pré-Requirements:
		MongoDB already installed
		Postman already installed

Instalation and Setup:
	Checkout the project using https://1161660@bitbucket.org/ODSOFT_2016_1160091/restify.git

Run:
	Run MongoDB instance
	"C:\Program Files\MongoDB\Server\3.4\bin\mongod.exe"

	Go to restify/solution/
	Open 2 terminals in this folder and in the first type:
	"node Datasheet_srv.js" (to run Datasheet server)
	in the second type:
	"node HeavyOps_srv.js" (to run HeavyOps server)
	
	Open Postman
	For Example to create an user do a POST to http://localhost:3001/Users
	For all others operations please check the documentation definition

### Who do I talk to? ###

Leonardo Andrade, 
Daniel Afonso or
Paulo Russo

1160091@isep.ipp.pt
1161660@isep.ipp.pt
1150285@isep.ipp.pt