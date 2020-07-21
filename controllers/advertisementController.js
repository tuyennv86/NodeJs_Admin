const fs = require('fs');
const async = require('async');
const { v4: uuidv4 } = require('uuid');
const categoryModel = require('../models/Category');
const advertisementModel = require('../models/Advertisement');
const listtotree = require('../utils/listTree');
const filePath = require('../configs/fileConstants');
// const getChid = require('../utils/getChild');

module.exports = {

    index: async (req, res, next) => {

        const page = req.params.page || 1;
        const perPage = 10;
        const searchQuery = req.query.search || '';
        const regex = new RegExp(req.query.search, 'gi');
        try {
            const list = await advertisementModel.find({ Name: regex }).populate('category').sort({ order: 'asc', createDate: 'desc' }).skip((perPage * page) - perPage).limit(perPage);
            const count = await advertisementModel.countDocuments({ Name: regex });
            res.render('Admin/advertisement/index', {
                title: 'Danh sách các tin bài',
                data: list,
                current: page,
                searchVal: searchQuery,
                pages: Math.ceil(count / perPage),
                linkUrl: 'admin/advertisement/index'
            });
        } catch (error) {
            throw new Error(error);
        }
    },
    search: (req, res, next) => {
        const textsearch = req.body.textsearch;
        res.redirect('/admin/advertisement/index?search=' + textsearch);
    },
    add: async (req, res, next) => {
        async.parallel({
            categorys: function (callback) {
                categoryModel.find({}).exec(callback);
            },
        }, function (err, results) {
            if (err) { return next(err); }

            res.render('Admin/advertisement/add', { title: 'Thêm mới ảnh quảng cáo', catedata: listtotree.list_to_tree(results.categorys) });
        });
    },
    addPost: async (req, res, next) => {

        const advertisement = new advertisementModel({
            Name: req.body.Name,
            category: req.body.slCategory,
            order: req.body.order,
            imageUrl: req.body.viewType ? req.body.linkImage : '',
            linkUrl: req.body.linkUrl,
            active: req.body.chkActive ? true : false,
            viewType: req.body.viewType ? true : false, // Link qua mang True hay local = false
            position: req.body.slOption,
            viewCounts: 0,
            Destination: req.body.destination,
            createDate: Date.now(),
            editDate: Date.now(),
            createBy: req.user.name,
            editBy: req.user.name
        });
        if (!req.body.viewType) {
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
            advertisement.imageUrl = stringImg;
        }
        await advertisement.save(function (err, data) {
            if (err) return next(err);
            req.flash('success_msg', 'Bạn đã thêm mới thành công ảnh quảng cáo: ' + data.Name);
            res.redirect('/admin/advertisement/add');
        });

    },
    edit: async (req, res, next) => {
        const id = req.params.id;
        const url = req.query.url;
        async.parallel({
            category: function (callback) {
                categoryModel.find({}).exec(callback);
            },
            advertisement: function (callback) {
                advertisementModel.findById(id).exec(callback);
            },
        }, function (err, results) {
            if (err) { return next(err); }
            //console.log(results.advertisement);
            if (results.advertisement != null) {
                res.render('Admin/advertisement/edit', { title: 'Sửa ảnh quảng cáo ', list: results.advertisement, listCate: listtotree.list_to_tree(results.category), url: url });
            }
        });
    },
    editPost: async (req, res, next) => {

        const url = req.body.url;
        let stringImg = req.body.hidImg;
        const linhAnh = req.body.linkImage;
        if (!req.body.viewType) {
            if (!req.files || Object.keys(req.files).length === 0) {

            } else {

                if (req.files.fileImg !== undefined) {
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
            }
        } else {
            if (linhAnh.length > 0) {
                stringImg = linhAnh;
            }
        }
        advertisementModel.findById(req.params.id, function (err, data) {
            if (err) return handleError(err);

            data.Name = req.body.Name,
                data.category = req.body.slCategory,
                data.order = req.body.order,
                data.imageUrl = stringImg,
                data.linkUrl = req.body.linkUrl,
                data.active = req.body.chkActive ? true : false,
                data.viewType = req.body.viewType ? true : false, // Link qua mang True hay local = false
                data.position = req.body.slOption,
                data.Destination = req.body.destination,
                data.editDate = Date.now(),
                data.editBy = req.user.name

            data.save(function (err) {
                if (err) {
                    req.flash('error_msg', 'Lỗi : ' + err.message);
                    return res.redirect('/' + url);
                }
                req.flash('success_msg', 'Bạn đã cập nhật thành công quảng cáo : ' + data.Name);
                res.redirect('/' + url);
            });

        });

    }

};

