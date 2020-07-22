const logoModel = require('../models/Logo');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const filePath = require('../configs/fileConstants');

class logoController {
    static async index(req, res, next) {
        try {
            const page = req.params.page || 1;
            const perPage = 10;
            const searchQuery = req.query.search || '';
            const regex = new RegExp(req.query.search, 'gi');
            const list = await logoModel.find({ Name: regex }).sort({ order: 'asc', editDate: 'desc' }).skip((perPage * page) - perPage).limit(perPage);
            const count = await logoModel.countDocuments({ Name: regex });
            return res.render('Admin/logo/index', {
                title: 'Danh sách các logo và banner',
                data: list,
                current: page,
                searchVal: searchQuery,
                pages: Math.ceil(count / perPage),
                linkUrl: 'admin/logo/index'
            });
        } catch (error) {
            throw new Error(error);
        }
    }
    static async search(req, res, next) {
        const textsearch = req.body.textsearch || '';
        return res.redirect('/admin/logo/index?search=' + textsearch);
    }
    static async add(req, res, next) {
        return res.render('Admin/logo/add', { title: 'Thêm mới logo hoặc banner' });
    }
    static async addPost(req, res, next) {

        try {
            const objLogo = new logoModel({
                Name: req.body.Name,
                order: req.body.order,
                imageUrl: '',
                linkUrl: req.body.linkUrl,
                active: req.body.chkActive ? true : false,
                Destination: req.body.Destination,
                type: req.body.type ? 1 : 2, // 1 logo 2 la banner
                createDate: Date.now(),
                editDate: Date.now(),
                createBy: req.user.name,
                editBy: req.user.name
            });
            let stringImg;
            if (!req.files || Object.keys(req.files).length === 0) {
                stringImg = "";
            } else {
                if (req.files.fileImg !== undefined) {
                    let sampleFile = req.files.fileImg;
                    if (fs.existsSync(filePath.imagePath + sampleFile.name)) {
                        stringImg = uuidv4() + sampleFile.name;
                    } else {
                        stringImg = sampleFile.name;
                    }
                    sampleFile.mv(filePath.imagePath + stringImg, function (err) {
                        if (err)
                            return res.status(500).send(err);
                    });
                }
            }
            objLogo.imageUrl = stringImg;
            await objLogo.save();

            req.flash('success_msg', 'Bạn đã thêm mới logo : ' + req.body.Name);
            return res.redirect('/admin/logo/add');
        } catch (error) {
            throw new Error(error);
        }
    }
    static async edit(req, res, next) {
        try {
            const data = await logoModel.findById(req.params.id);
            return res.render('Admin/logo/edit', { title: 'Chỉnh sửa menu', data: data, url: req.query.url });
        } catch (error) {
            throw new Error(error);
        }
    }
    static async editPost(req, res, next) {
        try {          
            const objLogo = new logoModel({
                _id: req.body.id,
                Name: req.body.Name,
                order: req.body.order,
                imageUrl: '',
                linkUrl: req.body.linkUrl,
                active: req.body.chkActive ? true : false,
                Destination: req.body.Destination,
                type: req.body.type ? 1 : 2, // 1 logo 2 la banner
                editDate: Date.now(),
                editBy: req.user.name
            });
            let stringImg = req.body.hidImg;
            if (!req.files || Object.keys(req.files).length === 0) {

            } else {
                let sampleFile = req.files.fileImg;
                if (sampleFile.name.length > 0) {
                    // xoa anh cu o server di
                    try {
                        fs.unlink(filePath.imagePath + req.body.hidImg, function (err) {
                            if (err) console.log(err);
                            console.log('File deleted!');
                        });
                    } catch (error) {
                        console.log(error);
                    }
                }
                if (fs.existsSync(filePath.imagePath + sampleFile.name)) {
                    stringImg = uuidv4() + sampleFile.name;
                } else {
                    stringImg = sampleFile.name;
                }
                sampleFile.mv(filePath.imagePath + stringImg, function (err) {
                    if (err)
                        return res.status(500).send(err);
                });
            }
            objLogo.imageUrl = stringImg;

            const data = await logoModel.findByIdAndUpdate(req.body.id, objLogo, {});
            req.flash('success_msg', 'Bạn đã cập nhật thành công : ' + data.Name);
            return res.redirect('/' + req.body.url);            

        } catch (error) {
            throw new Error(error);
        }
    }
}
module.exports = logoController