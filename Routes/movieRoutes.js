const express = require("express");
const moviesController = require('../Controllers/movieController')
const authController = require('../Controllers/authController')
const router = express.Router();

router.route('/')
.post((moviesController.createMovie))
.get(authController.protect, moviesController.getAllMovies)

router.route('/:id')
.get(moviesController.getMovie)
.patch(moviesController.updateMovie)
.delete(authController.protect, authController.restrict('admin'), moviesController.deleteMovie)

module.exports = router;

// ('/highest-rated').get
// ('/movie-stats').get
// ('/movies-by-genre/:genre').get
// route('/')
// get((moviesController.getAllMovies))
// post((moviesController.createMovie))
// route('/:id')
// get(moviesController.getMovie)
// patch(moviesController.updateMovie)
// delete(moviesController.deleteMovie)

