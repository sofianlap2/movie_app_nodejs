const User = require("../Models/userModel");
const UserModel = require("../Models/userModel");
const CustomError = require("../Utils/CustomError");
const asyncErrorHandler = require("../Utils/asyncErrorHandler");
const jwt = require('jsonwebtoken')
require('dotenv').config()
const util = require('util')

const signToken = (idParam) => {
    return jwt.sign({id: idParam}, process.env.SECRET_STR, {
        expiresIn: process.env.LOGIN_EXPIRES
    })
}

exports.signup = asyncErrorHandler(
    async (req, res, next) => {
        const newUser = await User.create(req.body);

        const token = signToken(newUser._id)

        res.status(201).json({
            status: 'success',
            token,
            data: {
                user: newUser
            }
        })
    }
)

exports.login = asyncErrorHandler(async (req,res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    if(!email || !password) {
        const error = new CustomError('Please provide email ID & passsword for login');
        return next(error)
    }

    const user = await UserModel.findOne( {email} ).select('+password');

    if(!user || !(await user.comparePasswordInDb(password, user.password))) {
        const error = new CustomError('Incorrect email or password', 400);
        return next(error);
    }

    const token = signToken(user._id)

    res.status(200).json({
        status: "success",
        token,
        user
    })
})


exports.protect = asyncErrorHandler(
    async(req, res, next) => {
        // 1. Read the token & check if it exist
        const testToken = req.headers.authorization
        let token;

        if(testToken && testToken.startsWith('Bearer')) {
            token = testToken.split(' ')[1];
        }
        if(!token) {
            const err = new CustomError('You are not loggedin', 401)
            return next(err)
        }
        // 2. Validate the token
        const decodedToken = await util.promisify(jwt.verify)(token, process.env.SECRET_STR)
        console.log(decodedToken)

        // 3. If the user exists

        // 4. If the user changed password after the token was created

        // 5. Allow user to access route

        next()
    }
)