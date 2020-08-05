const express = require('express');
const router = express.Router();
const { isLoggedIn, checkAccess } = require('../../configs/auth');
const newsContronller = require('../../controllers/newsController');

router.get('/index', isLoggedIn, checkAccess, newsContronller.index);
router.get('/index/:page', isLoggedIn, checkAccess, newsContronller.index)
router.post('/search', isLoggedIn, checkAccess, newsContronller.search);
router.get('/add', isLoggedIn, checkAccess, newsContronller.add)
    .post('/add', isLoggedIn, checkAccess, newsContronller.addPost);
router.get('/edit/:id', isLoggedIn, checkAccess, newsContronller.edit)
    .post('/edit/:id', isLoggedIn, checkAccess, newsContronller.editPost);
module.exports = router;