const express = require('express');
const router = express.Router();
const { isLoggedIn } = require('../../configs/auth');
const menuContronller = require('../../controllers/menuController');

router.get('/index', isLoggedIn, menuContronller.index);
router.post('/search', isLoggedIn, menuContronller.search);
router.get('/add', isLoggedIn, menuContronller.add).post('/add', isLoggedIn, menuContronller.addPost);

module.exports = router;