const express = require('express');
const router = express.Router();
const { isLoggedIn, checkAccess } = require('../../configs/auth');
const advertisementController = require('../../controllers/advertisementController');

router.get('/index', isLoggedIn, checkAccess, advertisementController.index);
router.get('/index/:page', isLoggedIn, checkAccess, advertisementController.index);
router.post('/search', isLoggedIn, checkAccess, advertisementController.search);
router.get('/add', isLoggedIn, checkAccess, advertisementController.add)
    .post('/add', isLoggedIn, checkAccess, advertisementController.addPost);
router.get('/edit/:id', isLoggedIn, checkAccess, advertisementController.edit)
    .post('/edit/:id', isLoggedIn, checkAccess, advertisementController.editPost);
module.exports = router;
