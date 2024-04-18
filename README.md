//NORTHCODERS NEWS - https://northcoders-news-7ei3.onrender.com/api/

//SUMMARY
This project is a news app capable of hosting articles, categorised in topics and the ability to interact through comments and votes.

//GETTING STARTED

//CLONING
Navigate to a suitable folder in the terminal on your computer and type the command: git clone https://github.com/tatsumakiroll/be-nc-news-project.git
to make a local copy of this repo.


//SETUP 
//DATABASES: 
First you will need to setup the databases on your local machine using PSQL with the following command "npm run setup-dbs" in the command line of your terminal to create them, before being able to populate the tables of data needed to operate this app.


//ENV variable
Create a .env.test file with the the line PGDATABASE=nc_news_test inside it. (Check the .env-example for the format)
You will need to set up one for test database and one for the development database. // .env.development >>>> with the line PGDATABASE=nc_news
This will be necessary to be able to access both databases.


//PACKAGE MANAGER
The package manager I've used is npm, for the following sections I will refer to this in the instruction but if you are using an alternative please feel free to subplant npm for whichever one you are using e.g yarn install dotenv


//DEPENDENCIES
These are the modules this app needs to operate and the instruction for their installation in command line are as follows:
dotenv: npm install dotenv 
express: npm install express
pg: npm install pg-format


//DEV DEPENDENCIES
These modules are needed for testing purposes and for further development but not core operation:
jest: npm install -D jest
jest-sorted: npm install -D jest-sorted
pg-format: npm install -D pgformat
supertest: npm install -D supertest 

//SEEDING & TESTS
Once those are set up you will be able to begin seeding. Alter the scripts in the package.json file to match the following if they don't already
"seed": "PGDATABASE=nc_news node ./db/seeds/run-seed.js"
"test": "PGDATABASE=nc_news_test jest"
then >> use "npm run seed" in the command line to populate the development database with data
and >> "npm run test" will automatically reset and reseed the test database whilst running all available test files in __tests__ folder

//MINIMUM VERSIONS
Node.js version 21.7.1
PostgresSQL 14.11