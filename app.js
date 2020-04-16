// modules
const createError = require('http-errors');
const express = require('express');
var formidable = require('formidable');
var fs = require('fs');
var image = require('imageinfo')
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');

// import 等语法要用到 babel 支持
require('babel-register');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, '/views/'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use('/public/',express.static(path.join(__dirname, '/public/')));
app.use('/node_modules/',express.static(path.join(__dirname,'/node_modules/')))
// app.use(express.static('upload'))
app.use('/public/',express.static(path.join(__dirname,'/public/')))
app.post("/upload",(req,res) => {
    var form  = new formidable.IncomingForm();
    let uploadDir = path.join(__dirname,"./public/upload/");
    form.uploadDir = uploadDir;
    form.parse(req, (err, fields, files) => {
        let oldPath = files.cover.path;//这里的路径是图片的本地路径
        console.log(files.cover.name)//图片传过来的名字
        let newPath = path.join(path.dirname(oldPath), files.cover.name);
        var downUrl = "http://localhost:3000" + "/upload/" + files.cover.name;//这里是想传回图片的链接
        fs.rename(oldPath, newPath, () => {//fs.rename重命名图片名称
            res.json({ downUrl: downUrl })
          })
    })
})
app.use(cookieParser('blog_node_cookie'));
app.use(
	session({
		secret: 'blog_node_cookie',
		name: 'session_id', //# 在浏览器中生成cookie的名称key，默认是connect.sid
		resave: true,
		saveUninitialized: true,
		cookie: { maxAge: 60 * 1000 * 30, httpOnly: true }, //过期时间
	}),
);

const mongodb = require('./core/mongodb');

// data server
mongodb.connect();

//将路由文件引入
const route = require('./routes/index');

//初始化所有路由
route(app);

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