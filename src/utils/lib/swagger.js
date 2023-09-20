const swaggerAutogen = require('swagger-autogen')()

const doc = {
    info: {
        version: "1.0.0",
        title: "OJK | SMART CHAIN CODE API",
        description: "Welcome to the OJK SMART CHAIN CODE API documentation. This API provides access to various financial services and data. Please note that authentication is required for most endpoints"
    },
    host: "localhost:8080",
    basePath: "/",
    schemes: ['http', 'https'],
    consumes: ['application/json'],
    produces: ['application/json'],
    tags: [
        {
            "name": "Auth",
            "description": "Endpoints"
        },
        {
            "name": "Certificate",
            "description": "Endpoints"
        },
    ],
    securityDefinitions: {
        bearer_auth: {
            type: "access token",
            name: "Authorization",
            in: "header",
            description: "Enter your bearer token in the format 'Bearer {token}'"
        }
    },
}

const outputFile = '../docs/swagger-output.json';
const endpointsFiles = ['../../routes/auth.route.js', '../../routes/certificate.route.js'];

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
    require('../../app')           // Your project's root file
})