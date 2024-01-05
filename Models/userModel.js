const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs')
const crypto = require('crypto')

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
        minLength: 8,
        select: false
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
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
    passwordResetToken: String,
    passwordResetTokenExpires: Date
});

UserSchema.pre('save', async function(next) {
    if(!this.isModified('password')) return next();

    this.password = await bcrypt.hash(this.password, 12);

    this.confirmPassword = undefined;

    next();
})

UserSchema.methods.comparePasswordInDb = async function(pswd, pswdDB) {
    return await bcrypt.compare(pswd, pswdDB)
}

UserSchema.methods.createPasswordToken = function() {
    const resetToken = crypto.randomBytes(32).toString('hex');
    
    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    this.passwordResetTokenExpires = Date.now() + 10 * 60 * 1000;

    return resetToken
}

const User = mongoose.model('User', UserSchema);

module.exports = User;