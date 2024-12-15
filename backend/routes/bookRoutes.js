// backend/routes/bookRoutes.js
const express = require('express');
const Book = require('../models/Book');
const User = require('../models/User');

const router = express.Router();

// Create a new book (Author)
router.post('/', async (req, res) => {
    const { title, author, genre, stock } = req.body;
    const newBook = new Book({ title, author, genre, stock });
    await newBook.save();
    res.status(201).json(newBook);
});

// Read all books (for Readers)
router.get('/', async (req, res) => {
    const books = await Book.find();
    res.json(books);
});

// Update a book (Author)
router.put('/:id', async (req, res) => {
    const { title, author, genre, stock } = req.body;
    const updatedBook = await Book.findByIdAndUpdate(req.params.id, { title, author, genre, stock }, { new: true });
    res.json(updatedBook);
});

// Delete a book (Author)
router.delete('/:id', async (req, res) => {
    await Book.findByIdAndDelete(req.params.id);
    res.status(204).send();
});

// Borrow a book (Reader)
router.post('/:id/borrow', async (req, res) => {
    const userId = req.body.userId; // Assume userId is sent in the request body
    const book = await Book.findById(req.params.id);
    const user = await User.findById(userId);

    if (!book || book.stock <= 0) {
        return res.status(400).json({ message: 'Book not available' });
    }

    if (user.borrowedBooks.length >= 5) {
        return res.status(400).json({ message: 'You can only borrow up to 5 books' });
    }

    user.borrowedBooks.push(book._id);
    book.stock -= 1;

    await user.save();
    await book.save();

    res.json({ message: 'Book borrowed successfully', book });
});

// Return a book (Reader)
router.post('/:id/return', async (req, res) => {
    const userId = req.body.userId; // Assume userId is sent in the request body
    const book = await Book.findById(req.params.id);
    const user = await User.findById(userId);

    if (!user.borrowedBooks.includes(book._id)) {
        return res.status(400).json({ message: 'You did not borrow this book' });
    }

    user.borrowedBooks = user.borrowedBooks.filter(b => b.toString() !== book._id.toString());
    book.stock += 1;

    await user.save();
    await book.save();

    res.json({ message: 'Book returned successfully', book });
});

module.exports = router;