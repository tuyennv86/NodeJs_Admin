const express = require('express');
var lodash = require('lodash');
const router = express.Router();
const category = require('../models/Category');
// const Promise = require('bluebird');
const listtree = require('../utils/listTree');
const { isLoggedIn } = require('../configs/auth');

router.get('/getparent/:typeId', isLoggedIn, async (req, res, next) => {

    const typeId = req.params.typeId || "";
    category.find({ categoryType: typeId }).exec(function (err, data) {
        if (err) return next(err);
        res.json({
            data: listtree.list_to_tree(data),
            status: true
        });
    });
});

router.get('/updateMultil/:str', isLoggedIn, async (req, res, next) => {
    const str = req.params.str;
    var list = lodash.trimEnd(str, ',').split(',');
    list.forEach(item => {

        const order = Number(item.split('-')[0], 1);
        const id = item.split('-')[1];
        if (lodash.isNumber(order)) {
            category.findOneAndUpdate({ _id: id }, { $set: { "order": order } }).exec(function (err, data) {
                if (err) console.log(err);
                console.log('update thanh cong');
            });
        }
    });

    res.json({
        status: true
    });

});

router.get('/updateMultilPageSize/:str', isLoggedIn, async (req, res, next) => {
    const str = req.params.str;
    var list = lodash.trimEnd(str, ',').split(',');
    list.forEach(item => {

        const pageNumber = Number(item.split('-')[0], 1);
        const id = item.split('-')[1];
        if (lodash.isNumber(pageNumber)) {
            category.findOneAndUpdate({ _id: id }, { $set: { "pageNumber": pageNumber } }).exec(function (err, data) {
                if (err) console.log(err);
                console.log('update thanh cong');
            });
        }
    });

    res.json({
        status: true
    });

});

router.get('/deleteImageUrl/:id/:imgString', isLoggedIn, async (req, res, next) => {
    const id = req.params.id;
    const imgString = req.params.imgString;

    try {
        fs.unlink(filePath.imagePath + imgString, function (err) {
            if (err) console.log(err);
            console.log('File deleted!');
        });
    } catch (error) {
        console.log(error);
    }

    category.findByIdAndUpdate(id, { $set: { "imageUrl": "" } }).exec(function (err, data) {
        if (err) console.log(err);
        console.log('Xóa thành công');
        res.json({ status: true, img: data.categoryName });
    });

});

router.get('/checkExistCategoryKey/:categorykey', isLoggedIn, async (req, res, next) => {
    const categorykey = req.params.categorykey;
    category.find({ categoryKey: categorykey }).exec(function (err, data) {
        if (err) return next(err);
        if (data.length) {
            res.json({
                status: true,
                message: "Từ khóa này đã tồn tại trong danh mục!"
            })
        } else {
            res.json({
                status: false,
                message: "Ok"
            })
        }
    });
});

router.get('/checkExistCategoryKeyOtherId/:categorykey/:id', isLoggedIn, async (req, res, next) => {
    const categorykey = req.params.categorykey;
    const id = req.params.id;
    category.find({ categoryKey: categorykey,_id: { $ne: id}}).exec(function (err, data) {
        if (err) return next(err);
        if (data.length) {
            res.json({
                status: true,
                message: "Từ khóa này đã tồn tại trong danh mục!"
            })
        } else {
            res.json({
                status: false,
                message: "Ok"
            })
        }
    });
});

module.exports = router;