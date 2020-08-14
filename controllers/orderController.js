const orderModel = require('../models/Order');
const productModel = require('../models/Product');
const lodash = require('lodash');

class orderController {
    static async index(req, res, next) {
        try {
            const page = req.params.page || 1;
            const perPage = 10;
            const searchQuery = req.query.search || '';
            const regex = new RegExp(req.query.search, 'gi');
            const status = req.query.status || 0;
            if (status == 0) {
                const list = await orderModel.find({ fullName: regex }).populate('products.product').sort({ order: 'asc', editDate: 'desc' }).skip((perPage * page) - perPage).limit(perPage);
                const count = await orderModel.countDocuments({ fullName: regex });
                return res.render('Admin/order/index', {
                    title: 'Giỏ hàng',
                    data: list,
                    current: page,
                    searchVal: searchQuery,
                    status: status,
                    pages: Math.ceil(count / perPage),
                    linkUrl: 'admin/order/index'
                });
            } else {
                // const list = await orderModel.find({ fullName: regex, 'orderStatus.status': status }).populate('products.product').sort({ order: 'asc', editDate: 'desc' }).skip((perPage * page) - perPage).limit(perPage);
                // const count = await orderModel.countDocuments({ fullName: regex, 'orderStatus.status': status });          
                const list = await orderModel.find({ fullName: regex, status: status }).populate('products.product').sort({ order: 'asc', editDate: 'desc' }).skip((perPage * page) - perPage).limit(perPage);
                const count = await orderModel.countDocuments({ fullName: regex, status: status });
                return res.render('Admin/order/index', {
                    title: 'Giỏ hàng',
                    data: list,
                    current: page,
                    searchVal: searchQuery,
                    status: status,
                    pages: Math.ceil(count / perPage),
                    linkUrl: 'admin/order/index'
                });
            }


        } catch (error) {
            throw Error(error);
        }
    }
    static async search(req, res, next) {
        const textsearch = req.body.textsearch || '';
        const status = req.body.status;
        return res.redirect('/admin/order/index?search=' + textsearch + "&status=" + status);
    }
    static async add(req, res, next) {
        try {
            const productlist = await productModel.find({});
            return res.render('Admin/order/add', { title: 'Thêm hàng', list: productlist })

        } catch (error) {
            throw Error(error);
        }
    }
    static async addPost(req, res, next) {
        try {
            let arrpro = [];
            if (typeof req.body.slproduct === 'string') {
                arrpro = [req.body.slproduct];
            } else {
                arrpro = [...req.body.slproduct];
            }
            let araay = [];
            arrpro.forEach(item => {
                const objpro = {
                    product: item,
                    qunantity: req.body.quantum
                }
                araay.push(objpro);
            })
            //console.log(araay);
            //orderStatus: [{ status: Number, statusName: String, createDate: Date, userName: String }],
            let statusarr = [];
            const arstatus = {
                status: 1,
                statusName: 'Chờ xác nhận',
                createDate: Date.now(),
                userName: req.user.name
            }
            statusarr.push(arstatus);

            const obj = new orderModel({
                fullName: req.body.fullName,
                address: req.body.address,
                email: req.body.email,
                phone: req.body.phone,
                total: req.body.total,
                products: araay,
                orderStatus: statusarr,
                status: 1,
                createDate: Date.now(),
                editDate: Date.now(),
                createBy: req.user.name,
                editBy: req.user.name
            });

            await obj.save();
            req.flash('success_msg', 'Bạn đã thêm mới : ');
            return res.redirect('/admin/order/add');

        } catch (error) {
            throw Error(error);
        }
    }
    static async updateStatus(req, res, next) {
        try {
            const list = req.params.list;
            const id = list.split("-")[0];
            const status = list.split("-")[1];
            let statusName = "";
            if (status == 1) {
                statusName = "Chờ xác nhận";
            }
            if (status == 2) {
                statusName = "Đang giao hàng";
            }
            if (status == 3) {
                statusName = "Đã nhận hàng";
            }
            if (status == 4) {
                statusName = "Hủy đơn hàng";
            }
            const odder = await orderModel.findById(id);
            const arstatus = {
                status: status,
                statusName: statusName,
                createDate: Date.now(),
                userName: req.user.name
            }

            odder.status = status;
            odder.orderStatus.push(arstatus);

            await odder.save();
            return res.json({ status: true, message: "Đã cập nhật thành công" })

        } catch (error) {
            //throw Error(error);
            return res.json({ status: false, message: error });
        }
    }
    static async deleteMultil(req, res, next) {
        try {
            const listId = req.params.listId;
            const list = lodash.trimEnd(listId, ',').split(',');
            await orderModel.deleteMany({ _id: { $in: list } });

            res.json({
                status: true,
                message: "Bạn đã xóa thành công!"
            });

        } catch (error) {
            return res.json({ status: false, message: error });
        }
    }
}
module.exports = orderController