const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: { type: String, unique: true, required: true },
    password: { type: String }, // Optional for OAuth users
    name: { type: String },
    googleId: { type: String },
    facebookId: { type: String },
    role: { type: String, enum: ['user', 'admin'], default: 'user' }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);