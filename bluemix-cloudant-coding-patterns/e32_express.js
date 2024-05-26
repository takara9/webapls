#!/usr/bin/env node
/*
  xpress HTTPサーバー ミドルウェア設定

  2017/5/7
  Maho Takara
*/

// Expressフレームワーク
var express = require('express');
var app = express();

// ミドルウェアの設定
app.use(function (req, res, next) {
    console.log('Time:', Date.now());
    console.log("URL = ", req.url);
    next();
});

// ルート・ハンドラーの設定
app.get('/user/:id', function (req, res, next) {
    console.log('User ID:', req.params.id);
    next();
}, function (req, res, next) {
    res.send('User Info');
});

// ルートのみ設定
app.get('/company/:id', function (req, res) {
    console.log('Company ID:', req.params.id);
    res.send('Company Info');
});

// イベント待機
app.listen(3000);

