const User = require("../Models/userModel");
const UserModel = require("../Models/userModel");
const CustomError = require("../Utils/CustomError");
const asyncErrorHandler = require("../Utils/asyncErrorHandler");


exports.signup = asyncErrorHandler(
    async (req, res, next) => {
        const newUser = await User.create(req.body);

        res.status(201).json({
            status: 'success',
            data: {
                user: newUser
            }
        })
    }
)