const express = require('express');
const router = express.Router();
const lodash = require('lodash');
const fs = require('fs');
const advertisementModel = require('../models/Advertisement');
const filePath = require('../configs/fileConstants');
const { isLoggedIn } = require('../configs/auth');


router.get('/updateMultilOrder/:str', isLoggedIn, async (req, res, next) => {
    const str = req.params.str;
    let list = lodash.trimEnd(str, ',').split(',');
    list.forEach(item => {
        const order = Number(item.split('-')[0], 1);
        const id = item.split('-')[1];
        if (lodash.isNumber(order)) {
            advertisementModel.findOneAndUpdate({ _id: id }, { $set: { "order": order } }).exec(function (err, data) {
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
        advertisementModel.findByIdAndDelete(item).exec(function (err, data) {
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
    advertisementModel.findByIdAndDelete(id).exec(function (err, data) {
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
router.get('/deleteImageUrl/:id', isLoggedIn, async (req, res, next) => {
    const id = req.params.id;
    //const imgString = req.params.imgString;
    advertisementModel.findById(id).exec(function (err, data) {
        try {
            if (!data.viewType) {
                fs.unlink(filePath.imagePath + data.imageUrl, function (err) {
                    if (err) console.log(err);
                    console.log('File deleted!');
                });
            }
        } catch (error) {
            console.log(error);
        }
    });

    advertisementModel.findByIdAndUpdate(id, { $set: { "imageUrl": "" } }).exec(function (err, data) {
        if (err) console.log(err);
        console.log('Xóa thành công');
        res.json({ status: true, img: data.Name });
    });

});


module.exports = router;