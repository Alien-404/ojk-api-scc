const jwt = require('jsonwebtoken');

// environments
const { SECRET_KEY } = process.env;

module.exports = {
    // eslint-disable-next-line arrow-body-style
    generateToken: (payload, expiresIn, secret = SECRET_KEY) => {
        return jwt.sign(payload, secret, { expiresIn });
    },
    verifyToken: (token, secret = SECRET_KEY) => {
        try {
            const decoded = jwt.verify(token, secret);

            return decoded;
        } catch (error) {
            return { error: true };
        }
    },
};