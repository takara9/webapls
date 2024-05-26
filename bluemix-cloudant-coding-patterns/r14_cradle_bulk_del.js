#!/usr/bin/env node
/*
  ベース削除 一括　失敗
  
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

keys = ['X-FILE-001','X-FILE-002','X-FILE-003'];

db.remove(keys, function (err, docs) {
    console.log("err = ", err);
    console.log("docs = ", docs);
});






