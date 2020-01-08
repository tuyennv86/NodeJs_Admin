const express = require('express');
const router = express.Router();
const { isLoggedIn } = require('../../configs/auth');
const categoryContronller = require('../../controllers/categoryController');

//Begin categoryType
router.get('/categorytype', isLoggedIn, categoryContronller.categoryType);
router.get('/categorytype/:page', isLoggedIn, categoryContronller.categoryType)
.post('/categorytype/:page', isLoggedIn, categoryContronller.deleteMultiCategroryType);
router.get('/addcategorytype', isLoggedIn, categoryContronller.addCategoryType)
.post('/addcategorytype', isLoggedIn, categoryContronller.postAddCategoryType);
router.get('/editcategorytype/:id', isLoggedIn, categoryContronller.editCategoryType)
.post('/editcategorytype/:id', isLoggedIn, categoryContronller.postEditCategoryType);
router.get('/deletecategorytype/:id', isLoggedIn, categoryContronller.deleteCategoryType);
//End CategoryType

//Begin Category 

router.get('/Index', isLoggedIn, categoryContronller.index);
router.get('/Index/:page', isLoggedIn, categoryContronller.index)
.post('/Index/:page', isLoggedIn, categoryContronller.postIndex);


router.get('/TypeIndex/:typeId', isLoggedIn, categoryContronller.indexType);
router.get('/TypeIndex/:typeId/:page', isLoggedIn, categoryContronller.indexType);
router.get('/Add', isLoggedIn, categoryContronller.addCategory)
.post('/Add',isLoggedIn, categoryContronller.postAddCcategory);

router.post('/search', isLoggedIn, categoryContronller.search);
router.post('/searchType/:typeId', isLoggedIn, categoryContronller.searchType);


//End Category

module.exports = router;
