#!/usr/bin/env node
/*
  最小のExpress HTTPSサーバー

  2017/5/7
  Maho Takara
*/

// Expressフレームワーク
var express = require('express');
var app = express();

// HTTPSサーバー起動
var fs = require('fs');
var https = require('https');
var options = {
  key:  fs.readFileSync('../chatbot/lets_encript.key'),
  cert: fs.readFileSync('../chatbot/lets_encript_fullchain.crt')
};
var server = https.createServer(options,app);

// ルート設定
app.get('/rest', function (req, res) {
    res.writeHead(200);
    res.end("Hello World.");
});

// イベント待機
server.listen(3000);

