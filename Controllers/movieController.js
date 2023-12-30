const MovieModel = require("../Models/movieModel");
const CustomError = require("../Utils/CustomError");
// const CustomError = require("../Utils/CustomError");
const asyncErrorHandler = require("../Utils/asyncErrorHandler");

// exports.createMovie = async(req,res,next) => {
//   try {
//     const data = req.body

//     const newMovie = new MovieModel(data)

//     await newMovie.save()

//     res.status(201).json({
//       status: 'success',
//       data: newMovie
//     })
//   } catch (error) {
//     // res.status(500).json({
//     //   status: "error",
//     //   msg: "There was an error on creating a new movie"
//     // })
//     const err = new CustomError(error.message, 500);
//     next(err);
//   }
// }

exports.createMovie = asyncErrorHandler(async (req, res, next) => {
  const data = req.body;

  const newMovie = new MovieModel(data);

  await newMovie.save();

  res.status(201).json({
    status: "success",
    data: newMovie,
  });
});

exports.getAllMovies = asyncErrorHandler(async (req, res, next) => {

  //Query logic
  let queryStr = JSON.stringify(req.query)
  queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`)
  const queryObj= JSON.parse(queryStr)

  //Sorting logic
  let query = MovieModel.find(queryObj);
  let query1= MovieModel.find();
  if(req.query.sort){
    query=query1.sort(req.query.sort);
  }

  //Limiting logic
  if(req.query.fields){
    const fields = req.query.fields.split(',').join(' ');
    query = query.select(fields)
  } else {
    query = query.select('-__v');
  }

  //pagination
  if(req.query.page && req.query.limit) {
    const page = req.query.page*1 || 1;
    const limit = req.query.limit*1 || 10;
    const skip = (page - 1) * limit;
    query = query1.skip(skip).limit(limit)
  }

  const movies = await query

  res.status(201).json({
    status: "success",
    length: movies.length,
    data: movies
  });
});

exports.getMovie = asyncErrorHandler(async (req, res, next) => {
  const oneMovie = await MovieModel.findById(req.params.id);

  if (!oneMovie) {
    // res.status(400).json({
    //   status: "failed",
    //   msg: "Cannot find movie with this Id",
    // });
    const err = new CustomError("Cannot find movie with this Id", 400)
    return next(err)
  }

  res.status(201).json({
    status: "success",
    data: oneMovie,
  });
});

exports.updateMovie = asyncErrorHandler(async (req, res, next) => {
  const movieUp = await MovieModel.findByIdAndUpdate(req.params.id, req.body);

  if (!movieUp) {
    // res.status(400).json({
    //   status: "failed",
    //   msg: "Cannot find movie with this Id",
    // });
    const err = new CustomError("Cannot find movie with this Id", 400)
    return next(err)
  }

  const movieAfter = await MovieModel.findById(req.params.id);

  res.status(201).json({
    status: "success",
    data: movieAfter,
  });
});

exports.deleteMovie = asyncErrorHandler(async (req, res, next) => {
  const movieDeleted = await MovieModel.findByIdAndDelete(req.params.id);

  if (!movieDeleted) {
    // res.status(400).json({
    //   status: "failed",
    //   msg: "Cannot find movie with this Id",
    // });
    const err = new CustomError("Cannot find movie with this Id", 400)
    return next(err)
  }

  res.status(201).json({
    status: "success",
    data: movieDeleted,
  });
});
