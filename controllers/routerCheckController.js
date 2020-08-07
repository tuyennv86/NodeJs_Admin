const routerCheckModel = require('../models/RouterCheck');
const userModel = require('../models/User');

class routercheckController {
    static async index(req, res, next) {
        try {
            const searchQuery = req.query.search || '';
            const regex = new RegExp(req.query.search, 'gi');
            const list = await routerCheckModel.find({ NameUrl: regex }).populate('userId');
            return res.render('Admin/CheckAccess/index', {
                title: 'Danh sách user bị cám quyền',
                data: list,
                searchVal: searchQuery
            });
        } catch (error) {
            throw new Error(error);
        }
    }
    static async search(req, res, next) {
        const textsearch = req.body.textsearch || '';
        return res.redirect('/admin/checkaccess/index?search=' + textsearch);
    }
    static async add(req, res, next) {
        return res.render('Admin/checkaccess/add', { title: 'Thêm mới link' });
    }
    static async addPost(req, res, next) {

        try {
            let urlLink = [];
            if(typeof req.body.Url === 'string'){
                urlLink = [req.body.Url.toLowerCase()];
            }else{
                urlLink = req.body.Url.map(v => v.toLowerCase());
            }
            const objcheck = new routerCheckModel({
                Url: urlLink,
                NameUrl: req.body.NameUrl
            });
            await objcheck.save();            
            req.flash('success_msg', 'Bạn đã thêm mới Link : ' + req.body.NameUrl);
            return res.redirect('/admin/checkaccess/add');
        } catch (error) {
            throw new Error(error);
        }
    }
    static async edit(req, res, next) {
        try {
            const data = await routerCheckModel.findById(req.params.id);           
            const listUser = await userModel.find({ _id: { $nin: data.userId } });
            return res.render('Admin/CheckAccess/edit', { title: 'Thêm user bị cấm', data: data, list: listUser });
        } catch (error) {
            throw new Error(error);
        }
    }
    static async editPost(req, res, next) {
        try {
            const data = await routerCheckModel.findById(req.body.id);
            let arraylist = [];
            if(typeof req.body.slUser === 'string'){
                arraylist = [req.body.slUser];
            }else{
                arraylist = [...req.body.slUser];
            }
            data.userId = [...data.userId, ...arraylist];            
            await data.save();
            req.flash('success_msg', 'Bạn đã cập nhật thành công : ' + data.NameUrl);
            return res.redirect('/admin/checkaccess/index');

        } catch (error) {
            throw new Error(error);
        }
    }
    static async delete(req, res, next) {
        try {
            const listid = req.params.id;
            const id = listid.substring(listid.lastIndexOf('-') + 1, listid.length);
            const data = await routerCheckModel.findById(id);
            const uid = listid.substring(0, listid.lastIndexOf('-'));
          
            const index = data.userId.indexOf(uid);
            if (index > -1) {
                data.userId.splice(index, 1);
            }            
            await data.save();       
            res.json({ status: true, message: "Cập nhật thành công" });
        } catch (error) {
            throw new Error(error);
        }
    }
}
module.exports = routercheckController