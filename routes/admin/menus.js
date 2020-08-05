const express = require('express');
const router = express.Router();
const { isLoggedIn, checkAccess } = require('../../configs/auth');
const menuContronller = require('../../controllers/menuController');

router.get('/index', isLoggedIn, checkAccess, menuContronller.index);
router.post('/search', isLoggedIn, checkAccess, menuContronller.search);
router.get('/add', isLoggedIn, checkAccess, menuContronller.add).post('/add', isLoggedIn, menuContronller.addPost);
router.get('/edit/:id', isLoggedIn, checkAccess, menuContronller.edit).post('/edit/:id', isLoggedIn, menuContronller.editPost);
module.exports = router;