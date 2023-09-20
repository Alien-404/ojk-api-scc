const notFoundHandler = require('./notfound.middleware');
const errorHandler = require('./error.middleware');
const authHandler = require('./auth.middleware');

module.exports = {
    notFoundHandler,
    errorHandler,
    authHandler
};