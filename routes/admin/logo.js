const express = require('express');
const router = express.Router();
const { isLoggedIn, checkAccess } = require('../../configs/auth');
const logoController = require('../../controllers/logoController');

router.get('/index', isLoggedIn, checkAccess, logoController.index);
router.get('/index/:page', isLoggedIn, checkAccess, logoController.index);
router.post('/search', isLoggedIn, checkAccess, logoController.search);
router.get('/add', isLoggedIn, checkAccess, logoController.add)
    .post('/add', isLoggedIn, checkAccess, logoController.addPost);
router.get('/edit/:id', isLoggedIn, checkAccess, logoController.edit)
    .post('/edit/:id', isLoggedIn, checkAccess, logoController.editPost);
module.exports = router;