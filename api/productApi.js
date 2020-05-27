const express = require('express');
var lodash = require('lodash');
const router = express.Router();
const fs = require('fs');
const Product = require('../models/Product');
const filePath = require('../configs/fileConstants');
const { isLoggedIn } = require('../configs/auth');

router.get('/deleteimageRelated/:imgdelete/:productid', isLoggedIn , async (req, res, next) =>{
     
    const imgdelete = req.params.imgdelete || "";
    const productid = req.params.productid || ""; 
    const listimg = req.query.listimg || ""; 
    console.log(imgdelete);
   
    let array = [];
    if(listimg.length > 0){
      array = listimg.split(',');
    }

    try {
        fs.unlink(filePath.imagePath + imgdelete , function (err) {
          if (err) console.log(err);           
          console.log('File deleted!');
        }); 
      } catch (error) {
        console.log(error);        
      }
    // update lai mang Image cua product  va xoa anh o trong thu muc
    Product.findByIdAndUpdate(productid ,{$set:{"imageRelated": array}}).exec(function(err, data){
    if(err) console.log(err);  
        console.log('Xóa thành công');        
        res.json({ status:true});
    }); 
});


router.get('/deleteImageUrl/:productid/:imgString', isLoggedIn, async (req, res, next) => {
    const productid = req.params.productid;  
    const imgString = req.params.imgString;
     
    try {
        fs.unlink(filePath.imagePath + imgString, function (err) {
          if (err) console.log(err);           
          console.log('File deleted!');
        }); 
      } catch (error) {
        console.log(error);        
      }

      Product.findByIdAndUpdate(productid ,{$set:{"imageUrl": ""}}).exec(function(err, data){
        if(err) console.log(err);  
            console.log('Xóa thành công');        
            res.json({ status:true, img: data.productName});
        }); 

});




module.exports = router;



