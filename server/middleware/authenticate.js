const jwt = require('jsonwebtoken');
require('dotenv').config();

const authenticateJWT = (req, res, next) => {
    const authHeader = req.header('Authorization');
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null || !token) {
        return res.status(401).json({ logout: true, message: 'No token found' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.user = decoded;
        next();

    } catch (error) {
        return res.status(403).json({ logout: true, message: 'Login expired' });
    }
};

module.exports = authenticateJWT;