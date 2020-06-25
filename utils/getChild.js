
const categoryModel = require('../models/Category');

module.exports.getUnderUsersByRm = function(currentUser) {
    function getUserByRmId(rmId) {
        // return promise here
        return categoryModel.find({ parent: { $in: rmId } }).exec().then(function(sonDocs) {       
            if (sonDocs.length > 0) {
                let promises = [];
                sonDocs.forEach(function(ele, i) {
                    promises.push(getUserByRmId(ele._id));
                });               
                return Promise.all(promises).then(results => {                  
                    results.unshift(sonDocs);
                    return [].concat.apply([], results.filter(item => item.length > 0));
                });
            } else {
                return [];
            }
        });
    }
    return getUserByRmId(currentUser);
}
//cach gọi
// const getChid = require('../utils/getChild');
//let arr = [];
// getChid.getUnderUsersByRm(arr).then(results => {
//     // process all results here
//     console.log(results); 
// }).catch(err => {
//     console.log(err);                    
// });