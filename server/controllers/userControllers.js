const { createErr } = require("../utils/errorCreator");
// const Images = require("../models/imageModel");
require("dotenv").config();
const bcrypt = require("bcrypt");

// const { Storage } = require("@google-cloud/storage");
const { format } = require("util");
const multer = require("multer");
const nodemailer = require("nodemailer");

const User = require("../models/userModel");

const userController = {};

// const cloudStorage = new Storage({
//   keyFilename: `${__dirname}/../web-app-adventure-connect-39d349a3f0d5.json`,
//   projectId: "web-app-adventure-connect",
// });
// const bucketName = "adventure-connect-image-bucket";
// const bucket = cloudStorage.bucket(bucketName);

//verifying user upon logging in, to be put in route for post to /api/login. if route is successful, redirect to show user page

userController.verifyLogin = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await user.comparePassword(password))) {
      // res.locals.loginStatus = true;
      res.locals.user = user;
      return next();
    } else {
      res.status(401).json({ message: "Invalid login credentials!" });
    }
  } catch (error) {
    return next(error);
  }
};

userController.createNewUser = async (req, res, next) => {
  const { name, email, password, zipCode, interests, bio } = req.body;

  try {
    const newUser = await User.create({
      name,
      email,
      password,
      zipCode,
      interests,
      bio,
    });

    console.log("new user saved to database");
    // console.log(newUser);

    res.locals.user = newUser;

    return next();
  } catch (error) {
    return next({ message: { err: "Email is already taken" } });
  }
};

userController.updateUser = async (req, res, next) => {
  try {
    // need to update route for userID not cookies
    const { email } = req.cookies.currentEmail;
    const updatedUser = await User.findOneAndUpdate({ email }, req.body, {
      new: true,
    });

    if (updatedUser) {
      console.log(updatedUser);
      res.status(200);
    } else {
      console.log("User not found");
    }
  } catch (error) {
    console.error(error);
  }
  return next();
};

// verify user route to give information to state in the redux store
userController.verifyUser = async (req, res, next) => {
  const { user_id } = req.body;
  const _id = user_id;
  console.log(req.body);

  try {
    const user = await User.findOne({ _id });

    if (user) {
      // res.locals.loginStatus = true;
      res.locals.user = user;
      return next();
    } else {
      res.status(401).json({ message: "User not found!" });
    }
  } catch (error) {
    return next(error);
  }
};

userController.checkemail = async (req, res) => {
  const email = req.query.email;
  console.log(email);
  try {
    const user = await Users.find({ email: email });
    res.status(200).json({ user: user });
  } catch (error) {
    console.error(error);
    // An error occurred while querying the database
    res.status(500).json({ message: "Server error!" });
  }
};

userController.sendEmail = async (req, res) => {
  // console.log(process.env.MY_EMAIL, process.env.APP_PASSWORD)
  const transporter = nodemailer.createTransport({
    service: "gmail",
    secure: true,
    auth: {
      user: process.env.MY_EMAIL,
      pass: process.env.APP_PASSWORD,
    },
  });

  const { recipient_email, OTP } = req.body;

  const mailOptions = {
    from: "adventureconnect_ptri11@codesmith.com",
    to: recipient_email,
    subject: "AdventureConnect Password Reset",
    html: `<html>
             <body>
               <h2>Password Recovery</h2>
               <p>Use this OTP to reset your password. OTP is valid for 1 minute</p>
               <h3>${OTP}</h3>
             </body>
           </html>`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      res
        .status(500)
        .send({ message: "An error occurred while sending the email" });
    } else {
      console.log("Email sent: " + info.response);
      res.status(200).send({ message: "Email sent successfully" });
    }
  });
};

userController.updatePassword = async (req, res) => {
  const { email, newPassword } = req.body;
  try {
    const updatedUser = await Users.findOneAndUpdate(
      { email: email },
      { password: newPassword }
    );
    res.status(200).json({ updateUser: updatedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error!" });
  }
};

userController.getProfiles = async (req, res, next) => {
  //grab id from req query params
  const userId = req.query.id;

  try {
    // try to find a user that has the id that's sent on the query
    const currentUser = await User.findById(userId);
    //send 404 if can't find current user in database
    if (!currentUser) {
      return res.status(404).json({ error: "User not found" });
    }
    //grab that user's zipcode and interests and save them in variables
    const zipCode = currentUser.zipCode;
    const interests = currentUser.interests;
    //grab all other user's with a different id, the same zipcode, and at least one activity in common
    const users = await User.find({
      //how to make sure different
      _id: { $ne: userId },
      zipCode,
      interests: { $in: interests },
    });
    //put similar users on res.locals
    res.locals.users = users;
    next();
  } catch (error) {
    console.error("Error finding similar users:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//zipcode and interests in local storage
//frontend request should grab the user object from local storage and include it in the get request to the backend

module.exports = userController;
