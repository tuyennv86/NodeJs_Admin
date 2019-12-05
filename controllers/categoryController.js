const moment = require('moment');
const fs = require('fs');
const CategoryModel = require('../models/Category');

module.exports= {
    index : (req, res, next) =>{  
    res.render('Admin/categorys/index', { title: 'Wellcome to CSM Admin' });
    }
};
