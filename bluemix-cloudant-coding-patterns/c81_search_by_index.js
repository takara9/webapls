#!/usr/bin/env node
/*
  searchを使って日本語の検索を実行

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

// 検索条件
ddoc_name = 'index-search';
index_name = 'pets';
query = {
    q:'desc:可愛い'
};

// SEARCH実行
cdb.search(ddoc_name, index_name, query, function(err, result) {
    if (err) {
	throw err;
    }
    console.log("Hits:",result.rows.length);
    for (var i = 0; i < result.rows.length; i++) {
	// GET
	cdb.get(result.rows[i].id, function(err,data) {
	    console.log("data = ", data);
	});
    }
});
