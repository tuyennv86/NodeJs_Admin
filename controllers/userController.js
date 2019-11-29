const bcrypt = require('bcryptjs');
const passport = require('passport');
const moment = require('moment');
const fs = require('fs');
// Load User model
const User = require('../models/User');

module.exports.index = (req, res, next) =>{  
    res.render('Admin/index', { title: 'Wellcome to CSM Admin' });
};

//login
module.exports.login = (req, res, next) => {
    res.render('Admin/users/login', { title: 'Login to CSM Admin' });
}

module.exports.postLogin = (req, res, next) => {
    passport.authenticate('local', {
      successRedirect: '/admin/index',
      failureRedirect: '/admin',
      failureFlash: true
    })(req, res, next);
};

//dang ky
// module.exports.register = (req, res, next) => {  
//     res.render('Admin/users/register', { title: 'Register to CSM Admin' });
//   }

// module.exports.postRegister = (req, res) => {
//     const { name, email, password, password2 } = req.body;
//     //console.log(req.body);
    
//     let errors = [];
  
//     if (!name || !email || !password || !password2) {
//       errors.push({ msg: 'Hãy nhập dữ liệu' });
//     }
  
//     if (password != password2) {
//       errors.push({ msg: 'Mật khẩu không trùng nhau' });
//     }
  
//     if (password.length < 6) {
//       errors.push({ msg: 'Mật khẩu không được nhỏ hơn 6 ký tự' });
//     }
  
//     if (errors.length > 0) {
//       res.render('Admin/users/dang-ky', {errors, name, email, password, password2 });
//     } else {
//       User.findOne({ email: email }).then(user => {
//         if (user) {
//           errors.push({ msg: 'Email đã được đăng ký' });
//           res.render('Admin/users/dang-ky', {errors, name, email, password, password2 });
//         } else {
//           const newUser = new User({name, email, password });
  
//           bcrypt.genSalt(10, (err, salt) => {
//             bcrypt.hash(newUser.password, salt, (err, hash) => {
//               if (err) throw err;
//               newUser.password = hash;
//               newUser.save()
//                 .then(user => {
//                   req.flash('success_msg', 'Bạn đã đăng ký thành công hãy đăng nhập');
//                   res.redirect('/admin');
//                 })
//                 .catch(err => console.log(err));
//             });
//           });
//         }
//       });
//     }
// };

module.exports.logout = (req, res) => {
    req.logout();
    req.flash('success_msg', 'Bạn đã thoát khỏi quản trị');
    res.redirect('/admin');
};

module.exports.profile = (req, res, next) =>{
    res.render('Admin/users/profile', { title: 'Thông tin user', moment : moment});
};

module.exports.postProfile = (req, res, next) =>{
  try {
    let imageUrl = "";
    if (!req.files || Object.keys(req.files).length === 0) {
      req.flash('success_msg', 'Bạn phải nhập file ảnh');
      res.redirect('/admin/changpass');
    }
    let sampleFile = req.files.avatar;
    if (fs.existsSync('./public/uploads/avata/'+sampleFile.name)) {
      imageUrl = "avata/"+Date.now()+ sampleFile.name; 
    }else{  
      imageUrl = "avata/"+sampleFile.name;    
    }

    sampleFile.mv('./public/uploads/'+imageUrl, function(err) {
      if (err)
        return res.status(500).send(err);
    });

    User.findById(req.user._id, (err, data) => {
    if (err) return res.status(500).send(err);
      if(data.ImageUrl.length > 0){
        try {
          fs.unlink('./public/uploads/'+data.ImageUrl, function (err) {
            if (err) console.log(err);           
            console.log('File deleted!');
          });  
        } catch (error) {
          console.log(error);
        }
      }
      data.ImageUrl = imageUrl;
      data.save(); 
      res.redirect('/admin/profile');
    });
    
  } catch (err) {
    res.status(500).send(err);
  }
};

module.exports.changpass = (req, res, next) =>{
  res.render('Admin/users/changpass', { title: 'Đổi mật khẩu' });
};

