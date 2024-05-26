#!/usr/bin/env node
/*
  キーを指定してデータを更新する

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

// UPDATE
var key = 'rabbit'
cdb.get(key, function(err,data) {
    console.log("Before update = ", data);
    data.count = data.count + 1;
    cdb.insert(data,key, function(err, body, header) {
	if (err) {
	    throw err;
	} 
	console.log("After update = ", body.ok);
    });
});
