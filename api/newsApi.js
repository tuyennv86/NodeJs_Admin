const express = require('express');
const router = express.Router();
const lodash = require('lodash');
const fs = require('fs');
const newsModel = require('../models/News');
const filePath = require('../configs/fileConstants');
const { isLoggedIn } = require('../configs/auth');


router.get('/updateMultilOrder/:str', isLoggedIn, async (req, res, next) => {
    const str = req.params.str;
    let list = lodash.trimEnd(str, ',').split(',');
    list.forEach(item => {
        const order = Number(item.split('-')[0], 1);
        const id = item.split('-')[1];
        if (lodash.isNumber(order)) {
            newsModel.findOneAndUpdate({ _id: id }, { $set: { "order": order } }).exec(function (err, data) {
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
        newsModel.findByIdAndDelete(item).exec(function (err, data) {
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
    newsModel.findByIdAndDelete(id).exec(function (err, data) {
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
router.get('/deleteImageUrl/:newsid/:imgString', isLoggedIn, async (req, res, next) => {
    const id = req.params.newsid;  
    const imgString = req.params.imgString;
     
    try {
        fs.unlink(filePath.imagePath + imgString, function (err) {
          if (err) console.log(err);           
          console.log('File deleted!');
        }); 
      } catch (error) {
        console.log(error);        
      }

      newsModel.findByIdAndUpdate(id ,{$set:{"imageUrl": ""}}).exec(function(err, data){
        if(err) console.log(err);  
            console.log('Xóa thành công');        
            res.json({ status:true, img: data.Name});
        }); 

});
router.get('/checkExistKey/:newskey', isLoggedIn, async (req, res, next) => {
    const newskey = req.params.newskey;
    newsModel.find({ newsKey: newskey }).exec(function (err, data) {
        if (err) return next(err);
        if (data.length) {
            res.json({
                status: true,
                message: "Từ khóa này đã tồn tại trong sản phẩm!"
            })
        } else {
            res.json({
                status: false,
                message: "Ok"
            })
        }
    });
});

router.get('/checkExistKeyOtherId/:newskey/:id', isLoggedIn, async (req, res, next) => {
    const newskey = req.params.newskey;
    const id = req.params.id;
    Product.find({ newsKey: newskey, _id: { $ne: id } }).exec(function (err, data) {
        if (err) return next(err);
        if (data.length) {
            res.json({
                status: true,
                message: "Từ khóa này đã tồn tại trong sản phẩm!"
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