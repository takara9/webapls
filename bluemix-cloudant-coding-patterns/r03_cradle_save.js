#!/usr/bin/env node
/*
  データ保管 キー指定あり
  
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


doc = {
    name: '由美',
    address: '東京都江東区',
    age: 25,
    email: 'yumi@sample.co.jp'
}

// データ保存 キー指定
db.save('yumi', doc, function (err, res) {
    if (err) {
	console.log("err = ", err);
    } else {
	console.log("res = ", res);
    }
});




