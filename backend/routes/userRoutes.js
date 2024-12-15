// backend/routes/userRoutes.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const config = require('../config');

const router = express.Router();

// Sign Up
router.post('/signup', async (req, res) => {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser  = new User({ name, email, password: hashedPassword });
    await newUser .save();
    res.status(201).json({ message: 'User  created successfully' });
});

// Login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id }, config.jwtSecret, { expiresIn: '15d' });
    res.json({ token, user });
});

// Update User
router.put('/:id', async (req, res) => {
    const { name, email, password } = req.body;
    const hashedPassword = password ? await bcrypt.hash(password, 10) : undefined;
    const updatedUser  = await User.findByIdAndUpdate(req.params.id, { name, email, password: hashedPassword }, { new: true });
    res.json(updatedUser );
});

// Delete User
router.delete('/:id', async (req, res) => {
    await User.findByIdAndDelete(req.params.id);
    res.status(204).send();
});

// Get User Profile
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id).populate('borrowedBooks');
        if (!user) {
            return res.status(404).json({ message: 'User  not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

module.exports = router;