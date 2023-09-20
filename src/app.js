require('dotenv').config();

// modules
const morgan = require('morgan');
const cors = require('cors');
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('./utils/docs/swagger-output.json');
const bodyParser = require('body-parser');

// router
const { errorHandler, notFoundHandler } = require('./middleware')
const indexRouter = require('./routes')

const app = express();
const { PORT = 8080 } = process.env;

// middlewares
app.use(cors());
app.use(bodyParser.json())
app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile))
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan('dev'));

// router
app.use(indexRouter);

// server error handling middleware
app.use(notFoundHandler);
app.use(errorHandler);

// listen
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Running on port ${PORT}`);
});