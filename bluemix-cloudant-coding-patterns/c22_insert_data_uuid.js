#!/usr/bin/env node
/*
  ループでキーを指定せずデータを挿入する
  キー(_id)は、Cloudant サーバー側で自動付与される

  コールバックで処理せず、ノンブロッキングで実行するため
  セッション数が膨大に増えるなどリスクがあるので注意が必要

  2017/4/30
  Maho Takara

*/

// Cloudantへの接続
var cred = require('./cloudant_credentials.json');
var Cloudant = require('cloudant')
var cloudant = Cloudant(cred.credentials.url);

// データベース
var dbn = "testdb";
var cdb = cloudant.db.use(dbn);

//        DATA
docs = [ { type: "rabbit", crazy: false, count: 10, age: 3, desc: "可愛い兎"},
 	 { type: "dog",    crazy: true,  count: 20, age: 3, desc: "大きな犬"},
	 { type: "mouse",  crazy: false, count: 30, age: 3, desc: "大きな鼠"},
	 { type: "cat",    crazy: true,  count: 30, age: 4, desc: "可愛い猫"} ]

// データ登録
for(var key in docs) {
    console.log("key=%d type=%s ",key, docs[key].type);
    cdb.insert(docs[key],function(err, body, header) {
	if (err) {
	    console.log("err : ", err);
	    throw err;
	}
	console.log('You have inserted', body);
    });
}
