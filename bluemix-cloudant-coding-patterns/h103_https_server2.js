#!/usr/bin/env node
/*
  データを受け取れるHTTPSサーバーを作る

  2017/5/7
  Maho Takara

  参考URL
  v4
  https://nodejs.org/dist/latest-v4.x/docs/api/https.html
  v6
  https://nodejs.org/dist/latest-v6.x/docs/api/https.html
*/

var fs = require('fs');
var https = require('https');
var querystring = require("querystring");
const StringDecoder = require('string_decoder').StringDecoder;
const decoder = new StringDecoder('utf8');

// Webサーバーの作成
var options = {
  key:  fs.readFileSync('../chatbot/lets_encript.key'),
  cert: fs.readFileSync('../chatbot/lets_encript_fullchain.crt')
};
var server = https.createServer(options);

// イベントハンドラを登録する
server.on('request',function(req,res) {

    // リクエストの表示
    console.log("Method = ", req.method);
    console.log("URL = ",    req.url);

    // POSTデータ受信処理
    req.on('data',function(chunk) {
	console.log("header = ", req.headers);
	// Query String -> JSON形式へ変換
	var rcv_data = querystring.parse(decoder.write(chunk))
	var rcv_text = JSON.stringify(rcv_data);
	var rcv_json = JSON.parse(rcv_text);
        console.log("json text = ", rcv_json.message);
        console.log("json number = ", rcv_json.sound);
        console.log("json boolean = ", rcv_json.reply);

	// 何かの処理
	rcv_json.message = "こんにちは、良い天気ですね。";
	rcv_json.reply = true;

	// 応答送信
	res.writeHead(200,{'Content-Type': 'application/json'});
	var text_data = JSON.stringify(rcv_json);
	var ReplyData = querystring.stringify(rcv_json);
	res.write(ReplyData);
	res.end();
    });

});

// 登録したイベントハンドラの表示
x = server.listeners('request');
console.log(x[0].toString());

// イベントの待機
server.listen(3000);
