#!/usr/bin/env node
/*
  最小のExpress HTTPサーバー

  2017/5/7
  Maho Takara
*/

// Expressフレームワーク
var express = require('express');
var app = express();
// ルート設定
app.get('/rest', function (req, res) {
  res.send('Hello World!');
});
// イベント待機
app.listen(3000);

