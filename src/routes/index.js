// module
require('dotenv').config();
const router = require('express').Router();

const { authHandler } = require('../middleware/');

// router
const authRouter = require('./auth.route');
const certificateRouter = require('./certificate.route');

router.get('/', (req, res) => {
    return res.status(200).json({
        status: true,
        message: 'welcome to ojk api!',
        data: null,
    });
});

// auth route
router.use('/auth', authRouter);

// certificate
router.use('/certificate', authHandler, certificateRouter);


module.exports = router;