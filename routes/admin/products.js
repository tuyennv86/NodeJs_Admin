const express = require('express');
const router = express.Router();
const { isLoggedIn } = require('../../configs/auth');
const productContronller = require('../../controllers/productController');

 router.get('/index',isLoggedIn, productContronller.index);
 router.get('/index/:page',isLoggedIn, productContronller.index)
 .post('/index/:page',isLoggedIn, productContronller.postIndex);
 router.get('/add',isLoggedIn, productContronller.add)
 .post('/add',isLoggedIn, productContronller.addPost);
 router.get('/edit/:id',isLoggedIn, productContronller.edit)
 .post('/edit/:id',isLoggedIn, productContronller.editPost);
 router.post('/search', isLoggedIn, productContronller.search);
 router.get('/delete/:id', isLoggedIn, productContronller.delete);

module.exports = router;