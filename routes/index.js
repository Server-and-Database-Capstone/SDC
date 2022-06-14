const express = require('express');
const router = express.Router();
const metaRouter = require('./meta');
const reviewsRouter = require('./reviews');

router.use('/meta', metaRouter);
router.use('/', reviewsRouter);

module.exports = router;