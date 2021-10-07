const express = require('express');
const router = express.Router();
const userCopntroller = require('../../controllers/userController');
const { isLoggedIn, notLoggedIn } = require('../../configs/auth');

router.get('/index', isLoggedIn, userCopntroller.index);
router.get('/unauthorized', isLoggedIn, userCopntroller.unauthorized);
//login
router.get('/', notLoggedIn, userCopntroller.login)
    .post('/', notLoggedIn, userCopntroller.postLogin);
// Logout
router.get('/logout', userCopntroller.logout);

router.get('/profile', isLoggedIn, userCopntroller.profile)
    .post('/profile', isLoggedIn, userCopntroller.postProfile);

router.get('/changpass', isLoggedIn, userCopntroller.changpass)
    .post('/changpass', isLoggedIn, userCopntroller.postChangpass);

router.get('/user/list', isLoggedIn, userCopntroller.listUsers)
router.get('/user/list/:page', isLoggedIn, userCopntroller.listUsers)
    .post('/user/list/:page', isLoggedIn, userCopntroller.postListUsers);

router.get('/user/edit/:id', isLoggedIn, userCopntroller.editUser)
    .post('/user/edit/:id', isLoggedIn, userCopntroller.postEditUser);

router.get('/user/delete/:id', isLoggedIn, userCopntroller.deleteUser);

router.get('/user/add', isLoggedIn, userCopntroller.addUser)
    .post('/user/add', isLoggedIn, userCopntroller.postAddUser);

module.exports = router;