#!/usr/bin/env node
/*
  低レベルのHTTPサーバーを作る

  2017/5/6
  Maho Takara

  参考URL
  v4
  https://nodejs.org/dist/latest-v4.x/docs/api/http.html
  v6
  https://nodejs.org/dist/latest-v6.x/docs/api/http.html
*/
var http = require('http');

// Webサーバーの作成
var server = http.createServer();

// イベントハンドラを登録する
server.on('request',function(req,res) {
    // リクエストの表示
    console.log("Method = ", req.method);
    console.log("URL = ",    req.url);
    // 応答
    res.writeHead(200,{'Content-Type': 'text/plain'});
    res.write('Hello world\n');
    res.end();
})


// 登録したイベントハンドラの表示
x = server.listeners('request');
console.log(x[0].toString());

// イベントの待機
server.listen(3000);

