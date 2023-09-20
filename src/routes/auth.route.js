// modules
const router = require('express').Router();

const authRoutes = require('../controllers/auth.controller')

// endpoint
router.post('/register', authRoutes.register);
router.post('/login', authRoutes.login);

module.exports = router;