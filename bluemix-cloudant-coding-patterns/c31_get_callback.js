#!/usr/bin/env node
/*
  キーを指定してデータを取得する

  コールバックの中で、ネストしてGETを実行
  実行順序は保証されるが、スループットは良くない

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


// コールバック関数に入子にシーケンシャルにコールを行う
var keys = ['rabbit','cat','mouse','dog'];
cdb.get(keys[0], function(err,data) {
    if (err) {
	throw err
    }
    console.log("data = ", data);
    cdb.get(keys[1], function(err,data) {
	if (err) {
	    throw err
	}
	console.log("data = ", data);
	cdb.get(keys[2], function(err,data) {
	    if (err) {
		throw err
	    }
	    console.log("data = ", data);
	    cdb.get(keys[3], function(err,data) {
		if (err) {
		    throw err
		}
		console.log("data = ", data);
	    });
	});
    });
});	
