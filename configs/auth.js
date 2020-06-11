module.exports = {
  isLoggedIn: function(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    req.flash('error_msg', 'Phiên làm việc của bạn đã hết hãy đăng nhập lại');
    res.redirect('/admin');    
  },
  notLoggedIn: function(req, res, next) {
    if (!req.isAuthenticated()) {
      return next();
    }
    res.redirect('/admin/index');      
  }
};
