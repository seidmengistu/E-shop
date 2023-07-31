/*
The below server-side JavaScript file for a React application using the Express.js framework. Let's break down what this code does:

Importing required modules:

1.The code begins by importing the "express" module, which is a popular web application framework for Node.js used to build server-side applications.
Creating an Express application instance:

2.The code creates an instance of the Express application by calling express() and assigns it to the variable app.
Configuration for non-production environments:

3.The code checks the value of the environment variable NODE_ENV to determine if the application is running in production mode or not.
If the environment is not set to "PRODUCTION," the code loads and configures environment variables from a .env file located in the "backend/config/" directory.
The dotenv module is used to load environment variables from the .env file and make them available in the Node.js process.

4.Exporting the Express application:

The app instance, which represents the Express application, is exported using module.exports, making it available for use in other parts of the application.
In summary, this code sets up an Express.js application and loads environment variables from a .env file if the application is not running in production mode.
 The Express application instance is then exported for use in other parts of the application, where it can be used to define routes, middleware, and other functionalities required for building the server-side of a React application.
*/

const express=require("express");
const ErrorHandler = require("./utils/ErrorHandler");
const app=express();

//config

if(process.env.NODE_ENV!=="PRODUCTION"){
    require("dotenv").config({
        path:"backend/config/.env"
    })

}

//it's  for error handling
app.use(ErrorHandler)

module.exports=app;