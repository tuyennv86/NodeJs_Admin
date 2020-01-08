const fs = require('fs');
const async = require('async');
const categoryModel = require('../models/Category');
const categoryTypeModel = require('../models/CategoryType');

module.exports= {
    //Begin category type
    categoryType : (req, res, next) =>{
        const perPage = 10;
        const page = req.params.page || 1;
        categoryTypeModel.find({}).sort({date:'descending'}).skip((perPage * page) - perPage).limit(perPage).exec(function (err, list){
            if(err) return next(err);
            categoryTypeModel.count().exec(function(err, count){
                res.render('Admin/categorys/listCategoryType',{
                    title: 'Danh sách loại danh mục',
                    data: list,
                    current: page,
                    pages: Math.ceil(count/perPage),
                    linkUrl: 'admin/category/categorytype'
                });
            });
        });
    },
    addCategoryType : (res) =>{      
        res.render('Admin/categorys/addCategoryType',{title: 'Thêm mới loại danh mục'});
    },
    postAddCategoryType : (req, res, next) =>{
        const typeName = req.body.typeName;
        const typeInt = req.body.typeInt;   
        const createBy = req.user.email;
        let errors = [];

        categoryTypeModel.findOne({'typeInt': typeInt }).exec( function(err, found_ct) {
            if(err){ return next(err); }
            if(found_ct){
            errors.push({ msg: 'Kiểu dữ liệu ' + typeInt + ' đã được sử dụng bởi '+ found_ct.typeName });
            res.render('Admin/categorys/addCategoryType', {errors, typeInt, typeName, title: 'Thêm mới loại danh mục'});
            }else{
                var item = {
                    "typeName":typeName,
                    "typeInt":typeInt,
                    "createBy":createBy
                };
                let newCategoryType = new categoryTypeModel(item);
                newCategoryType.save(function(err, data){
                    if(err) next(err);
                    req.flash('success_msg', 'Bạn đã thêm kiểu dữ liệu : "' +data.typeName +'" thành công');
                    res.redirect('/admin/category/addcategorytype');
                });
            }
        });            
    },
    editCategoryType : (req, res, next) =>{
        const url = req.query.url;
        categoryTypeModel.findById(req.params.id).exec(function(err, categoryType){
            if(err) return next(err);
            res.render('Admin/categorys/EditCategoryType',{
                categoryType: categoryType, 
                url: url, 
                title: 'Sửa loại danh mục - '+categoryType.typeName});
        });
        
    },
    postEditCategoryType : (req, res, next) =>{
        const url = req.body.url;
        const typeName = req.body.typeName;
        categoryTypeModel.findByIdAndUpdate(req.params.id,{typeName: typeName}, function(err, categoryType){
            if(err) return next(err);
            req.flash('success_msg', 'Bạn cập nhật loại danh mục "'+ categoryType.typeName +'" thành công!');
            console.log(url);
            
            res.redirect('/'+url);
        });
    },
    deleteCategoryType: (req, res, next) =>{        
        const id = req.params.id;
        const url = req.query.url;
        // tim xem co Category nào không nếu không có thì cho xóa con không thì ko cho xóa 
        categoryModel.find({'categoryType':id}).exec(function(err, data){
            if(err) return next(err);
            if(data.length > 0){
                req.flash('error_msg','Hãy xóa hết danh mục trong loại danh mục này trước');
                res.redirect('/'+url);
            }else{
                categoryTypeModel.findByIdAndDelete(id).exec(function(err, categoryType){
                    if(err) return next(err);
                    req.flash('success_msg', 'Bạn đã xóa kiểu danh mục: "'+ categoryType.typeName +'" thành công!');
                    res.redirect('/'+url);
                });
            }
        });        
    },
    deleteMultiCategroryType: (req, res, next) =>{        
        const page = req.params.page || 1;
        const listId = req.body.checkItem;
        let success_mg = 0, error_mg = 0;
        listId.forEach(item => {
            categoryModel.find({'categoryType':item}).exec(function(err, data){
                if(err) return next(err);
                if(data.length > 0){
                    error_mg = error_mg +1;
                }else
                {
                    categoryTypeModel.findByIdAndDelete(item, function(err, data){
                        if(err) return next(err);  
                        success_mg = success_mg + 1;              
                    });
                }
            });
        });
        if(error_mg > 0)
        {
            req.flash('error_msg', error_mg+' bản ghi không xóa thành công vì tồn tại danh mục!');  
        }
        req.flash('success_msg', 'Bạn đã xóa '+ success_mg+'bản ghi thành công!');  
        res.redirect('/admin/category/categorytype/'+page);
    },
    // End categoryType 
    index : (req, res, next) =>{  
        const searchQuery = req.query.search || '';
        const regex = new RegExp(req.query.search, 'gi');
        const perPage = 5;
        const page = req.params.page || 1;
        categoryModel.find({'categoryName': regex, level : 1}).populate('categoryType').sort({order : 'asc', createDate : 'desc'}).skip((perPage * page) - perPage).limit(perPage)        
        .exec(function(err, listCate){        
            if(err){ return next(err); }
            categoryModel.countDocuments({'categoryName': regex}).exec(function(err, count){
                if(err) return next(err);
                res.render('Admin/categorys/index',{
                    title: 'Danh sách các danh mục',
                    data: listCate,
                    current: page,
                    searchVal: searchQuery,
                    pages: Math.ceil(count/perPage),
                    linkUrl: 'admin/category/index'
                });
            });
        }); 
    },
    postIndex: (req, res, next) => {
        const page = req.params.page || 1;
        const checkItem = req.body.checkItem;
        checkItem.forEach(item => {
            categoryModel.findByIdAndDelete(item).exec(function(err, data){
                if(err) return next(err);
                if(data.imageUrl != ''){
                    try {      
                    fs.unlink('./public/uploads/'+data.ImageUrl, function (err) {
                        if (err) console.log(err);
                    });  
                    } catch (error) {
                    return next(error);
                    }
                }
            });
        })
        req.flash('success_msg', 'Bạn đã xóa các danh mục vừa chọn thành công!');  
        res.redirect('/admin/category/Index/'+page);                
    },
    search:  (req, res, next) =>{
        const search  = req.body.textsearch;
        res.redirect('/admin/category/Index?search='+search);
    },
    indexType : (req, res, next) =>{  

        const typeId = req.params.typeId;
        const searchQuery = req.query.search || '';
        const regex = new RegExp(req.query.search, 'gi');
        const perPage = 10;
        const page = req.params.page || 1;
        categoryModel.find({categoryName: regex,'categoryType': typeId}).populate('categoryType')
        .sort({order : 'asc', createDate : 'desc'}).skip((perPage * page) - perPage).limit(perPage)
        .exec(function(err, listCate){        
            if(err) return next(err);
                categoryModel.countDocuments({categoryName: regex, 'categoryType': typeId}).exec(function(err, count){
                if(err) return next(err);  
                res.render('Admin/categorys/indexType',{
                    title: 'Danh sách các danh mục',
                    data: listCate,
                    current: page,
                    typeId: typeId,
                    searchVal: searchQuery,
                    pages: Math.ceil(count/perPage),                   
                    linkUrl: 'admin/category/indexType'
                });
            });
        }); 
    },
    searchType: (req, res, next)=> {
        const typeId = req.params.typeId;
        const search  = req.body.textsearch;
        res.redirect('/admin/category/TypeIndex/'+ typeId + '?search='+search);
    },
    addCategory: (req, res, next) =>{

        async.parallel({
            categorytype: function(callback) {    
                categoryTypeModel.find({}).exec(callback);
            },
            listcategory: function(callback) {    
              categoryModel.find({ }).exec(callback);
            },
        }, function(err, results) {
            if (err) { return next(err); } 
            res.render('Admin/categorys/addCategory', { title: 'Thêm mới danh mục', listType: results.categorytype, listCategory: results.listcategory } );
        });
    },
    postAddCcategory: (req, res, next) =>{
        const categoryName = req.body.categoryName;
        const categoryKey = req.body.categoryKey;      
        const categoryType = req.body.categoryType;
        const parent = req.body.parent;
        const order = req.body.order;
        let level = 1;
        let imageUrl = "";
        const active = req.body.chkActive ? true : false;
        const home = req.body.chkHome ? true : false;        
        
        if (!req.files || Object.keys(req.files).length === 0) {
            imageUrl = "";            
        }else{     
            let sampleFile = req.files.fileImg;  
            if (fs.existsSync('./public/uploads/pictures/'+sampleFile.name)) {
              imageUrl = "pictures/"+Date.now()+ sampleFile.name; 
            }else{  
              imageUrl = "pictures/"+sampleFile.name;    
            }
            sampleFile.mv('./public/uploads/'+imageUrl, function(err) {
              if (err)
                return res.status(500).send(err);          
            });    
        }        
        if(parent != ''){
            categoryTypeModel.findById(categoryType).exec(function(err, data){
                if(err) return next(err);
                categoryModel.findById(parent).exec(function(err, cateparent){
                    if(err) return next(err);

                    const category = new categoryModel({
                        categoryName: categoryName,
                        categoryKey: categoryKey,   
                        parent: parent,            
                        categoryType: categoryType,
                        typeCategory: data.typeInt,
                        order: order,
                        level: cateparent.level +1,
                        imageUrl: imageUrl,
                        active: active,
                        home: home,
                        createBy: req.user.name,
                        editBy: req.user.name
                    }); 

                    category.save(function(err){
                        if(err) return next(err);
                        req.flash('success_msg', 'Bạn đã thêm mới thành công');
                        res.redirect('/admin/category/add');
                    });

                });                 
            });     
        }else{
            categoryTypeModel.findById(categoryType).exec(function(err, data){
                if(err) { return next(err);}            
                const category = new categoryModel({
                    categoryName: categoryName,
                    categoryKey: categoryKey,
                    categoryType: categoryType,
                    typeCategory: data.typeInt,
                    order: order,
                    level: level,
                    imageUrl: imageUrl,
                    active: active,
                    home: home,
                    createBy: req.user.name,
                    editBy: req.user.name
                });            
               
                category.save(function(err){
                    if(err) return next(err);
                    req.flash('success_msg', 'Bạn đã thêm mới thành công');
                    res.redirect('/admin/category/add');
                }); 
            });     
        }
           
    }    
};
