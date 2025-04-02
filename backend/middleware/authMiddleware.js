const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const authHeader = req.header('Authorization');
    if (!authHeader) return res.status(401).json({ error: 'Access denied' });

    try {
        // Remove Bearer prefix and get token
        const token = authHeader.split(' ')[1];
        if (!token) return res.status(401).json({ error: 'Access denied' });

        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();
    } catch (error) {
        console.error('Auth error:', error);
        res.status(400).json({ error: 'Invalid token' });
    }
};

module.exports = authMiddleware;
