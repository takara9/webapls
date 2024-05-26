#!/usr/bin/env node
/*
  データベース新規作成
  
  2017/4/30
  Maho Takara

*/

// Cloudantへの接続
var cred = require('./cloudant_credentials.json');
var Cloudant = require('cloudant')
var cloudant = Cloudant(cred.credentials.url);

// データベース
var dbn = "testdb";

// データベース新規作成
cloudant.db.create(dbn, function(err) {
    if (err) {
	throw err;
    }
});


