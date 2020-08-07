const routercheckModel = require('../models/RouterCheck');

module.exports = {
  isLoggedIn: function (req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    req.flash('error_msg', 'Phiên làm việc của bạn đã hết hãy đăng nhập lại');
    req.session.returnTo = req.originalUrl;
    res.redirect(`/admin?returnUrl=${req.originalUrl}`);
  },
  notLoggedIn: function (req, res, next) {
    if (!req.isAuthenticated()) {
      return next();
    }
    res.redirect('/admin/index');
  }, checkAccess: function (req, res, next) {
    if (req.user.admin) {
      return next();
    } else {

      let urlcheck = '';
      if (req.route.path.includes(":")) {
        const urltop = req.originalUrl.split('?')[0];
        urlcheck = urltop.substring(0, urltop.lastIndexOf("/")) + req.route.path.substring(req.route.path.lastIndexOf("/"), req.route.path.lenght);
        console.log(urlcheck + 'dia chỉ truoc');
      } else {
        urlcheck = req.originalUrl.substring(0, req.originalUrl.lastIndexOf("/")) + req.route.path;
        console.log(urlcheck + " dia chi sau ");
      }
      
      // routercheckModel.findOne({ Url: urlcheck }).exec(function (err, data) {
        routercheckModel.findOne({ Url: { $all: urlcheck.toLowerCase() } }).exec(function (err, data) {
        if (err) return next(err);
        if (data !== null) {
          console.log(data + req.user._id);
          // console.log(data.userId.indexOf(req.user._id) + "  vi trí ");
          if (data.userId.indexOf(req.user._id) > -1) {
            res.redirect('/admin/unauthorized');
            return;
          } else
            return next();
        }
        return next();
      });
    }
  }
};