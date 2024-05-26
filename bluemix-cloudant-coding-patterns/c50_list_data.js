#!/usr/bin/env node
/*
  データベース内のドキュメントをリストする

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

// ドキュメントのリスト
cdb.list(function(err, body) {
    if (err) {
	throw err;
    }
    body.rows.forEach(function(doc) {
	cdb.get(doc.key, function(err,data) {
	    if (err) {
		throw err;
	    }
	    console.log("key = ", doc.key);
	    console.log("get = ", data);
	});
    })
});


