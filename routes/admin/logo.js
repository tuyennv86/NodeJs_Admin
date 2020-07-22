const express = require('express');
const router = express.Router();
const { isLoggedIn } = require('../../configs/auth');
const logoController = require('../../controllers/logoController');

router.get('/index', isLoggedIn, logoController.index);
router.get('/index/:page', isLoggedIn, logoController.index);
router.post('/search', isLoggedIn, logoController.search);
router.get('/add', isLoggedIn, logoController.add).post('/add', isLoggedIn, logoController.addPost);
router.get('/edit/:id',isLoggedIn, logoController.edit).post('/edit/:id', isLoggedIn, logoController.editPost);
module.exports = router;