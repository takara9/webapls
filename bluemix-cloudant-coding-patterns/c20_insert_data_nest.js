#!/usr/bin/env node
/*
  コールバックでネストしながらデータを挿入する
  
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


// データのINSERT
cdb.insert( docs[0], docs[0].type, function(err, body, header) {
    if (err) {
	throw err;
    }
    console.log('You have inserted', body);
    cdb.insert( docs[1], docs[1].type, function(err, body, header) {
	if (err) {
	    throw err;
	}
	console.log('You have inserted', body);
	cdb.insert( docs[2], docs[2].type, function(err, body, header) {
	    if (err) {
		throw err;
	    }
	    console.log('You have inserted', body);
	    cdb.insert( docs[3], docs[3].type, function(err, body, header) {
		if (err) {
		    throw err;
		}
		console.log('You have inserted', body);
	    });
	});
    });
});
