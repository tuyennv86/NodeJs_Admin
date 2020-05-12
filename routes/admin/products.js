const express = require('express');
const router = express.Router();
const { isLoggedIn } = require('../../configs/auth');
const productContronller = require('../../controllers/productController');

 router.get('/index',isLoggedIn, productContronller.index);
 router.get('/index/:page',isLoggedIn, productContronller.index);
 router.get('/add',isLoggedIn, productContronller.add)
 .post('/add',isLoggedIn, productContronller.addPost);
 router.get('/edit',isLoggedIn, productContronller.edit)
 .post('/edit',isLoggedIn, productContronller.editPost);

module.exports = router;