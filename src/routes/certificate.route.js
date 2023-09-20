// modules
const router = require('express').Router();

const certificateRoutes = require('../controllers/certificate.controller')

// endpoint
router.get('/', certificateRoutes.index);
router.post('/', certificateRoutes.create);
router.get('/my', certificateRoutes.own);
router.get('/history/:id', certificateRoutes.history);
router.get('/single/:id', certificateRoutes.single);

module.exports = router;