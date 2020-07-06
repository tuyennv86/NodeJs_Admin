const menuModel = require('../models/Menu');
const categoryModel = require('../models/Category');
const categoryTypeModel = require('../models/CategoryType');
const async = require('async');
const listtotreemenu = require('../utils/listTreeMenu');
// const listtotree = require('../utils/listTree');
const mongoose = require('mongoose');

module.exports = {
    index: (req, res, next) => {
        const searchQuery = req.query.search || '';
        const regex = new RegExp(req.query.search, 'gi');
        menuModel.find({ 'Name': regex }).populate('category').sort({ order: 'asc', createDate: 'desc' }).exec(function (err, list) {
            if (err) { return next(err); }          
            res.render('Admin/menus/index', {
                title: 'Danh sach menu',
                data: listtotreemenu.list_to_treemenu(list),
                searchVal: searchQuery,
                linkUrl: 'admin/menu/index'
            });
        });
    },
    search : (req, res, next) =>{
        const textsearch = req.body.textsearch || '';
        res.redirect('/admin/menu/index?search=' + textsearch);      
    },
    add: (req, res, next) => {        
        async.parallel({
            listType: function (callback) {
                categoryTypeModel.find({}).exec(callback);
            },
            listmenu: function (callback) {
                menuModel.find({}).exec(callback)
            }
        }, function (err, results) {
            if (err) { return next(err); }
            res.render('Admin/menus/add', {
                title: 'Thêm mới menu', 
                listType: results.listType,
                listmenu: listtotreemenu.list_to_treemenu(results.listmenu)
            });
        });
    },
    addPost: (req, res, next) => {
        const categoryId = req.body.slCategory;       
        categoryModel.findById(categoryId).exec(function(err, cate){
            if(err) return next(err);
            const objMenu = new menuModel({
                Name: req.body.name,
                categoryKey: req.body.chkOutLink ? '' : cate.categoryKey,
                linkUrl: req.body.chkOutLink ? req.body.linkUrl : '',
                outLink:req.body.chkOutLink ? true : false,
                parent: req.body.parent != '' ? req.body.parent : new mongoose.Types.ObjectId,     
                category: req.body.chkOutLink ? new mongoose.Types.ObjectId : cate._id, 
                categoryType: req.body.categoryType,
                order: req.body.order,  
                active: req.body.chkActive ? true : false,
                position : req.body.slOption,
                createDate: Date.now(),
                editDate: Date.now(),
                createBy: req.user.name,
                editBy: req.user.name  
            });
            objMenu.save(function (err, menu) {
                if (err) return next(err);
                req.flash('success_msg', 'Bạn đã thêm mới menu: ' + menu.Name);
                res.redirect('/admin/menu/add');
            });        
        })       
    },
    edit:(req, res, next)=>{
        const id = req.params.id;
        async.parallel({
            listType: function (callback) {
                categoryTypeModel.find({}).exec(callback);
            },
            listmenu: function (callback) {
                menuModel.find({}).exec(callback);
            },
            data: function(callback){
                menuModel.findById(id).exec(callback);
            }
        }, function (err, results) {
            if (err) { return next(err); }
            res.render('Admin/menus/edit', {
                title: 'Chỉnh sửa menu',
                listType: results.listType,
                data: results.data,
                listmenu: listtotreemenu.list_to_treemenu(results.listmenu)
            });
        });
    },
    editPost: (req, res, next) =>{
        const categoryId = req.body.slCategory;
        const id = req.params.id || '';
        categoryModel.findById(categoryId).exec(function(err, cate){
            if(err) return next(err);
            const objMenu = new menuModel({
                _id:id,
                Name: req.body.name,
                categoryKey: req.body.chkOutLink ? '' : cate.categoryKey,
                linkUrl: req.body.chkOutLink ? req.body.linkUrl : '',
                outLink:req.body.chkOutLink ? true : false,
                parent: req.body.parent != '' ? req.body.parent : new mongoose.Types.ObjectId,     
                category: req.body.chkOutLink ? new mongoose.Types.ObjectId : cate._id,  
                categoryType: req.body.categoryType,
                order: req.body.order,  
                active: req.body.chkActive ? true : false,
                position : req.body.slOption,
                createDate: Date.now(),
                editDate: Date.now(),
                createBy: req.user.name,
                editBy: req.user.name  
            });
            menuModel.findByIdAndUpdate(id, objMenu, {}, function (err, menu) {
                if (err) { return next(err); }
                req.flash('success_msg', 'Bạn đã cập nhật thành công menu : ' + menu.Name);
                res.redirect('/Admin/menu/index');
            });        
        }); 
       
    }
}