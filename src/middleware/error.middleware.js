// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
    // Takes the status code of the error, or assumes 500 if it doesn't exist
    const statusCode = err.statusCode || 500;

    // Retrieve error messages
    const message = err.message || 'Internal Server Error';

    // Returns an error response to the client
    res.status(statusCode).json({
        error: {
            message,
        },
    });
};

module.exports = errorHandler;