const express = require('express');
var lodash = require('lodash');
const router = express.Router();
const category = require('../models/Category');

router.get('/getparent/:typeId', async (req, res, next) =>{
     
    const typeId = req.params.typeId || "";    
    category.find({categoryType: typeId, parent: null}).exec(function(err, data){
        if(err) {
            next(err);
            res.json({ status : false});
        }
        console.log(data);        
        res.json({
            data:data,
            status:true
        }); 

    }); 
});

// const Promise = require('bluebird');

// const recursivelyPopulatePath = (entry, path) => {
//     if (entry[path]) {
//         return Node.findById(entry[path])
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

// async function getAllCategory(parentId, typeId, level){

//     let listCateogry = [];
//     let listChideld = [];     
//     if(level == 1){
//         listChideld = await category.find({level: level, categoryType: typeId});
//     }else
//     {
//         listChideld = await category.find({parent: parentId, level: level, categoryType: typeId});
//     }
   
//     if(listChideld.length > 0){
//         let seperator = "";
//         for (let i = 0; i < level; i++) { 
//          seperator += "--";
//         }

//         listChideld.forEach(item => {
//             item.categoryName = seperator + item.categoryName;
//             listCateogry = lodash.concat(listCateogry,item);
//             let tmplistCategory = this.getAllCategory(item._id, item.categoryType, item.level + 1);
//             tmplistCategory.forEach( item2 =>{
//                 listCateogry = listCateogry.concat(listCateogry, item2);
//             }); 
//             spaceCount ++;           
//         });
//     }
//     return listCateogry;

// }

router.get('/updateMultil/:str', async (req, res, next) =>{
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
module.exports = router;