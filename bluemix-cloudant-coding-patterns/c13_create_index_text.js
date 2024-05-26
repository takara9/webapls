#!/usr/bin/env node
/*
  TEXT形式のインデックスを設定する
  
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

// テキスト インデックス
var ddoc_name =  "index-text";
var key = "_design/" + ddoc_name;
var index = {
    "type": "text", 
    "name": "index-2", 
    "ddoc": ddoc_name,
    "index": {
	"fields": [
	    { "name": "count", "type": "number" },
	    { "name": "age",   "type": "number" }
	]
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


