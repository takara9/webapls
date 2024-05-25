var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');

//セッション管理、ログイン失敗メッセージに必要なモジュール
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var flash = require('express-flash');
var handlebars = require('express-handlebars');
var sessionStore = new session.MemoryStore;

// ルーター設定
var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public/images', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//　セッション情報設定
app.use(cookieParser('secret'));
app.use(session({
    cookie: { maxAge: 60000 },
    store: sessionStore,
    saveUninitialized: true,
    resave: 'true',
    secret: 'secret'
}));
app.use(flash());

// パブリックエリア  CSS プリプロセッサ設定
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

// ログインしないと見えないエリア
app.use(require('./login'));  // ログインのミドルウェア
app.use('/', routes);         // ログイン画面、トップ画面送出
app.use('/logout', routes);　 // ログアウト処理　POSTで対応
app.use('/users', users);     // 動的コンテンツ表示
app.use('/private', express.static(path.join(__dirname, 'private')));  // 静的コンテンツ


// catch 404 and forward to error handler
// ログインしてない場合は、login.js で捕捉して、ログインページへ飛ばす
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use('/:page', routes);　　// デフォルト設定


// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
