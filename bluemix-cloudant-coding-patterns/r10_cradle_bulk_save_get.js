#!/usr/bin/env node
/*
  データの一括登録
  
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


docs = [
    {
	_id: 'X-FILE-001',
	name: 'ゴルゴ斎藤',
	age: 48,
	occupation: 'スナイパー',
	address: '東京都江東区'
    },
    {
	_id: 'X-FILE-002',
	name: '次元大介',
	age: 32,
	occupation: 'ガンマン',
	address: '東京都港区'
    },
    {
	_id: 'X-FILE-003',
	name: 'スパイク・スピーゲル',
	age: 27,
	occupation: '賞金稼ぎ',
	address: '東京都大田区'
    },
    {
	_id: 'X-FILE-004',
	name: 'サイトー',
	age: 34,
	occupation: 'スナイパー',
	address: '東京都新宿区'
    }
];

keys = ['X-FILE-001','X-FILE-002','X-FILE-003'];

// DBへ一度に保存
db.save(docs, function (err, res) {
    console.log("err = ", err);
    console.log("res = ", res);
    db.get(keys, function (err, docs) {
	console.log("err = ", err);
	console.log("docs = ", docs);
    });
});





