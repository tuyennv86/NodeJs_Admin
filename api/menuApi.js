const express = require('express');
const lodash = require('lodash');
const router = express.Router();
const menuModel = require('../models/Menu');
const { isLoggedIn } = require('../configs/auth');


router.get('/updateMultilOrder/:str', isLoggedIn, async (req, res, next) => {
    const str = req.params.str;
    let list = lodash.trimEnd(str, ',').split(',');
    list.forEach(item => {
        const order = Number(item.split('-')[0], 1);
        const id = item.split('-')[1];
        if (lodash.isNumber(order)) {
            menuModel.findOneAndUpdate({ _id: id }, { $set: { "order": order } }).exec(function (err, data) {
                if (err) console.log(err);
                console.log('update thanh cong');
            });
        }
    });

    res.json({
        status: true
    });
});

router.get('/deleteMultil/:str', isLoggedIn, async (req, res, next) => {
    const str = req.params.str;
    let list = lodash.trimEnd(str, ',').split(',');

    for (let item of list) {
        let a = await menuModel.findByIdAndDelete(item);
    }
    res.json({
        status: true,
        message: "Bạn đã xóa thành công!"
    });
});


router.get('/deleteById/:id', isLoggedIn, async (req, res, next) => {
    const id = req.params.id;
    menuModel.find({ 'parent': id }).exec(function (err, colmenu) {
        if (err) return next(err);
        if (colmenu.length) {
            res.json({
                status: false,
                message: "Bạn phải xóa hết menu con trước"
            });
        } else {
            menuModel.findByIdAndDelete(id).exec(function (err, data) {
                if (err) return next(err);
                res.json({
                    status: true,
                    message: "Đã xóa thành công :" + data.Name
                });
            });
        }
    });

});


module.exports = router;