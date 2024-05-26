var express = require('express');
var app = express();
var expressWs = require('express-ws')(app);

// Cloudantへ認証と接続

var cred = require('./cloudant_credentials.json');
var Cloudant = require('cloudant')
var cloudant = Cloudant(cred.url);

// Cloudantへの書き込み処理
function save( msg, callback) {
    var cdb = cloudant.db.use('chat');
    cdb.insert(msg, function(err, result){
	if (err) {
	    throw err;
	}
    });
}

// express  HTTP GET処理
app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

// express-ws ウェブソケット処理
app.ws('/ws/chat', function(ws, req) {
    ws.on('message', function(msg) {
	// データベースへ書き込み
	save(JSON.parse(msg),function() {});
	// 全接続クライアントに送信
	var aWss = expressWs.getWss();
	aWss.clients.forEach(function(client) {
	    client.send(msg);
	});
    });
});
 
app.listen(3000);
