const fs = require('fs');
const async = require('async');
const { v4: uuidv4 } = require('uuid');
const categoryModel = require('../models/Category');
const productModel = require('../models/Product');
const listtotree = require('../utils/listTree');
const lodash = require('lodash');
var Promise = require('bluebird');
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
            const listcate = await categoryModel.find({ typeCategory: 1 });
            if (cateId === '1') {

                const list = await productModel.find({ productName: regex }).populate('category').sort({ order: 'asc', createDate: 'desc' }).skip((perPage * page) - perPage).limit(perPage);
                const count = await productModel.countDocuments({ productName: regex });
                res.render('Admin/products/index', {
                    title: 'Danh sách các sản phẩm',
                    data: list,
                    listcate: listtotree.list_to_tree(listcate),
                    current: page,
                    id_check: cateId,
                    searchVal: searchQuery,
                    pages: Math.ceil(count / perPage),
                    linkUrl: 'admin/product/index'
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


                const list = await productModel.find({ productName: regex, category: { $in: mang } }).populate('category').sort({ order: 'asc', createDate: 'desc' }).skip((perPage * page) - perPage).limit(perPage);
                const count = await productModel.countDocuments({ productName: regex, category: { $in: mang } });

                res.render('Admin/products/index', {
                    title: 'Danh sách các sản phẩm',
                    data: list,
                    listcate: listtotree.list_to_tree(listcate),
                    current: page,
                    id_check: cateId,
                    searchVal: searchQuery,
                    pages: Math.ceil(count / perPage),
                    linkUrl: 'admin/product/index'
                });
            }

        } catch (error) {
            throw new Error(error);
        }
    },
    search: (req, res, next) => {
        const cateId = req.body.slcate;
        const textsearch = req.body.textsearch;
        res.redirect('/admin/product/index?search=' + textsearch + '&cateid=' + cateId);
    },
    add: async (req, res, next) => {
        async.parallel({
            categorys: function (callback) {
                categoryModel.find({ typeCategory: 1 }).exec(callback);
            },
        }, function (err, results) {
            if (err) { return next(err); }

            res.render('Admin/products/add', { title: 'Thêm mới sản phẩm', catedata: listtotree.list_to_tree(results.categorys) });
        });
    },
    addPost: async (req, res, next) => {

        const product = new productModel({
            productName: req.body.productName,
            productKey: req.body.productKey,
            category: req.body.slCategory,
            metaTile: req.body.metaTile,
            metaKeyword: req.body.metaKeyword,
            metaDescription: req.body.metaDescription,
            quantum: req.body.quantum,
            viewCounts: 0,
            order: req.body.order,
            price: req.body.price,
            priceOld: req.body.priceOld,
            imageUrl: '',
            active: req.body.chkActive ? true : false,
            home: req.body.chkHome ? true : false,
            imageRelated: [],
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
        product.imageUrl = stringImg;

        let dataRelated = [];
        if (!req.files || Object.keys(req.files).length === 0) {

        } else {
            if (req.files.fileimageRelated !== undefined) {
                if (req.files.fileimageRelated.length !== undefined) {
                    lodash.forEach(lodash.keysIn(req.files.fileimageRelated), (key) => {
                        let photo = req.files.fileimageRelated[key];
                        let strphoto = '';

                        if (fs.existsSync(filePath.imagePath + photo.name)) {
                            strphoto = uuidv4() + photo.name;
                        } else {
                            strphoto = photo.name;
                        }
                        //move photo to uploads directory
                        photo.mv(filePath.imagePath + strphoto);
                        dataRelated.push(strphoto);
                    });
                } else {
                    let photo = req.files.fileimageRelated;
                    let strphoto = '';

                    if (fs.existsSync(filePath.imagePath + photo.name)) {
                        strphoto = uuidv4() + photo.name;
                    } else {
                        strphoto = photo.name;
                    }
                    //move photo to uploads directory
                    photo.mv(filePath.imagePath + strphoto);
                    dataRelated.push(strphoto);
                }
            }
        }
        product.imageRelated = dataRelated;

        await product.save(function (err, data) {
            if (err) return next(err);
            req.flash('success_msg', 'Bạn đã thêm mới thành công sản phẩm: ' + data.productName);
            res.redirect('/admin/product/add');
        });

    },
    edit: async (req, res, next) => {
        const id = req.params.id;
        const url = req.query.url;
        async.parallel({
            category: function (callback) {
                categoryModel.find({ typeCategory: 1 }).exec(callback);
            },
            product: function (callback) {
                productModel.findById(id).exec(callback);
            },
        }, function (err, results) {
            if (err) { return next(err); }

            if (results.product != null) {
                res.render('Admin/products/edit', { title: 'Sửa sản phẩm ', list: results.product, listCate: listtotree.list_to_tree(results.category), url: url });
            }
        });
    },
    editPost: async (req, res, next) => {

        const url = req.body.url;
        const stringImgimageRelated = req.body.hidimageRelated;


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


        let dataRelated = [];
        let dataIMGRelated = [];
        let arrayImg = [];
        if (stringImgimageRelated.length > 0) {
            dataRelated = stringImgimageRelated.split(',');
        }

        if (!req.files || Object.keys(req.files).length === 0) {

        } else {

            if (req.files.fileimageRelated !== undefined) {

                if (req.files.fileimageRelated.length !== undefined) {
                    lodash.forEach(lodash.keysIn(req.files.fileimageRelated), (key) => {
                        let photoRelated = req.files.fileimageRelated[key];
                        let strphoto = '';
                        if (fs.existsSync(filePath.imagePath + photoRelated.name)) {
                            strphoto = uuidv4() + photoRelated.name;
                        } else {
                            strphoto = photoRelated.name;
                        }
                        //move photo to uploads directory
                        photoRelated.mv(filePath.imagePath + strphoto);
                        dataIMGRelated.push(strphoto);
                    });
                } else {

                    let photoRelated = req.files.fileimageRelated;
                    let strphoto = '';
                    if (fs.existsSync(filePath.imagePath + photoRelated.name)) {
                        strphoto = uuidv4() + photoRelated.name;
                    } else {
                        strphoto = photoRelated.name;
                    }
                    //move photo to uploads directory
                    photoRelated.mv(filePath.imagePath + strphoto);
                    dataIMGRelated.push(strphoto);
                }
            }
        }


        arrayImg = lodash.union(dataRelated, dataIMGRelated);

        productModel.findById(req.params.id, function (err, data) {
            if (err) return handleError(err);

                data.productName = req.body.productName,
                data.productKey = req.body.productKey,
                data.category = req.body.slCategory,
                data.metaTile = req.body.metaTile,
                data.metaKeyword = req.body.metaKeyword,
                data.metaDescription = req.body.metaDescription,
                data.quantum = req.body.quantum,
                data.order = req.body.order,
                data.price = req.body.price,
                data.priceOld = req.body.priceOld,
                data.imageUrl = stringImg,
                data.active = req.body.chkActive ? true : false,
                data.home = req.body.chkHome ? true : false,
                data.imageRelated = arrayImg,
                data.preview = req.body.preview,
                data.detail = req.body.detail,
                data.editDate = Date.now(),
                data.editBy = req.user.name
                data.save(function (err) {
                if (err) {
                    req.flash('error_msg', 'Lỗi : ' + err.message);
                    return res.redirect('/' + url);
                }
                req.flash('success_msg', 'Bạn đã cập nhật thành công sản phẩm : ' + data.productName);
                res.redirect('/' + url);
            });

        });

    },
    delete: async (req, res, next) => {
        const id = req.params.id;
        const url = req.query.url;
        productModel.findByIdAndDelete(id).exec(function (err, data) {
            if (err) return next(err);
            if (data.imageUrl !== '') {
                try {
                    fs.unlinkSync(filePath.imagePath + data.imageUrl, function (err) {
                        if (err) console.log(err);
                        console.log('File deleted!');
                    });
                } catch (error) {
                    console.log(error);
                }
            }
            data.imageRelated.forEach(item => {
                try {
                    fs.unlinkSync(filePath.imagePath + item, function (err) {
                        if (err) console.log(err);
                        console.log('File deleted!');
                    });
                } catch (error) {
                    console.log(error);
                }
            });
            req.flash('success_msg', 'Bạn đã sản phẩm : "' + data.productName + '" thành công!');
            res.redirect('/' + url);
        });
    },
    postIndex: (req, res, next) => {
        const page = req.params.page || 1;
        const checkItem = req.body.checkItem;
        checkItem.forEach(item => {
            productModel.findByIdAndDelete(item).exec(function (err, data) {
                if (err) return next(err);
                if (data.imageUrl != '') {
                    try {
                        fs.unlink(filePath.imagePath + data.ImageUrl, function (err) {
                            if (err) console.log(err);
                        });
                        data.imageRelated.forEach(item => {
                            fs.unlink(filePath.imagePath + item, function (err) {
                                if (err) console.log(err);
                            });
                        });
                    } catch (error) {
                        return next(error);
                    }
                }
            });
        })
        req.flash('success_msg', 'Bạn đã xóa các danh mục vừa chọn thành công!');
        res.redirect('/admin/product/index/' + page);
    },
};

