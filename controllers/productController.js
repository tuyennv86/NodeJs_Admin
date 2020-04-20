const fs = require('fs');
const async = require('async');
const uuidv4 = require('uuid/v4');
const categoryModel = require('../models/Category');
const productModel = require('../models/Product');
const listtotree = require('../utils/listTree');
const mongoose = require('mongoose');

module.exports = {

    index : async (req, res, next) => {  

        const page = req.params.page || 1;
        const perPage = 10;
        const searchQuery = req.query.search || '';
        const regex = new RegExp(req.query.search, 'gi');       
        
        try {
            
            const list = await productModel.find({productName:regex}).populate('category').sort({createDate : 'descending'}).skip((perPage * page) - perPage).limit(perPage);
            const count = await productModel.countDocuments({productName:regex});
            
            res.render('Admin/products/index',{
                title: 'Danh sách các sản phẩm',
                data: list,
                current: page,
                searchVal: searchQuery,  
                pages: Math.ceil(count/perPage),
                linkUrl: 'admin/product/index'
            });

        } catch (error) {
            throw new Error(error);
        }
    },
};

