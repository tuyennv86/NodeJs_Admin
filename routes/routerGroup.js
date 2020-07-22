const express = require('express');
const router = express.Router();

const advertisementRouter = require('./admin/advertisement');
const categoryRouter = require('./admin/categorys');
const logoRouter = require('./admin/logo');
const menuRouter = require('./admin/menus');
const newRouter = require('./admin/news');
const productRouter = require('./admin/products');
const usersRouter = require('./admin/users');

advertisementRouter(router);
categoryRouter(router);
logoRouter(router);
menuRouter(router);
newRouter(router);
productRouter(router);
usersRouter(router);

module.exports = router;