#!/usr/bin/env node
/*
  ループでキーを指定してデータを挿入する

  コールバックで処理せず、ノンブロッキングで実行する
  先行するcdb.insertの終了を待たずに、ループを回して、処理を開始させるため
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

//        KEY       DATA
docs = { 'rabbit': { crazy: false, count: 10, age: 3, desc: "可愛い兎"},
 	 'dog':    { crazy: true,  count: 20, age: 3, desc: "大きな犬"},
	 'mouse':  { crazy: false, count: 30, age: 3, desc: "大きな鼠"},
	 'cat':    { crazy: true,  count: 30, age: 4, desc: "可愛い猫"}}

// データ挿入ループ
for(var key in docs) {
    console.log("key  = ",key);
    console.log("docs = ",docs[key]);
    cdb.insert(docs[key],key,function(err, body, header) {
	if (err) {
	    console.log("err : ", err);
	    throw err;
	}
	console.log('You have inserted', body);
    });
}
