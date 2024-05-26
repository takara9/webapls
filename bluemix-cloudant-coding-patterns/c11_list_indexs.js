#!/usr/bin/env node
/*
  既存のインデックスをリストする
  
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

cdb.index(function(err, result) {
    if (err) {
      throw err;
    }
    console.log(JSON.stringify(result, null, 2));
});
