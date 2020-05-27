const express = require('express');
var lodash = require('lodash');
const router = express.Router();
const category = require('../models/Category');
const Promise = require('bluebird');
const listtree = require('../utils/listTree');
const { isLoggedIn } = require('../configs/auth');

router.get('/getparent/:typeId', isLoggedIn , async (req, res, next) =>{
     
    const typeId = req.params.typeId || ""; 
    category.find({categoryType: typeId}).exec(function(err, data){
        if(err) return next(err);           
        res.json({
            data: listtree.list_to_tree(data),
            status:true
        });
    });   
});

router.get('/updateMultil/:str', isLoggedIn, async (req, res, next) =>{
    const str = req.params.str;
    var list  = lodash.trimEnd(str,',').split(',');
    list.forEach(item =>{
       
        const order = Number(item.split('-')[0],1);
        const id = item.split('-')[1];
        if(lodash.isNumber(order)){
            category.findOneAndUpdate({_id:id},{$set:{"order": order}}).exec(function(err, data){
            if(err) console.log(err);            
            console.log('update thanh cong');            
            });
        }
    });
    
    res.json({
        status : true
    });

});

router.get('/updateMultilPageSize/:str', isLoggedIn, async (req, res, next) =>{
    const str = req.params.str;
    var list  = lodash.trimEnd(str,',').split(',');
    list.forEach(item =>{
       
        const pageNumber = Number(item.split('-')[0],1);
        const id = item.split('-')[1];
        if(lodash.isNumber(order)){
            category.findOneAndUpdate({_id:id},{$set:{"pageNumber": pageNumber}}).exec(function(err, data){
            if(err) console.log(err);            
            console.log('update thanh cong');            
            });
        }
    });
    
    res.json({
        status : true
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

      category.findByIdAndUpdate(id ,{$set:{"imageUrl": ""}}).exec(function(err, data){
        if(err) console.log(err);  
            console.log('Xóa thành công');        
            res.json({ status:true, img: data.categoryName});
        }); 

});
// function populateParents(node) {
//     return category.populate(node, { path: "parent" }).then(function(node) {
//       return node.parent ? populateParents(node.parent) : Promise.fulfill(node);
//     });
// }

// const recursivelyPopulatePath = (entry, path) => {
//     if (entry[path]) {
//         return category.findById(entry[path])
//             .then((foundPath) => {
//                 return recursivelyPopulatePath(foundPath, path)
//                     .then((populatedFoundPath) => {
//                         entry[path] = populatedFoundPath;
//                         return Promise.resolve(entry);
//                     });
//             });
//     }
//     return Promise.resolve(entry);
// };

// router.get('/get/:id', async(req, res, next) =>{
//    // const id = req.params.id;

//     // category.findOne({ "_id": req.params.id }, function(err, node) {
//     //     if(err) console.log(err);
        
//     //     populateParents(node).then(function(err, data){
//     //       if(err) console.log(err);
//     //       res.json(data);
          
//     //         // Do something with node
//     //     });
//     //   });

//     category.findById(id).exec(function( err, data){
//         if(err) return next(err);
//         recursivelyPopulatePath(data, 'parent')
//         .then((populatedNode) => {
//             res.json(populatedNode);
//         });
//     });    

// });

module.exports = router;



