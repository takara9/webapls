var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
//var stylus = require('stylus');

var stylus = require('express-stylus');
var nib = require('nib');

var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var flash = require('express-flash');
var handlebars = require('express-handlebars');
var app = express();


//試しのグローバル変数　本来はセッション変数であるべき
var line_start = 0;
var line_disp = 20;


// ==================================================================
// データベース接続
var cdb = require('./lib/cloudant');
// 環境変数、または、JSONファイルからCloudantの接続先を取得
var cfenv = require("cfenv");
var vcapLocal;
try {
    vcapLocal = require("./config/vcap-local.json");
} catch (err) {
    console.log(err);
}
var appEnvOpts = vcapLocal ? { vcap: vcapLocal} : {}
var appEnv = cfenv.getAppEnv(appEnvOpts);
var svc = appEnv.getServiceCreds('Cloudant NoSQL DB-j9');
console.log("vcapLocal = ",vcapLocal);
console.log("credentials = ", svc.url);

//var mdb = require('./lib/mongodb');

// ==================================================================
// セッション管理
var session = require('express-session');
var CloudantStore = require('connect-cloudant-store')(session);

// オンメモリに保存する場合
//var sessionStore = new session.MemoryStore;

// クラウダントで共有する場合
var sessionStore = new CloudantStore({
        database: 'session_express',
	url: svc.url
});

// セッションDB接続のコールバック
sessionStore.on('connect', function() {
    console.log("Cloudant Session store is ready for use ");
});
 
sessionStore.on('disconnect', function() {
    console.log("failed to connect to cloudant db - by default falls back to MemoryStore");
});
 
sessionStore.on('error', function(err) {
    console.log("You can log the store errors to your app log");
});

// ミドルウェア設定
var sessionOptions = {
  store: sessionStore,
  secret: 'May the force be with you',
  resave: false,
  saveUninitialized: true,
  proxy: true
};
app.use(session(sessionOptions));
// ==================================================================


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');


// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public/images', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser('secret'));
app.use(flash());
//app.use(stylus.middleware(path.join(__dirname, 'public')));
app.use(stylus({
  src: path.join(__dirname, 'public/stylesheets'),
  use: [nib()],
  import: ['nib']
}));


app.use(express.static(path.join(__dirname, 'public')));

// ルーティング処理
var routes = require('./routes/index');
var top    = require('./routes/top');
var users  = require('./routes/users');
var list   = require('./routes/list');
var form   = require('./routes/form');
var store  = require('./routes/store');

app.use(require('./lib/login'));  // ログイン　ミドルウェア
app.use('/', routes);        // ログイン画面、トップ画面送出
app.use('/logout', routes);　// ログアウト処理　POSTで対応
app.use('/top', top);　      // 開発中
app.use('/users', users);    // コンテンツ表示
app.use('/list', list);      // 開発中 リスト表示コンテンツ表示
app.use('/form', form);      // 開発中 フォームコンテンツ表示
app.use('/store', store);    // 開発中 フォームコンテンツ表示
app.use('/move', list);


// ==================================================================
// エラーハンドラー
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});
app.use('/:page', routes);　　// デフォルト設定 　ルート以下全て、routesへルーティング

app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
