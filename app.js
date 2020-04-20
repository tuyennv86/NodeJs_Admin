const createError = require('http-errors');
const compression = require('compression');
const helmet = require('helmet');
const xss = require('xss-clean');
const express = require('express');
// const expressLayouts = require('express-ejs-layouts');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const settings = require('./configs/keys');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/admin/users');
const categorysRouter = require('./routes/admin/categorys');
const productsRouter = require('./routes/admin/products');

const categoryApi = require('./api/categoryApi');

const categoryType = require('./models/CategoryType');

const app = express();

app.use(compression({ filter: shouldCompress })); // không nén headers
function shouldCompress (req, res) {
  if (req.headers['x-no-compression']) {
    // don't compress responses with this request header
    return false
  } 
  // fallback to standard filter function
  return compression.filter(req, res)
}
app.use(helmet());// bao mật
app.use(xss());// bảo mật xss
// Passport Config
require('./configs/passport')(passport);

// Connect to MongoDB
mongoose.connect(settings.mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

app.use(fileUpload());
app.use(cors());
// view engine setup
app.set('views', path.join(__dirname, 'views'));
// app.set('layout', 'layouts/layout');
app.set('view engine', 'ejs');
// app.use(expressLayouts);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// Express session
app.use(session({
  secret: settings.secret_key,
  resave: false,
  saveUninitialized: true
}));
// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());
// Global variables

app.use((req, res, next) => {     
  res.header('Access-Control-Allow-Origin', '*'); 
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');     
  next();     
  app.options('*', (req, res) => {
    res.header('Access-Control-Allow-Methods', 'GET, PATCH, PUT, POST, DELETE, OPTIONS');         
    res.send();     
  }); 
});
// app.use(helmet());

app.use(function (req, res, next) {
  categoryType.find({}, function (err, categoriesType) {
       if(err) return next(err);
       res.locals.categoriesTypeLocal = categoriesType;
       next();
    });
});


app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.users = req.user;
  res.locals.title = req.title;  
  next();
});

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/admin', usersRouter);
app.use('/admin/category', categorysRouter);
app.use('/api/category', categoryApi);
app.use('/admin/product', productsRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
