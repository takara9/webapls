#!/usr/bin/env node
/*
  ドキュメントをキー指定で削除する

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

// DELETE 
var key = 'rabbit'
cdb.get(key, function(err,data) {
    console.log("data = ", data);
    cdb.destroy(key, data._rev, function(err, body, header) {
	if (err) {
	    throw err;
	}
	console.log("deleted = ", key);
    });
});


