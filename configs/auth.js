module.exports = {
  isLoggedIn: function(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    req.flash('error_msg', 'Please log in to view that resource');
    res.redirect('/admin');
  },
  notLoggedIn: function(req, res, next) {
    if (!req.isAuthenticated()) {
      return next();
    }
    res.redirect('/admin/index');      
  }
};
