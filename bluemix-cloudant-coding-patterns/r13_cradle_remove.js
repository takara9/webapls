#!/usr/bin/env node
/*
  データの削除
  
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


// データ一件削除
db.remove('yumi', function (err, doc) {
    if (err) {
	console.log("err = ", err);
    } else {
	console.log("doc = ", doc);
    }
});




