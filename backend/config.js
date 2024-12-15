// backend/config.js
require('dotenv').config();

const config = {
    mongoURI: process.env.MONGO_URI,
    port: process.env.PORT || 5000,
    jwtSecret: process.env.JWT_SECRET,
};

module.exports = config;