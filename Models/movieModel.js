const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required field!'],
        unique: true,
        maxlength: [100, "Movie name must not have more than 100 characters"],
        minlength: [4, "Movie name must have at least 4 charachters"],
        trim: true,
        //validate: [validator.isAlpha, "Name should only contain alphabets."]
    },
    description: {
        type: String,
        required: [true, 'Description is required field!'],
        trim: true
    },
    duration: {
        type: Number,
        required: [true, 'Duration is required field!']
    },
    ratings: {
        type: Number,
        validate: {
            validator: function(value){
                return value >= 1 && value <= 10;
            },
            message: "Ratings ({VALUE}) should be above 1 and below 10"
        }
    },
    totalRating: {
        type: Number
    },
    releaseYear: {
        type: Number,
        required: [true, 'Release year is required field!']
    },
    releaseDate:{
        type: Date
    },
    createdAt: {
        type: Date,
        default: Date.now(),
        select: false
    },
    genres: {
        type: [String],
        required: [true, 'Genres is required field!'],
        // enum: {
        //      values: ["Action", "Adventure", "Sci-Fi", "Thriller", "Crime", "Drama", "Comedy", "Romance", "Biography"],
        //      message: "This genre does not exist"
        // }
    },
    directors: {
        type: [String],
        required: [true, 'Directors is required field!']
    },
    coverImage:{
        type: String,
        required: [true, 'Cover image is required field!']
    },
    actors: {
        type: [String],
        required: [true, 'actors is required field!']
    },
    price: {
        type: Number,
        required: [true, 'Price is required field!']
    },
    createdBy: String
}, {
    toJSON: {virtuals: true},
    toObject: {virtuals: true}
});


const Movie = mongoose.model('Movie', movieSchema);

module.exports = Movie;