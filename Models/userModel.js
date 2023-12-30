const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs')

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter your name']
    },
    email: {
        type: String,
        required: [true, 'Please enter an email'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, "Please enter a valid email"]
    },
    photo: {
        type: String,
    },
    password: {
        type: String,
        required: [true, 'Please enter a password'],
        minLength: 8
    },
    confirmPassword: {
        type: String,
        required: [true, 'Please enter a password'],
        validate: {
            // this only work with save and create
            validator: function(val) {
                return val == this.password;
            },
            message: 'Password & Confirm password does not match'
        }
    },
});

UserSchema.pre('save', async function(next) {
    if(!this.isModified('password')) return next();

    this.password = await bcrypt.hash(this.password, 12);

    this.confirmPassword = undefined;

    next();
})


const User = mongoose.model('User', UserSchema);

module.exports = User;