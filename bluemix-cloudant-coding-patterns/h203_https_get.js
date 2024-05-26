#!/usr/bin/env node
/*
  HTTPSクライアントからGETする

  2017/5/7
  Maho Takara

  参考URL
  v4
  https://nodejs.org/dist/latest-v4.x/docs/api/https.html
  v6
  https://nodejs.org/dist/latest-v6.x/docs/api/https.html
*/

var querystring = require("querystring");
var https = require("https");
var StringDecoder = require('string_decoder').StringDecoder;
var decoder = new StringDecoder('utf8');

// 送信データ作成
var json_data = {
    message: 'Hello World! こんにちは',
    sound: 123
}
var text_data = JSON.stringify(json_data);
var postData = querystring.stringify(json_data);
var options = {
    hostname: 'www.mahotakara.wjg.jp',
    port: 3000,
    path: '/rest',
    method: 'GET',
    headers: {
	'Content-Type': 'application/json',
	'Content-Length': Buffer.byteLength(postData)
    }
};

// リクエスト定義と応答処理設定
var req = https.request(options, function(res) {
    console.log("STATUS: ", res.statusCode);
    console.log("HEADERS: ", JSON.stringify(res.headers));
    res.setEncoding('utf8');

    // 応答受信処理
    res.on('data', function(chunk){
	console.log("BODY: ", chunk);
	// Query String -> JSON形式へ変換
	var rcv_text = querystring.parse(decoder.write(chunk))
        var rcv_json_text = JSON.stringify(rcv_text);
        var rcv_json = JSON.parse(rcv_json_text);
        console.log("json text = ", rcv_json.message);
        console.log("json number = ", rcv_json.sound);
        console.log("json boolean = ", rcv_json.reply);
    });
    // 応答終了処理
    res.on('end', function(){
	console.log('これ以上データはありません。')
    });
});


// 送信のエラー処理
req.on('error', function(e){
  console.log( "エラー発生: ", e.message);
});

// データ送信(POST)
req.write(postData);
req.end();
