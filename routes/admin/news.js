const express = require('express');
const router = express.Router();
const { isLoggedIn } = require('../../configs/auth');
const newsContronller = require('../../controllers/newsController');

router.get('/index', isLoggedIn, newsContronller.index);
router.get('/index/:page',isLoggedIn, newsContronller.index)
router.post('/search', isLoggedIn, newsContronller.search);
router.get('/add', isLoggedIn, newsContronller.add).post('/add', isLoggedIn, newsContronller.addPost);
router.get('/edit/:id',isLoggedIn, newsContronller.edit).post('/edit/:id', isLoggedIn, newsContronller.editPost);
module.exports = router;