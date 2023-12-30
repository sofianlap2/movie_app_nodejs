const CustomError = require("../Utils/CustomError");

const devErrors = (res, error) => {
    res.status(error.statusCode).json({
        status: error.status,
        message: error.message,
        stackTrace: error.stack,
        error: error
    })
}


const castErrorHandler = (err) => {
    const msg = `Invalid value ${err.value} for field ${err.path}`;

    return new CustomError(msg, 400)
}

const duplicateKeyErrorHandler = (err) => {
    const name = err.keyValue.name
    const msg = `There is already a movie with name ${name}`;

    return new CustomError(msg, 400)
}

const validationErrorHandler = (err) => {
    const errors = Object.values(err.errors).map(val => val.message);
    const errorMessages = errors.join(". ");
    const msg = `Invalid input data: ${errorMessages}`

    return new CustomError(msg, 400);
}

const prodErrors = (res, error) => {
    if(error.isOperational) {
        res.status(error.statusCode).json({
            status: error.status,
            message: error.message,
        })
    } else {
        res.status(error.statusCode).json({
            status: 500,
            message: "Something went wrong please try again later hhh",
        })
    }
}

module.exports = (error,req,res,next) => {
    error.statusCode = error.statusCode || 500
    error.status = error.status || 'error'

    if(process.env.NODE_ENV == "development") {
        devErrors(res, error)
    } else {
        if(error.name == "CastError") {
            error = castErrorHandler(error)
        }
        if(error.code == 11000) {
            error = duplicateKeyErrorHandler(error)
        }
        if(error.name == "ValidationError") {
            error = validationErrorHandler(error)
        }
        prodErrors(res, error)
    }
}