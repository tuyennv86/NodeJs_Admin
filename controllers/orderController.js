const orderModel = require('../models/Order');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const filePath = require('../configs/fileConstants');

class orderController {
    static async index(req, res, next) {
        try {
            const page = req.params.page || 1;
            const perPage = 10;
            const searchQuery = req.query.search || '';
            const regex = new RegExp(req.query.search, 'gi');            
            const list = await orderModel.find({ fullName: regex, "orderStatus.status":1}).sort({ order: 'asc', editDate: 'desc' }).skip((perPage * page) - perPage).limit(perPage);
            const count = await orderModel.countDocuments({ Name: regex });
            return res.render('Admin/order/index', {
                title: 'Giỏ hàng',
                data: list,
                current: page,
                searchVal: searchQuery,
                pages: Math.ceil(count / perPage),
                linkUrl: 'admin/logo/index'
            });

        } catch (error) {
            throw Error(error);
        }
    }
    static async updateStatus(req, res, next){
        const status = req.body.status;
        
    }
}