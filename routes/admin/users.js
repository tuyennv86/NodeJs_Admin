const express = require('express');
const router = express.Router();

// Load User model
const User = require('../../models/User');
const userCopntroller = require('../../controllers/userController');
const { isLoggedIn, notLoggedIn } = require('../../configs/auth');

router.get('/index', isLoggedIn, userCopntroller.index);

//login
router.get('/', notLoggedIn, userCopntroller.login);

// Login
router.post('/', notLoggedIn, userCopntroller.postLogin);

// router.get('/dang-ky', notLoggedIn, userCopntroller.register);

// // Register
// router.post('/dang-ky', notLoggedIn, userCopntroller.postRegister);

// Logout
router.get('/logout', userCopntroller.logout);

router.get('/profile', isLoggedIn, userCopntroller.profile);

router.post('/profile', isLoggedIn, userCopntroller.postProfile);

router.get('/changpass', isLoggedIn, userCopntroller.changpass);
router.post('/changpass', isLoggedIn, userCopntroller.postChangpass);

router.get('/user/list/:page', isLoggedIn, userCopntroller.listUsers);
router.post('/user/list/:page', isLoggedIn, userCopntroller.postListUsers);

router.get('/user/edit/:id', isLoggedIn, userCopntroller.editUser);
router.post('/user/edit/:id', isLoggedIn, userCopntroller.postEditUser);

router.get('/user/delete/:id', isLoggedIn, userCopntroller.deleteUser);

router.get('/user/add', isLoggedIn, userCopntroller.addUser);
router.post('/user/add', isLoggedIn, userCopntroller.postAddUser);

module.exports = router;