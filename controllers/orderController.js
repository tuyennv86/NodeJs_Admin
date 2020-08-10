const orderModel = require('../models/Order');

class orderController {
    static async index(req, res, next) {
        try {
            const page = req.params.page || 1;
            const perPage = 10;
            const searchQuery = req.query.search || '';
            const regex = new RegExp(req.query.search, 'gi');
            const status = req.query.status || 0;
            const list = await orderModel.find({ fullName: regex }, { orderStatus: { $elemMatch: { status: status } } }).populate('products').sort({ order: 'asc', editDate: 'desc' }).skip((perPage * page) - perPage).limit(perPage);
            const count = await orderModel.countDocuments({ Name: regex });
            return res.render('Admin/order/index', {
                title: 'Giỏ hàng',
                data: list,
                current: page,
                searchVal: searchQuery,
                status: status,
                pages: Math.ceil(count / perPage),
                linkUrl: 'admin/order/index'
            });

        } catch (error) {
            throw Error(error);
        }
    }
    static async search(req, res, next) {
        const textsearch = req.body.textsearch || '';
        const status = req.body.status;
        return res.redirect('/admin/order/index?search=' + textsearch +"&status="+status);
    }
    // static async updateStatus(req, res, next) {
    //     const status = req.body.status;


    // }
}
module.exports = orderController