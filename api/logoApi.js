const express = require('express');
const router = express.Router();
const lodash = require('lodash');
const fs = require('fs');
const logoModel = require('../models/Logo');
const filePath = require('../configs/fileConstants');
const { isLoggedIn } = require('../configs/auth');


router.get('/updateMultilOrder/:str', isLoggedIn, async (req, res, next) => {
    const str = req.params.str;
    let list = lodash.trimEnd(str, ',').split(',');
    list.forEach(item => {
        const order = Number(item.split('-')[0], 1);
        const id = item.split('-')[1];
        if (lodash.isNumber(order)) {
            logoModel.findOneAndUpdate({ _id: id }, { $set: { "order": order } }).exec(function (err, data) {
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

    list.forEach(item => {
        logoModel.findByIdAndDelete(item).exec(function (err, data) {
            if (err) return next(err);
            // xoa anh
            if (data.imageUrl !== '') {
                try {
                    fs.unlinkSync(filePath.imagePath + data.imageUrl, function (err) {
                        if (err) console.log(err);
                        console.log('File deleted!');
                    });
                } catch (error) {
                    console.log(error);
                }
            }
        });
    });
    res.json({
        status: true,
        message: "Bạn đã xóa thành công!"
    });
});


router.get('/deleteById/:id', isLoggedIn, async (req, res, next) => {
    const id = req.params.id;
    logoModel.findByIdAndDelete(id).exec(function (err, data) {
        if (err) return next(err);
        // xoa anh
        if (data.imageUrl !== '') {
            try {
                fs.unlinkSync(filePath.imagePath + data.imageUrl, function (err) {
                    if (err) console.log(err);
                    console.log('File deleted!');
                });
            } catch (error) {
                console.log(error);
            }
        }
        res.json({
            status: true,
            message: "Đã xóa thành công :" + data.Name
        });
    });
});


module.exports = router;