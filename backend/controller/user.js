const express = require("express");
const path = require("path");
const User = require("../model/user");
const router = express.Router();
const { upload } = require("../multer");
const ErrorHandler = require("../utils/ErrorHandler");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const sendMail = require("../utils/sendMail");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const sendToken = require("../utils/jwtToken");
const user = require("../model/user");
const { request } = require("http");

//create user
router.post("/create-user", upload.single("file"), async (req, res, next) => {
  const { name, email, password } = req.body; //get the name,email and password from the request body to sav ein to the database

  const userEmail = await User.findOne({ email }); //serach the email from the user Data schema

  if (userEmail) {
    const filename = req.file.filename;
    const filepath = `uploads/${filename}`;
    fs.unlink(filepath, (err) => {
      if (err) {
        console.log(err);
        res.status(500).json({ message: "Error deleting file" });
      }
    });
    return next(new ErrorHandler("User already exists", 400));
  }

  const filename = req.file.filename;

  const fileurl = path.join(filename);

  const user = {
    name: name,
    email: email,
    password: password,
    avatar: fileurl,
  };

  // create activation token function
  const createActivationToken = (user) => {
    return jwt.sign(user, process.env.ACTIVATION_SECRET, {
      expiresIn: "5m",
    });
  };

  const activationToken = createActivationToken(user);

  const activationUrl = `http://localhost:3000/activation/${activationToken}`;

  try {
    await sendMail({
      email: user.email,
      subject: "Activate your account",
      message: `Hello ${user.name}, please click on the link to activate your account: ${activationUrl}`,
    });

    //messag returned after successful request

    // config: {transitional: {…}, adapter: Array(2), transformRequest: Array(1), transformResponse: Array(1), timeout: 0, …}
    // data: {success: true, message: 'please check your email:- zohit@mailinator.com to activate your account!'}
    // headers: AxiosHeaders {content-length: '101', content-type: 'application/json; charset=utf-8'}
    // request:XMLHttpRequest {onreadystatechange: null, readyState: 4, timeout: 0, withCredentials: false, upload: XMLHttpRequestUpload, …}
    // status: 201
    // statusText: "Created"

    res.status(201).json({
      success: true,
      message: `please check your email:- ${user.email} to activate your account!`,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }

  

});

// activate user
  router.post(
    "/activation",
    catchAsyncErrors(async (req, res, next) => {
      try {
        const { activation_token } = req.body;
        /* The jwt.verify function is then used to verify the activation_token. 
        This function decodes the token using the process.env.ACTIVATION_SECRET, 
        which is presumably a secret key stored in the application's environment variables. 
        If the token is valid, it will return an object representing the new user.

        https://betterprogramming.pub/14-useful-packages-every-react-developer-should-know-55b47a325d3
        https://awesomejs.dev/for/react/
        https://www.npmjs.com/package/react-toastify
         */
        const newUser = jwt.verify(
          activation_token,
          process.env.ACTIVATION_SECRET
        );

        if (!newUser) {
          return next(new ErrorHandler("Invalid token", 400));
        }
        //If the token is valid, the code extracts the user's name, email, password, and avatar from the decoded newUser object.
        const { name, email, password, avatar } = newUser;

        let user = await User.findOne({ email });

        if (user) {
          return next(new ErrorHandler("User already exists", 400));
        }
        user = await User.create({
          name,
          email,
          avatar,
          password,
        });

        sendToken(user, 201, res);
      } catch (error) {
        return next(new ErrorHandler(error.message, 500));
      }
    })
  );

// login user
router.post(
  "/login-user",
  catchAsyncErrors(async (req, res, next) => {
    try {
     
      const { email, password } = req.body;
      

      if (!email || !password) {
        return next(new ErrorHandler("Please provide the all fields!", 400));
      }

      const user = await User.findOne({ email }).select("+password");

      if (!user) {
        return next(new ErrorHandler("User doesn't exists!", 400));
      }

      const isPasswordValid = await user.comparePassword(password);

      if (!isPasswordValid) {
        return next(
          new ErrorHandler(`Please provide the correct information`, 400)
        );
      }

      sendToken(user, 201, res);
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

module.exports = router;
