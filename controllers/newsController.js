const fs = require('fs');
const async = require('async');
const { v4: uuidv4 } = require('uuid');
const categoryModel = require('../models/Category');
const newsModel = require('../models/News');
const listtotree = require('../utils/listTree');
const filePath = require('../configs/fileConstants');
const getChid = require('../utils/getChild');

module.exports = {

    index: async (req, res, next) => {

        const page = req.params.page || 1;
        const perPage = 10;
        const cateId = req.query.cateid || '1';
        const searchQuery = req.query.search || '';
        const regex = new RegExp(req.query.search, 'gi');
        try {
            const listcate = await categoryModel.find({ typeCategory: 3 });
            if (cateId === '1') {

                const list = await newsModel.find({ Name: regex }).populate('category').sort({ order: 'asc', createDate: 'desc' }).skip((perPage * page) - perPage).limit(perPage);
                const count = await newsModel.countDocuments({ Name: regex });
                res.render('Admin/news/index', {
                    title: 'Danh sách các tin bài',
                    data: list,
                    listcate: listtotree.list_to_tree(listcate),
                    current: page,
                    id_check: cateId,
                    searchVal: searchQuery,
                    pages: Math.ceil(count / perPage),
                    linkUrl: 'admin/news/index'
                });

            } else {

                let arr = [];
                arr.push(cateId)
                let results = await getChid.getUnderUsersByRm(arr);
                let mang = [];
                results.forEach(item => {
                    mang.push(item._id.toString());
                })
                mang = [...mang, cateId];


                const list = await newsModel.find({ Name: regex, category: { $in: mang } }).populate('category').sort({ order: 'asc', createDate: 'desc' }).skip((perPage * page) - perPage).limit(perPage);
                const count = await newsModel.countDocuments({ Name: regex, category: { $in: mang } });

                res.render('Admin/news/index', {
                    title: 'Danh sách các tin bài',
                    data: list,
                    listcate: listtotree.list_to_tree(listcate),
                    current: page,
                    id_check: cateId,
                    searchVal: searchQuery,
                    pages: Math.ceil(count / perPage),
                    linkUrl: 'admin/news/index'
                });
            }

        } catch (error) {
            throw new Error(error);
        }
    },
    search: (req, res, next) => {
        const cateId = req.body.slcate;
        const textsearch = req.body.textsearch;
        res.redirect('/admin/news/index?search=' + textsearch + '&cateid=' + cateId);
    },
    add: async (req, res, next) => {
        async.parallel({
            categorys: function (callback) {
                categoryModel.find({ typeCategory: 3 }).exec(callback);
            },
        }, function (err, results) {
            if (err) { return next(err); }

            res.render('Admin/news/add', { title: 'Thêm mới tin bài', catedata: listtotree.list_to_tree(results.categorys) });
        });
    },
    addPost: async (req, res, next) => {

        const news = new newsModel({
            Name: req.body.Name,
            newsKey: req.body.newsKey,
            category: req.body.slCategory,
            metaTile: req.body.metaTile,
            metaKeyword: req.body.metaKeyword,
            metaDescription: req.body.metaDescription,
            viewCounts: 0,
            order: req.body.order,
            imageUrl: '',
            active: req.body.chkActive ? true : false,
            type: req.body.slOption,
            preview: req.body.preview,
            detail: req.body.detail,
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
        news.imageUrl = stringImg;

        await news.save(function (err, data) {
            if (err) return next(err);
            req.flash('success_msg', 'Bạn đã thêm mới thành công tin bài: ' + data.Name);
            res.redirect('/admin/news/add');
        });

    },
    edit: async (req, res, next) => {
        const id = req.params.id;
        const url = req.query.url;
        async.parallel({
            category: function (callback) {
                categoryModel.find({ typeCategory: 1 }).exec(callback);
            },
            news: function (callback) {
                newsModel.findById(id).exec(callback);
            },
        }, function (err, results) {
            if (err) { return next(err); }

            if (results.news != null) {
                res.render('Admin/news/edit', { title: 'Sửa tin bài ', list: results.news, listCate: listtotree.list_to_tree(results.category), url: url });
            }
        });
    },
    editPost: async (req, res, next) => {

        const url = req.body.url;
        let stringImg = req.body.hidImg;

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

        newsModel.findById(req.params.id, function (err, data) {
            if (err) return handleError(err);

                data.Name = req.body.Name,
                data.newsKey = req.body.newsKey,
                data.category = req.body.slCategory,
                data.metaTile = req.body.metaTile,
                data.metaKeyword = req.body.metaKeyword,
                data.metaDescription = req.body.metaDescription,
                data.order = req.body.order,
                data.imageUrl = stringImg,
                data.active = req.body.chkActive ? true : false,
                data.type = req.body.slOption,
                data.preview = req.body.preview,
                data.detail = req.body.detail,
                data.editDate = Date.now(),
                data.editBy = req.user.name

                data.save(function (err) {
                    if (err) {
                        req.flash('error_msg', 'Lỗi : ' + err.message);
                        return res.redirect('/' + url);
                    }
                    req.flash('success_msg', 'Bạn đã cập nhật thành công tin bài : ' + data.Name);
                    res.redirect('/' + url);
                });

        });

    }

};

