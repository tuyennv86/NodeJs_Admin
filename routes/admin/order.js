const express = require('express');
const router = express.Router();
const { isLoggedIn, checkAccess } = require('../../configs/auth');
const orderController = require('../../controllers/orderController');

router.get('/index', isLoggedIn, checkAccess, orderController.index);
router.get('/index/:page', isLoggedIn, checkAccess, orderController.index);
router.post('/search', isLoggedIn, checkAccess, orderController.search);
router.get('/add', isLoggedIn, checkAccess, orderController.add)
    .post('/add', isLoggedIn, checkAccess, orderController.addPost);
router.get('/updateStatus/:list', isLoggedIn, checkAccess, orderController.updateStatus);
// router.get('/edit/:id', isLoggedIn, checkAccess, productContronller.edit)
//     .post('/edit/:id', isLoggedIn, checkAccess, productContronller.editPost);

// router.get('/delete/:id', isLoggedIn, checkAccess, productContronller.delete);

module.exports = router;