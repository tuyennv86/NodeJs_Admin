const express = require('express');
const router = express.Router();
const { isLoggedIn, notLoggedIn } = require('../../configs/auth');
const categoryContronller = require('../../controllers/categoryController');

/* GET home page. */
router.get('/', isLoggedIn, categoryContronller.index);

module.exports = router;
