#!/usr/bin/env node
/*
  最小のHTTPクライアント

  2017/5/7
  Maho Takara
*/
var http = require("http");
url = 'http://192.155.208.116:3000/user/0123ae0'
console.log("url: ", url);

// GETの要求処理
http.get(url, function(res){
    console.log("応答コード: ", res.statusCode);
    res.setEncoding('utf8');
    // GETの応答処理
    res.on('data', function(chunk){
	console.log("応答BODY: ",chunk);
    });

}).on('error', function(e) {
    console.log("エラー発生: ", e.message);
});
