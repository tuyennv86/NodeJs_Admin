const fs = require('fs');
const async = require('async');
const { v4: uuidv4 } = require('uuid');
const categoryModel = require('../models/Category');
const productModel = require('../models/Product');
const listtotree = require('../utils/listTree');
const lodash = require('lodash');
const filePath = require('../configs/fileConstants');


module.exports = {

    index : async (req, res, next) => {  

        const page = req.params.page || 1;
        const perPage = 10;
        const searchQuery = req.query.search || '';
        const regex = new RegExp(req.query.search, 'gi');       
        
        try {
            
            const list = await productModel.find({productName:regex}).populate('category').sort({createDate : 'descending'}).skip((perPage * page) - perPage).limit(perPage);
            const count = await productModel.countDocuments({productName:regex});
                        
            res.render('Admin/products/index',{
                title: 'Danh sách các sản phẩm',
                data: list,
                current: page,
                searchVal: searchQuery,  
                pages: Math.ceil(count/perPage),
                linkUrl: 'admin/product/index'
            });

        } catch (error) {
            throw new Error(error);
        }
    },
    add: async (req, res, next) => {
        async.parallel({          
            categorys: function(callback) {
                categoryModel.find({typeCategory: 1}).exec(callback);
            },
        }, function(err, results) {
            if (err) { return next(err); }            
            
            res.render('Admin/products/add',{title: 'Thêm mới sản phẩm', catedata: listtotree.list_to_tree(results.categorys)});            
        });
    },
    addPost: async(req, res, next) =>{
        
        const product = new productModel ({           
            productName: req.body.productName,
            productKey: req.body.productKey,
            category: req.body.slCategory,
            metaTile: req.body.metaTile,
            metakeyword: req.body.metakeyword,
            metaDescription: req.body.metaDescription,
            quantum: req.body.quantum,
            viewCounts: 0,
            order: req.body.order,
            price: req.body.price,
            priceOld: req.body.priceOld,
            imageUrl: '',
            active: req.body.chkActive ? true: false,
            home: req.body.chkHome ? true: false,
            imageRelated: [],
            createDate:  Date.now(),
            editDate: Date.now(),
            createBy: req.user.name,
            editBy: req.user.name
        });
        
        let stringImg;
        if (!req.files || Object.keys(req.files).length === 0) {
            stringImg = "";            
        }else{     
            let sampleFile = req.files.fileImg;  
            if (fs.existsSync(filePath.imagePath + sampleFile.name)) {
                stringImg = uuidv4()+ sampleFile.name;              
            }else{  
                stringImg = sampleFile.name;    
            }
            sampleFile.mv(filePath.imagePath + stringImg, function(err) {
              if (err)
                return res.status(500).send(err);          
            });    
        }
        product.imageUrl = stringImg;

        let dataRelated = [];
        if (!req.files || Object.keys(req.files).length === 0) {
            dataRelated = []        ;
        }else{ 
            lodash.forEach(lodash.keysIn(req.files.fileimageRelated), (key) => {
                let photo = req.files.fileimageRelated[key];
                let strphoto = '';

                if (fs.existsSync(filePath.imagePath + photo.name)) {
                    strphoto = uuidv4() + photo.name;              
                }else{  
                    strphoto = photo.name;    
                }
                //move photo to uploads directory
                photo.mv(filePath.imagePath + strphoto);
                dataRelated.push(strphoto);                
            });
        }
        product.imageRelated = dataRelated;
        
        product.save(function(err, data){
            if(err) return next(err);
            req.flash('success_msg', 'Bạn đã thêm mới thành công sản phẩm: '+ data.productName);
            res.redirect('/admin/product/add');
        });

    },
    edit: async(req, res, next) =>{

    },
    editPost: async(req, res, next) =>{

    },
};

