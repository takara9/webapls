#!/usr/bin/env node
/*
   ビューでデータ取得
  
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


var view_db = 'person/sniper'
//var view_db = 'person/all'
db.view(view_db, function (err, res) {
    console.log("err = ", err);
    res.forEach(function (row) {
        console.log(row.name);
    });
});




