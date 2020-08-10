const mongoose = require('mongoose');
const moment = require('moment');
const Schema = mongoose.Schema;

const OrderSchema = new Schema({
    fullName: { type: String, required: true },    
    address: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    total: { type: Number },
    products: [{
        product: { type: Schema.ObjectId, ref: 'Product', required:true},
        qunantity: {type: Number, default:0}
    }],
    // orderItem: [{ ProductName: String, ProductCode: String, imageUrl: String, price: Number, priceOld: Number, qunantity: Number }],
    orderStatus: [{ status: Number, statusName: String, createDate: Date, userName: String }],
    createDate: { type: Date },
    editDate: { type: Date },
    createBy: { type: String },
    editBy: { type: String }
});
// OrderSchema.virtual('orderStatusString').get(function () {
//      switch (this.orderStatus){
//         case 1:{return "Chờ xác nhận"; break}
//         case 2:{return "Đã xác nhận"; break}
//         case 3:{return "Đang giao hàng"; break}
//         case 4:{return "Đã nhận hàng"; break}
//         case 5:{return "Hủy đơn hàng"; break}
//      }  
// });

OrderSchema.virtual('createDateIso').get(function () {
    return moment(this.createDate).format('MM/DD/YYYY, h:mm:ss a');
});

OrderSchema.virtual('editDateIso').get(function () {
    return moment(this.editDate).format('DD/MM/YYYY, h:mm:ss a');
});

OrderSchema.virtual('createDate_dd_mm_yyyy').get(function () {
    return moment(this.createDate).format('MM/DD/YYYY');
});

OrderSchema.virtual('editDate_dd_mm_yyyy').get(function () {
    return moment(this.editDate).format('DD/MM/YYYY');
});

module.exports = mongoose.model('order', OrderSchema);