#!/usr/bin/env node
/*
  条件にマッチするドキュメントを降順にソートしてリストする

  このコードが動作するためには、テキスト型インデックスを作成する
  c13_create_index_text.js が実行されている必要がある。

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

// テキスト・インデックスを利用するためのクエリー
// 項目名 count の後に :number を付与する事がポイント
// 検索式
query = {
    "selector": {
	"count": {
	    "$gt" : 0
	}
    },
    "fields": [
	"_id",
	"count",
	"age"
    ],
    //"sort": [ { "count:number": "desc"}],
    "sort": [ { "count": "desc"}],
    "limit": 10,
    "use_index": "_design/index-text"
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

