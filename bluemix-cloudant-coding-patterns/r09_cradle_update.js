#!/usr/bin/env node
/*
  データベース更新
  
  2017/5/14
  Maho Takara

*/

var cradle = require("cradle");
var cred = require('./cloudant_credentials.json');
var dbn = "test01";
var options = {
    cache : true,
    raw : false,
    secure : true,
    auth : {
        username : cred.credentials.username,
        password : cred.credentials.password
    }
};

// Cloudant接続
var db = new cradle.Connection(
    cred.credentials.host,
    cred.credentials.port,
    options
).database(dbn);


doc = {
    name: 'ゴルゴ斎藤',
    address: '東京都江東区',
    age: 43,
    email: 'gsaito@sample.co.jp'
}

// データ保存
db.save(doc, function (err, res) {
    if (!err) {
	console.log("res = ", res);
	// 更新 idとrev の前にアンダースコアは無い
	db.get(res.id, function (err, doc) {
	    doc.age = doc.age + 1
	    // id のみで更新可能 _id への変換は cradleの中で実施
	    db.save(res.id, doc, function (err, res) { 
		console.log("err = ", err);
		console.log("update = ", res);
	    });
	});
    }
});





