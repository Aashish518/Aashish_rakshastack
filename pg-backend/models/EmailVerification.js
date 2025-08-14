const mongoose = require('mongoose');
const { Schema } = mongoose;

const emailVerificationSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    otp: {
        type: String,
        required: true
    },
    otpExpires: {
        type: Date,
        required: true
    }
});

module.exports = mongoose.model('EmailVerification', emailVerificationSchema);
