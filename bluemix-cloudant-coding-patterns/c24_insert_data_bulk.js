#!/usr/bin/env node
/*
  配列を一度にロードする。
  大量のデータのロード向きであるが、キー(_id)を指定できないので注意

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
data = [ { type: "rabbit", crazy: false, count: 10, age: 3, desc: "可愛い兎"},
 	 { type: "dog",    crazy: true,  count: 20, age: 3, desc: "大きな犬"},
	 { type: "mouse",  crazy: false, count: 30, age: 3, desc: "大きな鼠"},
	 { type: "cat",    crazy: true,  count: 30, age: 4, desc: "可愛い猫"} ]

cdb.bulk( {docs:data}, function(err) {
    if (err) {
	throw err;
    }
    console.log('Inserted all documents');
});

