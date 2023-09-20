require('dotenv').config();
const axios = require('axios');

const instance = axios.create({
    baseURL: process.env.BASEURL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${process.env.BEARER}`,
    },
});

module.exports = instance;
