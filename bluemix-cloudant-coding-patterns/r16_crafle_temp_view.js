#!/usr/bin/env node
/*
  テンポラリビューの検索
  
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


db.temporaryView({
    map: function (doc) {
        if (doc.name && doc.age > 30) emit(doc.name, doc);
    }
}, function (err, res) {
    if (err) console.log(err);
    console.log(res);
});



