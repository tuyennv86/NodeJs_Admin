const bcrypt = require('bcryptjs');
const passport = require('passport');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const filePath = require('../configs/fileConstants');
// Load User model
const User = require('../models/User');

module.exports = {

  index: (req, res, next) => {
    res.render('Admin/index', { title: 'Wellcome to CSM Admin' });
  },
  unauthorized: (req, res, next) => {
    res.render('Admin/unauthorized', { title: 'Bạn không được quyền truy cập' });
  },
  //login
  login: (req, res, next) => {
    res.render('Admin/users/login', { title: 'Login to CSM Admin' });
  },

  postLogin: (req, res, next) => {
    passport.authenticate('local', {
      successRedirect: req.session.returnTo != undefined ? req.session.returnTo : '/admin/index',
      failureRedirect: '/admin',
      failureFlash: true
    })(req, res, next);
  },

  logout: (req, res) => {
    req.logout();
    req.session.returnTo = undefined;
    req.flash('success_msg', 'Bạn đã thoát khỏi quản trị');
    res.redirect('/admin');
  },

  profile: (req, res, next) => {
    res.render('Admin/users/profile', { title: 'Thông tin user' });
  },

  postProfile: (req, res, next) => {
    try {
      let imageUrl = "";
      if (!req.files || Object.keys(req.files).length === 0) {
        req.flash('success_msg', 'Bạn phải nhập file ảnh');
        res.redirect('/admin/changpass');
      }
      let sampleFile = req.files.avatar;
      if (fs.existsSync(filePath.avataPath + sampleFile.name)) {
        imageUrl = Date.now() + sampleFile.name;
      } else {
        imageUrl = sampleFile.name;
      }

      sampleFile.mv(filePath.avataPath + imageUrl, function (err) {
        if (err)
          return res.status(500).send(err);
      });

      User.findById(req.user._id, (err, data) => {
        if (err) return res.status(500).send(err);
        if (data.ImageUrl.length > 0) {
          try {
            fs.unlink(filePath.avataPath + data.ImageUrl, function (err) {
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
  },

  changpass: (req, res, next) => {
    res.render('Admin/users/changpass', { title: 'Đổi mật khẩu' });
  },

  postChangpass: (req, res, next) => {

    let { oldPass, newPass, newPass2 } = req.body;

    bcrypt.compare(oldPass, req.user.password, (err, isMatch) => {
      if (err) throw err;
      if (isMatch) {
        if (newPass != newPass2) {
          req.flash('success_msg', 'Mật khẩu mới không trùng nhau');
          res.redirect('/admin/changpass');
        } else {
          User.findById(req.user._id, function (err, dataUser) {
            if (err) return handleError(err);
            const hashenewPass = bcrypt.hashSync(newPass, 10);
            dataUser.password = hashenewPass;
            dataUser.save()
              .then(user => {
                console.log('doi mat khau :' + hashenewPass);
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
  },

  listUsers: (req, res, next) => {
    //console.log(req.user);
    const perPage = 10;
    const page = req.params.page || 1;
    User.find({}).sort({ date: 'descending' }).skip((perPage * page) - perPage).limit(perPage).exec(function (err, listUsers) {
      if (err) return next(err);
      User.count().exec(function (err, count) {
        if (err) return next(err);
        res.render('Admin/users/listUsers', {
          title: 'Danh sách các users',
          data: listUsers,
          current: page,
          pages: Math.ceil(count / perPage),
          linkUrl: 'user/list'
        });
      });
    });

  },

  postListUsers: (req, res, next) => {
    const listId = req.body.checkItem;
    const page = req.params.page;

    listId.forEach(function (item) {

      User.findByIdAndDelete(item).exec(function (err, data) {
        if (err) return next(err);
        if (data.ImageUrl != '') {
          try {
            fs.unlink(filePath.avataPath + data.ImageUrl, function (err) {
              if (err) console.log(err);
              console.log('File deleted!');
            });
          } catch (error) {
            return next(error);
          }
        }

      });
    });

    req.flash('success_msg', 'Bạn đã xóa các user vừa chọn thành công!');
    res.redirect('/admin/user/list/' + page);

  },

  editUser: (req, res, next) => {
    const id = req.params.id;
    const url = req.query.url;
    User.findById(id).exec(function (err, data) {
      if (err) return next(err);
      res.render('Admin/users/editUser', {
        title: 'Cập nhật thông tin User - ' + data.name,
        url: url,
        data: data
      });
    });
  },

  postEditUser: (req, res, next) => {
    const url = req.body.hidurl;
    const id = req.params.id;
    const name = req.body.name;
    const password = req.body.password;
    let imageUrl = req.body.imageUrl;
    const active = req.body.chkActive ? true : false;
    const admin = req.body.chkAdmin ? true : false;

    if (!req.files || Object.keys(req.files).length === 0) { }
    else {
      try {
        fs.unlink(filePath.avataPath + imageUrl, function (err) {
          if (err) console.log(err);
          console.log('File deleted!');
        });
      } catch (error) {
        console.log(error);
      }

      let sampleFile = req.files.fileImg;
      imageUrl = sampleFile.name;
      if (fs.existsSync(filePath.avataPath + sampleFile.name)) {
        imageUrl = uuidv4() + sampleFile.name;
      } else {
        imageUrl = sampleFile.name;
      }
      sampleFile.mv(filePath.avataPath + imageUrl, function (err) {
        if (err)
          return res.status(500).send(err);
      });
    }

    User.findById(id).exec(function (err, dataUser) {
      if (err) return next(err);
      if (password.length > 5) {
        bcrypt.genSalt(10, (err, salt) => {
          if (err) throw err;
          bcrypt.hash(password, salt, (err, hashPass) => {
            if (err) throw err;
            dataUser.password = hashPass;
            dataUser.name = name;
            dataUser.ImageUrl = imageUrl;
            dataUser.active = active;
            dataUser.admin = admin;

            dataUser.save(function (err) {
              if (err) return next(err);
              req.flash('success_msg', 'Bạn đã cập nhật thông tin của acount "' + dataUser.email + '" thành công!');
              res.redirect('/admin/' + url);
            });
          });
        });
      } else {

        dataUser.name = name;
        dataUser.ImageUrl = imageUrl;
        dataUser.active = active;
        dataUser.admin = admin;

        dataUser.save(function (err) {
          if (err) return next(err);
          req.flash('success_msg', 'Bạn đã cập nhật thông tin của acount "' + dataUser.email + '" thành công!');
          res.redirect('/admin/' + url);
        });
      }
    });

  },

  deleteUser: (req, res, next) => {

    const id = req.params.id;
    const url = req.query.url;

    User.findByIdAndDelete(id).exec(function (err, data) {
      if (err) throw err;
      if (data.ImageUrl != '') {
        try {
          fs.unlink(filePath.avataPath + data.ImageUrl, function (err) {
            if (err) console.log(err);
            console.log('File deleted!');
          });
        } catch (error) {
          console.log(error);
        }
      }
      req.flash('success_msg', 'Bạn đã xóa : "' + data.email + '" thành công!');
      res.redirect('/admin/' + url);
    });

  },

  addUser: (req, res, next) => {
    res.render('Admin/users/addUser', { title: 'Thêm mới thành viên' });
  },

  postAddUser: (req, res, next) => {

    const email = req.body.email;
    const name = req.body.name;
    const password = req.body.password;
    const password2 = req.body.password2;
    const active = req.body.chkActive ? true : false;
    const admin = req.body.chkAdmin ? true : false;
    let imageUrl;

    if (!req.files || Object.keys(req.files).length === 0) {
      imageUrl = "";
    } else {
      let sampleFile = req.files.fileImg;
      if (fs.existsSync(filePath.avataPath + sampleFile.name)) {
        imageUrl = uuidv4() + sampleFile.name;
      } else {
        imageUrl = sampleFile.name;
      }
      sampleFile.mv(filePath.avataPath + imageUrl, function (err) {
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
      res.render('Admin/users/addUser', { errors, name, email, password, password2, active, admin });
    } else {
      User.findOne({ email: email }).then(user => {
        if (user) {
          errors.push({ msg: 'Email "' + email + '" đã được đăng ký' });
          res.render('Admin/users/addUser', { errors, name, email, password, password2, active, admin });
        } else {
          let newUser = new User({ name, email, password, imageUrl, active, admin });
          bcrypt.genSalt(10, (err, salt) => {
            if (err) throw err;
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

  }
};