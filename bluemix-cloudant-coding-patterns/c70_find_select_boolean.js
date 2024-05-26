#!/usr/bin/env node
/*
  論理型の項目と一致するドキュメントをリストする

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

// 検索式
query = {
    "selector": {
	"crazy": false
    },
    "fields": [
	"_id",
	"_rev",
	"type",
	"crazy"
    ]
}

// 検索実行
cdb.find(query,function(err, body) {
    if (err) {
	throw err;
    }
    console.log("Hits:",body.docs.length);
    for (var i = 0; i < body.docs.length; i++) {
	console.log(body.docs[i]);
    }
});
