const express = require("express");
const app = express();

const routes = require("./Routes/movieRoutes");
const CustomError = require("./Utils/CustomError");
const globalErrorHandler = require('./Controllers/errorController')

//data parsing

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("./public"));
console.log('Server run on mode ' + process.env.NODE_ENV)

app.use("/api", routes);
app.all("*", (req,res,next) => {
    // res.status(404).json({
    //     status: "fail",
    //     msg: `There isn't a route as ${req.originalUrl} on the server`
    // })
    // const err = new Error(`There isn't a route as ${req.originalUrl} on the server`);
    // err.status = 'fail'
    // err.statusCode = 400

    const err = new CustomError(`There isn't a route as ${req.originalUrl} on the server`, 400)
    next(err)
})

app.use(globalErrorHandler)

module.exports = app;
