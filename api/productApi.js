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

router.get('/updateMultilOrder/:str', isLoggedIn, async (req, res, next) =>{
  const str = req.params.str;
  var list  = lodash.trimEnd(str,',').split(',');
  list.forEach(item =>{
     
      const order = Number(item.split('-')[0],1);
      const id = item.split('-')[1];
      if(lodash.isNumber(order)){
        Product.findOneAndUpdate({_id:id},{$set:{"order": order}}).exec(function(err, data){
          if(err) console.log(err);            
          console.log('update thanh cong');            
          });
      }
  });
  
  res.json({
      status : true
  });

});

router.get('/updateMultilQuantum/:str', isLoggedIn, async (req, res, next) =>{
  const str = req.params.str;
  var list  = lodash.trimEnd(str,',').split(',');
  list.forEach(item =>{
     
      const quantum = Number(item.split('-')[0],1);
      const id = item.split('-')[1];
      if(lodash.isNumber(quantum)){
        Product.findOneAndUpdate({_id:id},{$set:{"quantum": quantum}}).exec(function(err, data){
          if(err) console.log(err);            
          console.log('update thanh cong');            
          });
      }
  });
  
  res.json({
      status : true
  });

});

router.get('/checkExistProductKey/:productkey', isLoggedIn, async(req, res, next) =>{
  const productkey = req.params.productkey;
  Product.find({productKey: productkey}).exec(function(err, data){
      if(err) return next(err);
      if(data.length){
          res.json({
              status:true,
              message:"Từ khóa này đã tồn tại trong sản phẩm!"
          })
      }else{
          res.json({
              status:false,
              message:"Ok"
          })
      }
  });    
});

router.get('/checkExistProductKeyOtherId/:productkey/:id', isLoggedIn, async (req, res, next) => {
  const productkey = req.params.productkey;
  const id = req.params.id;
  Product.find({productKey: productkey, _id: { $ne: id}}).exec(function(err, data){  
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



