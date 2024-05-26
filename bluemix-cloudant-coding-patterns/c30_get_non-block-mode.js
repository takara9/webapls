#!/usr/bin/env node
/*
  キーを指定してデータを取得する

　以下のcdb.get は、ノンブロッキングで実行されるので
　前のcdb.getが完了しない内に、次のcdb.getが実行されている
　つまり平行してCloudant へ問い合わせが飛んでいるので注意

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
// データ取り出し
var keys = ['rabbit','cat','mouse','dog'];
for (var i = 0; i < keys.length; i++) {
    cdb.get(keys[i], function(err,data) {
	console.log("data = ", data);
    });
}
