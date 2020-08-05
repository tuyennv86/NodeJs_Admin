const express = require('express');
const router = express.Router();
const { isLoggedIn, checkAccess } = require('../../configs/auth');
const productContronller = require('../../controllers/productController');

router.get('/index', isLoggedIn, checkAccess, productContronller.index);
router.get('/index/:page', isLoggedIn, checkAccess, productContronller.index)
    .post('/index/:page', isLoggedIn, checkAccess, productContronller.postIndex);
router.get('/add', isLoggedIn, checkAccess, productContronller.add)
    .post('/add', isLoggedIn, checkAccess, productContronller.addPost);
router.get('/edit/:id', isLoggedIn, checkAccess, productContronller.edit)
    .post('/edit/:id', isLoggedIn, checkAccess, productContronller.editPost);
router.post('/search', isLoggedIn, checkAccess, productContronller.search);
router.get('/delete/:id', isLoggedIn, checkAccess, productContronller.delete);

module.exports = router;