module.exports.postChangpass = (req, res, next) =>{

  let { oldPass, newPass, newPass2 } = req.body; 

  bcrypt.compare(oldPass, req.user.password, (err, isMatch) => {
    if (err) throw err;
    if (isMatch) {
      if (newPass != newPass2) {
        req.flash('success_msg', 'Mật khẩu mới không trùng nhau');
        res.redirect('/admin/changpass');
       }else{
        User.findById(req.user._id, function(err, dataUser){
          if (err) return handleError(err);
            const hashenewPass = bcrypt.hashSync(newPass, 10);
            dataUser.password = hashenewPass;
            dataUser.save()
            .then(user => {
              console.log('doi mat khau :'+hashenewPass);
              req.flash('success_msg', 'Đổi mật khẩu thành công');
              res.redirect('/admin/changpass');
            })
            .catch(err => console.log(err));
        });
      }
    }
     else {     
      req.flash('error_msg', 'Mật khẩu cũ không đúng');
      res.redirect('/admin/changpass');
    }
  });
};

module.exports.listUsers = (req, res, next) =>{
  //console.log(req.user);
  var perPage = 10;
  var page = req.params.page || 1;
  User.find({}).sort({date : 'descending'}).skip((perPage * page) - perPage).limit(perPage).exec(function(err, listUsers){
    if(err) return next(err);
    User.count().exec(function(err, count){
      if(err) return next(err);
      res.render('Admin/users/listUsers',{
        title: 'Danh sách các users',
        data: listUsers,
        current: page,
        pages: Math.ceil(count/perPage),
        linkUrl: 'user/list',
        moment : moment
      });
    });
  });

};

module.exports.postListUsers = (req, res, next) =>{
  const listId = req.body.checkItem;
  const page = req.params.page;
  let messages = new Array();
  listId.forEach(function(item){
    
    User.findByIdAndDelete(item).exec(function(err, data){
      if (err) throw err; 
      console.log(data); 
      if(data.ImageUrl != ''){
        try {      
          fs.unlink('./public/uploads/'+data.ImageUrl, function (err) {
            if (err) console.log(err);           
            console.log('File deleted!');
          });  
        } catch (error) {
          console.log(error);
        }
      }     
      messages.push(data.email);       
    });

  });
  console.log(messages);
  
  req.flash('success_msg', 'Bạn đã xóa các user :'+ messages +' thành công!');  
  res.redirect('/admin/user/list/'+page);

};

module.exports.editUser = (req, res, next) =>{
  var id = req.params.id;
  var url = req.query.url;
  User.findById(id).exec(function(err, data){
    if(err) return next(err);
    res.render('Admin/users/editUser',{
      title: 'Cập nhật thông tin User - '+ data.name,
      url: url,
      data: data
    });
  });  
};

module.exports.postEditUser = (req, res, next) => {
  const url = req.body.hidurl;
  const id = req.params.id;
  const name = req.body.name;
  const password = req.body.password;
  let imageUrl = req.body.imageUrl;
  const active = req.body.chkActive ? true : false;
  const admin = req.body.chkAdmin ? true : false;

  if (!req.files || Object.keys(req.files).length === 0) {  }
  else{
    try {      
      fs.unlink('./public/uploads/'+imageUrl, function (err) {
        if (err) console.log(err);           
        console.log('File deleted!');
      });  
    } catch (error) {
      console.log(error);
    }

    let sampleFile = req.files.fileImg;    
    imageUrl = "avata/"+sampleFile.name;    
    if (fs.existsSync('./public/uploads/avata/'+sampleFile.name)) {
      imageUrl = "avata/"+Date.now()+ sampleFile.name; 
    }else{  
      imageUrl = "avata/"+sampleFile.name;    
    }
    sampleFile.mv('./public/uploads/'+imageUrl, function(err) {
      if (err)
        return res.status(500).send(err);          
    });
  }

  User.findById(id).exec(function(err, dataUser){
    if(err) return next(err);   
    if(password.length > 5){
      bcrypt.genSalt(10, (err, salt) => {
        if (err) throw err;
        bcrypt.hash(password, salt, (err, hashPass) => {
          if (err) throw err;
          dataUser.password = hashPass;
          dataUser.name = name;
          dataUser.ImageUrl = imageUrl;
          dataUser.active = active;
          dataUser.admin = admin;

          dataUser.save(function(err){
            if(err) return next(err);
            req.flash('success_msg', 'Bạn đã cập nhật thông tin của acount '+ dataUser.email +' thành công!');
            res.redirect('/admin/'+url);
          });
        });
      });
    }else{

      dataUser.name = name;
      dataUser.ImageUrl = imageUrl;
      dataUser.active = active;
      dataUser.admin = admin;
  
      dataUser.save(function(err){
        if(err) return next(err);
        req.flash('success_msg', 'Bạn đã cập nhật thông tin của acount '+ dataUser.email +' thành công!');
        res.redirect('/admin/'+url);
      });  
    }
  });

};

