const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true, index: true },
    password: { type: String, select: false },
    role: {
        type: String,
        enum: ['ADMIN', 'MANAGER', 'TRAINER', 'TA'],
        required: true
    },
    emailVerified: { type: Boolean, default: false },
    resetToken: String,
    resetTokenExpiry: Date
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);