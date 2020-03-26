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

// const recursivelyPopulatePath = (entry, path) => {
//     if (entry[path]) {
//         return category.find({parent: entry[path]})
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

// function populateParents(node) {
//     return category.populate(node, { path: "parent" }).then(function(node) {
//       return node.parent ? populateParents(node.parent) : Promise.fulfill(node);
//     });
//   }

router.get('/getchildren/:id', (req, res, next) =>{
    const id = req.params.id;
    category.findById(id).exec(function(err, catedata){
        if(err) return next(err);
        console.log(catedata);        
        if(catedata){
          res.json(populateParents(catedata));
        }
    });
});

module.exports = router;



