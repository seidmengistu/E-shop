const express = require('express');
const path = require('path');
const User=require('../model/user');
const router=express.Router();
const upload=require('../multer.js');
const ErrorHandler = require('../utils/ErrorHandler');


router.post("/create-user", upload.single("file"),async(req, res,next) =>{
            const {name,enails,password}=req.body;

            const userEmail=await User.findOne({email});

            if(userEmail){
                return next(new ErrorHandler("User already exists",400));
            }
            const filename=req.files.filename;
            const fileurl = path.join(filename);

            const user={
                name:name,
                email:enails,
                password:password,
                avatar:fileurl,
            }
            
            console.log(user);
});

module.exports=router;