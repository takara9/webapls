#!/usr/bin/env node
/*
  保存世代数設定
  
  2017/5/14
  Maho Takara

*/

var cradle = require("cradle");
var cred = require('./cloudant_credentials.json');
var dbn = "test01";
var options = {
    cache : true,
    raw : false,
    secure : true,
    auth : {
        username : cred.credentials.username,
        password : cred.credentials.password
    }
};

// Cloudant接続
var db = new cradle.Connection(
    cred.credentials.host,
    cred.credentials.port,
    options
).database(dbn);

// エラーになる？
db.maxRevisions(1, function(err, res) {
    if (err) {
        console.log('error ', err);
    } else {
        console.log('res ', res);
    }
});

