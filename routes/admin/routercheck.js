const express = require('express');
const router = express.Router();
const { isLoggedIn } = require('../../configs/auth');
const routercheckController = require('../../controllers/routerCheckController');
const { Router } = require('express');

router.get('/index', isLoggedIn, routercheckController.index);
router.post('/search', isLoggedIn, routercheckController.search);
router.get('/add', isLoggedIn, routercheckController.add)
    .post('/add', isLoggedIn, routercheckController.addPost);
router.get('/edit/:id', isLoggedIn, routercheckController.edit)
    .post('/edit/:id', isLoggedIn, routercheckController.editPost);
router.get('/delete/:id', isLoggedIn, routercheckController.delete);
module.exports = router;