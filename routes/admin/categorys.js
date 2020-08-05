const express = require('express');
const router = express.Router();
const { isLoggedIn, checkAccess } = require('../../configs/auth');
const categoryContronller = require('../../controllers/categoryController');

//Begin categoryType
router.get('/categorytype', isLoggedIn, checkAccess, categoryContronller.categoryType);
router.get('/categorytype/:page', isLoggedIn, checkAccess, categoryContronller.categoryType)
    .post('/categorytype/:page', isLoggedIn, checkAccess, categoryContronller.deleteMultiCategroryType);
router.get('/addcategorytype', isLoggedIn, checkAccess, categoryContronller.addCategoryType)
    .post('/addcategorytype', isLoggedIn, checkAccess, categoryContronller.postAddCategoryType);
router.get('/editcategorytype/:id', isLoggedIn, checkAccess, categoryContronller.editCategoryType)
    .post('/editcategorytype/:id', isLoggedIn, checkAccess, categoryContronller.postEditCategoryType);
router.get('/deletecategorytype/:id', isLoggedIn, checkAccess, categoryContronller.deleteCategoryType);
//End CategoryType

//Begin Category 

router.get('/Index', isLoggedIn, checkAccess, categoryContronller.index);
router.get('/Index/:page', isLoggedIn, checkAccess, categoryContronller.index)
    .post('/Index/:page', isLoggedIn, checkAccess, categoryContronller.postIndex);

router.get('/delete/:id', isLoggedIn, checkAccess, categoryContronller.deletebyId);

router.get('/TypeIndex/:typeId', isLoggedIn, checkAccess, categoryContronller.indexType);
router.get('/TypeIndex/:typeId/:page', isLoggedIn, checkAccess, categoryContronller.indexType);
router.get('/Add', isLoggedIn, checkAccess, categoryContronller.addCategory)
    .post('/Add', isLoggedIn, checkAccess, categoryContronller.postAddCcategory);

router.get('/Edit/:id', isLoggedIn, checkAccess, categoryContronller.editCategory)
    .post('/Edit/:id', isLoggedIn, checkAccess, categoryContronller.postEditCategory);

router.post('/search', isLoggedIn, checkAccess, categoryContronller.search);
router.post('/searchType/:typeId', isLoggedIn, checkAccess, categoryContronller.searchType);


//End Category

module.exports = router;
