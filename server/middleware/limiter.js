const rateLimit = require('express-rate-limit');

module.exports = rateLimit({
    windowMs: 100,
    max: 1,
    keyGenerator: (req) => {
        return req.user.id || '';
    },
});