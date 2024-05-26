#!/usr/bin/env node

var express = require('express');
var parseurl = require('parseurl');
var session = require('express-session');
var app = express();

// 環境変数、または、JSONファイルからCloudantの接続先を取得
var cfenv = require("cfenv");
var vcapLocal;
try {
    vcapLocal = require("./vcap-local.json");
} catch (err) {
    console.log(err);
}
var appEnvOpts = vcapLocal ? { vcap: vcapLocal} : {}
var appEnv = cfenv.getAppEnv(appEnvOpts);
var svc = appEnv.getServiceCreds('Cloudant NoSQL DB-j9');
console.log("vcapLocal = ",vcapLocal);
console.log("credentials = ", svc.url);

// セッション・ストアを設定する
var CloudantStore = require('connect-cloudant-store')(session);


store = new CloudantStore({
        database: 'session_express',
	url: svc.url
});

store.on('connect', function() {
    console.log("Cloudant Session store is ready for use ");
});
 
store.on('disconnect', function() {
    console.log("failed to connect to cloudant db - by default falls back to MemoryStore");
});
 
store.on('error', function(err) {
    console.log("You can log the store errors to your app log");
});


// セッション管理 ミドルウェア設定
var sess_opt = {
  store: store,
  secret: 'May the force be with you',
  resave: false,
  saveUninitialized: true,
  proxy: true
};
app.use(session(sess_opt));



// アクセスカウントを計算するミドルウェア
app.use(function (req, res, next) {
  var views = req.session.views;
  if (!views) {
    views = req.session.views = {}
  }
  var pathname = parseurl(req).pathname;
  views[pathname] = (views[pathname] || 0) + 1;
  console.log("pathname=", pathname, "times=", views[pathname]);
  next();
})


// カウンタ表示
app.get('/foo', function (req, res, next) {
  res.send('you viewed this page ' + req.session.views['/foo'] + ' times');
});

app.get('/bar', function (req, res, next) {
  res.send('you viewed this page ' + req.session.views['/bar'] + ' times');
});

app.get('/', function (req, res, next) {
  res.send('Hello !');
});


// HTTPサーバー
var port = process.env.PORT || 3000
app.listen(port, function() {
    console.log("To view your app, open this link in your browser: http://localhost:" + port);
});
