const logoModel = require('../models/Logo');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const filePath = require('../configs/fileConstants');

module.exports = {
    index: async (req, res, next) => {
        const page = req.params.page || 1;
        const perPage = 10;
        const searchQuery = req.query.search || '';
        const regex = new RegExp(req.query.search, 'gi');
        try {
            const list = await logoModel.find({ Name: regex }).sort({ order: 'asc', editDate: 'desc' }).skip((perPage * page) - perPage).limit(perPage);
            const count = await logoModel.countDocuments({ Name: regex });
            res.render('Admin/logo/index', {
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
    },
    search: (req, res, next) => {
        const textsearch = req.body.textsearch || '';
        res.redirect('/admin/logo/index?search=' + textsearch);
    },
    add: (req, res, next) => {
        res.render('Admin/logo/add', { title: 'Thêm mới logo hoặc banner' });
    },
    addPost: (req, res, next) => {

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

        objLogo.save(function (err, data) {
            if (err) return next(err);
            req.flash('success_msg', 'Bạn đã thêm mới logo : ' + data.Name);
            res.redirect('/admin/logo/add');
        });

    },
    edit: (req, res, next) => {
        const url = req.query.url;
        const id = req.params.id;
        logoModel.findById(id).exec(function (err, data) {
            if (err) return next(err);
            res.render('Admin/logo/edit', { title: 'Chỉnh sửa menu', data: data, url: url });
        });
    },
    editPost: (req, res, next) => {
        const url = req.body.url;
        const id = req.body.id;
        const objLogo = new logoModel({
            _id: id,
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

        logoModel.findByIdAndUpdate(id, objLogo, {}, function (err, data) {
            if (err) {
                req.flash('error_msg', 'Lỗi : ' + err.message);
                return res.redirect('/' + url);
            }
            req.flash('success_msg', 'Bạn đã cập nhật thành công : ' + data.Name);
            res.redirect('/' + url);
        });
    }
}