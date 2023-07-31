/*
The below code provided is a Node.js application that uses the Express framework to create a web server. Let's go through the code step by step to understand what it does:

1:Import required modules:

express: The Express framework to create the web server and handle HTTP requests.
ErrorHandler: A custom error handler utility to handle errors in the application.
cookieParser: Middleware to parse and handle cookies in incoming HTTP requests.
bodyParser: Middleware to parse and handle the request body (usually sent as JSON or form data).
fileUpload: Middleware to handle file uploads in HTTP requests.

2.Create an Express app instance:

const app = express();

3.Set up middleware:

express.json(): Middleware to parse JSON data in the request body.
cookieParser(): Middleware to handle cookies in the request headers.
bodyParser.urlencoded({ extended: true }): Middleware to parse form data (if any) in the request body.
fileUpload({ useTemplateFiles: true }): Middleware to handle file uploads, allowing the use of HTML <input type="file"> elements in forms.

4.Environment Configuration:

The code checks if the NODE_ENV environment variable is not set to "PRODUCTION." If it's not in production mode, it loads the environment variables from a file named .env located in the backend/config directory using the dotenv package. 
The dotenv package loads the variables from the file and makes them available in the application via process.env.

5.Error Handling:

The custom ErrorHandler middleware is used for error handling. This means that if there is an error in any of the routes or middlewares that follow, the error will be passed to the ErrorHandler middleware for centralized error handling.
Export the app:

The app instance is exported to be used in other parts of the application or other files.
In summary, this code sets up an Express application, configures various middlewares for handling request data, and sets up environment variables for non-production environments.
It also implements centralized error handling with a custom ErrorHandler middleware.

 */

const express=require("express");
const ErrorHandler = require("./utils/ErrorHandler");
const app=express();
const cookieParser=require("cookie-parser");
const bodyParser=require("body-parser");

app.use(express.json());
app.use(cookieParser());
app.use("/", express.static("uploads"));
app.use(bodyParser.urlencoded({extended:true}));

//config

if(process.env.NODE_ENV!=="PRODUCTION"){
    require("dotenv").config({
        path:"backend/config/.env"
    })

}

//import routes
const user=require("./controller/user");
app.use("/api/v2/user",user);


//it's  for error handling
app.use(ErrorHandler)

module.exports=app;