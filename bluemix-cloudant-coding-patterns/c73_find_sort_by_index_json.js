#!/usr/bin/env node
/*
  条件にマッチするドキュメントを降順にソートしてリストする

  このコードが動作するためには、JSON型インデックスを生成する
  c12_create_index_json.js が実行されている必要がある。
  もしqueryの中のselector の中身をコメントにすると、ソートが効かなくなる。
  コメントにした場合_id のインデックスが優先されるため_id の昇順ソートになる。
  selector に、countの項目を設定する事で、c12_で作成したインデックスを
  指定する事ができ、本queryのソートが実行できる様になる。

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
	"count": { "$gt": 0 }
    },
    "fields": [
	"_id",
	"count",
	"age"
    ],
    "sort": [ { "count": "desc"}, 
	      { "age": "desc"}],
    "limit": 10
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
