/*
The Below code appears to be a Node.js module defining a middleware function for checking user authentication using JSON Web Tokens (JWT). 
Let's break down the code to understand its meaning:

1:Required Modules:

    ErrorHandler: A custom utility module for handling error responses.
    catchAsyncErrors: A middleware that helps in handling asynchronous errors.
    jwt: A library for working with JSON Web Tokens.

2.Middleware Function:
   The code exports a middleware function named isAuthenticated. This function is used to check whether the user making a request is authenticated or not.

3.Authentication Logic:
    Inside the isAuthenticated middleware function:

    It first extracts the JWT token from the request cookies using const { token } = req.cookies;.
    If there is no token (i.e., the user is not authenticated), it calls the next function with an error using the ErrorHandler module: return next(new ErrorHandler("Please login to continue", 401));.
    If there is a token, it proceeds to decode the token using jwt.verify(token, process.env.JWT_SECRET_KEY);
    The process.env.JWT_SECRET_KEY is the secret key used to sign and verify the JWT token. If the token is valid, jwt.verify will return the decoded payload.
    The decoded payload typically contains the user's ID or any other necessary information.
    The code then fetches the user's data from the database based on the extracted user ID (decoded.id) and stores it in the req.user object: req.user = await User.findById(decoded.id);

*/


const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("./catchAsyncErrors");
const jwt = require("jsonwebtoken");
const User = require("../model/user");

// to check wheter the user is Authenticated or not

exports.isAuthenticated=catchAsyncErrors(async(req,res,next)=>{
    const {token}=req.cookies;

    if(!token){
        return next(new ErrorHandler("Please login to continue",401));
    }
    const decoded=jwt.verify(token,process.env.JWT_SECRET_KEY);

    console.log(decoded);

    req.user=await User.findById(decoded.id);

    next();

});