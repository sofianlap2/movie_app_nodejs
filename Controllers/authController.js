const User = require("../Models/userModel");
const UserModel = require("../Models/userModel");
const CustomError = require("../Utils/CustomError");
const asyncErrorHandler = require("../Utils/asyncErrorHandler");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const util = require("util");
const sendEmail = require("../Utils/email");
const crypto = require('crypto')

const signToken = (idParam) => {
  return jwt.sign({ id: idParam }, process.env.SECRET_STR, {
    expiresIn: process.env.LOGIN_EXPIRES,
  });
};

exports.signup = asyncErrorHandler(async (req, res, next) => {
  const newUser = await User.create(req.body);

  const token = signToken(newUser._id);

  res.status(201).json({
    status: "success",
    token,
    data: {
      user: newUser,
    },
  });
});

exports.login = asyncErrorHandler(async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  if (!email || !password) {
    const error = new CustomError(
      "Please provide email ID & passsword for login"
    );
    return next(error);
  }

  const user = await UserModel.findOne({ email }).select("+password");

  if (!user || !(await user.comparePasswordInDb(password, user.password))) {
    const error = new CustomError("Incorrect email or password", 400);
    return next(error);
  }

  const token = signToken(user._id);

  res.status(200).json({
    status: "success",
    token,
    user,
  });
});

exports.protect = asyncErrorHandler(async (req, res, next) => {
  // 1. Read the token & check if it exist
  const testToken = req.headers.authorization;
  let token;

  if (testToken && testToken.startsWith("Bearer")) {
    token = testToken.split(" ")[1];
  }
  if (!token) {
    const err = new CustomError("You are not loggedin", 401);
    return next(err);
  }
  // 2. Validate the token
  const decodedToken = await util.promisify(jwt.verify)(
    token,
    process.env.SECRET_STR
  );

  // 3. If the user exists
  const user = await UserModel.findById(decodedToken.id);

  if (!user) {
    const error = new CustomError(
      "the user with the given token does not exist",
      401
    );
    next(error);
  }

  // 4. Allow user to access route

  req.user = user;
  next();
});

exports.restrict = (role) => {
  return (req, res, next) => {
    if (req.user.role !== role) {
      const error = new CustomError(
        "You do not have permission to perform this action",
        403
      );
      next(error);
    }
    next();
  };
};

exports.forgotPassword = asyncErrorHandler(async (req, res, next) => {
  const user = await UserModel.findOne({ email: req.body.email });

  if (!user) {
    const error = new CustomError(
      "We could not find a user with the given email",
      404
    );
    return next(error);
  }

  const resetPwd = user.createPasswordToken();

  await user.save({ validateBeforeSave: false });

  const resetUrl = `${req.protocol}://${req.get('host')}/resetPassword/${resetPwd}`

  const message = `We have received a password reset request. Please use the below link to reset your password \n\n${resetUrl}\n\n to reset it`
  
  try {
   await sendEmail({
    email: user.email,
    subject: "Password change request received",
    message: message
   })

   res.status(200).json({
    status: "success",
    message: "email sent"
   })
  } catch (error) {
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpires = undefined;
    user.save({ validateBeforeSave: false });

    return next(new CustomError('There was an error sending password reser email. Please try again', 500))
  }
});


exports.resetPassword = asyncErrorHandler(
  async (req,res,next) => {
    // if user exists with the given token and not expiredd
  const token = crypto.createHash('sha256').update(req.params.token).digest('hex');

  const user = await UserModel.findOne({ passwordResetToken: token, passwordResetTokenExpires: {$gt: Date.now()} })

  if(!user) {
    const error = new CustomError(
      "Token is invalid or has expired",
      400
    );
    return next(error);
  }

  //reset password

  user.password = req.body.password;
  user.confirmPassword = req.body.confirmPassword;
  user.passwordResetToken = undefined;
  user.passwordResetTokenExpires = undefined;

  user.save();

  //login the user

  const logginToken = signToken(user._id);

  res.status(200).json({
    status: "success",
    logginToken
  });
})