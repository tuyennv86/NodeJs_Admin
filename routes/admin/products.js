const express = require('express');
const router = express.Router();
const { isLoggedIn } = require('../../configs/auth');
const productContronller = require('../../controllers/productController');

 router.get('/index',isLoggedIn, productContronller.index);
 router.get('/index/:page',isLoggedIn, productContronller.index);

module.exports = router;