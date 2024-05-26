#!/usr/bin/env node
/*
  全データ取得
  
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

// 全データの取得
db.all(function (err, res) {
    console.log("err = ", err);
    console.log("res = ", res);
    res.rows.forEach(function (row) {
        console.log(row.key);
	db.get(row.key, function(err,doc) {
	    console.log("name = ", doc.name);
	});
    });
});

