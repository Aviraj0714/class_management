const jwt = require('jsonwebtoken');

exports.generateAccessToken = (user) =>
    jwt.sign({ id: user._id, role: user.role },
        process.env.JWT_ACCESS_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
    );

exports.generateRefreshToken = (user) =>
    jwt.sign({ id: user._id },
        process.env.JWT_REFRESH_SECRET, { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
    );