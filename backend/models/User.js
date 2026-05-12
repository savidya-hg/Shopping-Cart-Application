const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    googleId: { type: String },
    email: { type: String, unique: true, required: true },
    password: { type: String }, // Optional for OAuth users
    name: { type: String },
    role: { type: String, enum: ['user', 'admin'], default: 'user' }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);