module.exports.deleteUser = (req, res, next) =>{

  const id = req.params.id;
  const url = req.query.url;

  User.findById(id).exec(function(err, data){
    if(err) return next(err);
    if(data.ImageUrl != ''){
      try {
        fs.unlink('./public/uploads/'+data.ImageUrl, function (err) {
          if (err) console.log(err);           
          console.log('File deleted!');
        }); 
      } catch (error) {
        console.log(error);        
      }
    }
  });

  User.findByIdAndDelete(id).exec(function(err, data){
    if (err) throw err; 
    req.flash('success_msg', 'Bạn đã xóa :'+ data.name +' thành công!');
    res.redirect('/admin/'+url);
  });

};

module.exports.addUser = (req, res, next) =>{
  res.render('Admin/users/addUser', { title: 'Thêm mới thành viên'});
};

module.exports.postAddUser = (req, res, next) =>{
  
  const email = req.body.email;
  const name = req.body.name;
  const password = req.body.password;
  const password2 = req.body.password2;
  const active = req.body.chkActive ? true: false;
  const admin = req.body.chkAdmin ? true : false;
  let imageUrl;

  if (!req.files || Object.keys(req.files).length === 0) {
    imageUrl = "";
    console.log("khong co anh ");    
    }
  else{     
    let sampleFile = req.files.fileImg;  
    if (fs.existsSync('./public/uploads/avata/'+sampleFile.name)) {
      imageUrl = "avata/"+Date.now()+ sampleFile.name; 
    }else{  
      imageUrl = "avata/"+sampleFile.name;    
    }
    sampleFile.mv('./public/uploads/'+imageUrl, function(err) {
      if (err)
        return res.status(500).send(err);          
    });    
  }

  let errors = [];
  
    if (!name || !email || !password || !password2) {
      errors.push({ msg: 'Hãy nhập dữ liệu' });
    }
  
    if (password != password2) {
      errors.push({ msg: 'Mật khẩu không trùng nhau' });
    }
  
    if (password.length < 6) {
      errors.push({ msg: 'Mật khẩu không được nhỏ hơn 6 ký tự' });
    }
  
    if (errors.length > 0) {
      res.render('Admin/users/addUser', {errors, name, email, password, password2,active, admin });
    } else {
      User.findOne({ email: email }).then(user => {
        if (user) {
          errors.push({ msg: 'Email '+email+' đã được đăng ký' });
          res.render('Admin/users/addUser', {errors, name, email, password, password2, active, admin });
        } else {   
          let newUser = new User({name, email, password, imageUrl, active, admin });                 
          bcrypt.genSalt(10, (err, salt) => {
            if(err) throw err;
            bcrypt.hash(password, salt, (err, hash) => {
              if (err) throw err;             
              newUser.password = hash;
              newUser.ImageUrl = imageUrl;
              newUser.save()
                .then(user => {
                  req.flash('success_msg', 'Bạn đã thêm mới thành công');
                  res.redirect('/admin/user/add');
                })
                .catch(err => console.log(err));
            });
          });
        }
      });
    }

};