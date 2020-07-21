const express = require('express');
const router = express.Router();
const { isLoggedIn } = require('../../configs/auth');
const advertisementController = require('../../controllers/advertisementController');

router.get('/index', isLoggedIn, advertisementController.index);
router.get('/index/:page',isLoggedIn, advertisementController.index);
router.post('/search', isLoggedIn, advertisementController.search);
router.get('/add', isLoggedIn, advertisementController.add).post('/add', isLoggedIn, advertisementController.addPost);
router.get('/edit/:id',isLoggedIn, advertisementController.edit).post('/edit/:id', isLoggedIn, advertisementController.editPost);
module.exports = router;
