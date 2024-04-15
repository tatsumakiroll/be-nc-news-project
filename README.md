#NC-news
1. First you will need to setup the databases with the following 
"npm run setup-dbs" to create them in psql and in order to use this app correctly you will first need to setup the environment variable file in the root of the app file. 
Create a .env.<yourfilenamehere> file with the the line "PGDATABASE=<yourdatabasename>" inside it.
You will need to set up one for test database and one for the development database.
Make sure this same line is in your scripts in package.json to run once your database is setup correctly. e.g. ""seed": "PGDATABASE=yourdatabasenamehere node ./db/seeds/run-seed.js""

