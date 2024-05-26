#!/usr/bin/env node
/*
  キーを指定してデータを取得する

　asyncを利用して順番にcdb.getを実行
  順序性は保証されるが、スループットは遅い

  2017/4/30
  Maho Takara

*/

// Cloudantへの接続
var cred = require('./cloudant_credentials.json');
var Cloudant = require('cloudant')
var cloudant = Cloudant(cred.credentials.url);

// データベース
var dbn = "testdb";
var cdb = cloudant.db.use(dbn);


// 非同期処理で順番に実行
var async = require('async');
var keys = ['rabbit','cat','mouse','dog'];
async.series([
    function(callback) {
	cdb.get(keys[0], function(err,data) {
	    console.log("data = ", data);
	    callback(null);
	});
    },
    function(callback) {
	cdb.get(keys[1], function(err,data) {
	    console.log("data = ", data);
	    callback(null);
	});
    },
    function(callback) {
	cdb.get(keys[2], function(err,data) {
	    console.log("data = ", data);
	    callback(null);
	});
    },
    function(callback) {
	cdb.get(keys[3], function(err,data) {
	    console.log("data = ", data);
	    callback(null);
	});
    }],
    function(err) {
	console.log("end");
    }
);

