#!/usr/bin/env node
/*
  search用インデックスのためのデザイン・ドキュメントを登録する

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

// インデクサー
var indexer = function(doc) {
    index("type", doc.type);
    index("desc", doc.desc);
}

// デザイン・ドキュメント
var ddoc = {
    _id: '_design/index-search',
    indexes: {
	pets: {
	    analyzer: { name: 'standard'},
	    index   : indexer
	}	    
    }
};

// 登録
cdb.insert(ddoc, function (err, result) {
    if (err) {
	throw err;
    }
    console.log('Created design document', result);
});
