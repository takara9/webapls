#!/usr/bin/env node
/*
  JSON形式のインデックスを設定する
  
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

// JSON インデックス
var ddoc_name =  "index-json";
var key = "_design/" + ddoc_name;
var index = {
    type: "json", 
    name: "index-1", 
    ddoc: ddoc_name,
    index: {
	fields: ["count","age"]
    }
}

// インデックス作成 (共通)
function create_index(index_name, callback) {
    cdb.index(index, function(err, response) {
	if (err) {
	    throw err;
	}
	console.log('Index creation result: %s', response.result);
	callback(err, response);
    });
}

// インデックスの更新
cdb.get(key, function(err,data) {
    if (err) {
	create_index(index, function(err, response) {});
    } else {
	cdb.destroy(data._id, data._rev, function(err, body, header) {
	    if (err) {
		throw err;
	    }
	    console.log("deleted = ", key);
	    create_index(index, function(er, response) {});
	});
    }
});
