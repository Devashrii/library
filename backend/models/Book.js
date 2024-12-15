// backend/models/Book.js
const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    title: { type: String, required: true },
    author: { type: String, required: true },
    genre: { type: String, required: true },
    stock: { type: Number, required: true, default: 1 },
}, { timestamps: true });

module.exports = mongoose.model('Book', bookSchema);