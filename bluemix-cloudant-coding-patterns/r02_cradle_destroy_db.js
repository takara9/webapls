#!/usr/bin/env node
/*
  データベース削除
  
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

// データベース削除
db.destroy(function(err) {
    db.exists(function (err, exists) {
	if (err) {
	    console.log('error', err);
	} else if (exists) {
	    console.log('exist database: ', dbn);
	} else {
	    console.log('database does not exists.');
	}
    });
});


