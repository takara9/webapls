#!/usr/bin/env node

// Cloudantへの接続
var cred = require('./cloudant_credentials.json');
var Cloudant = require('cloudant')
var cloudant = Cloudant(cred.credentials.url);

// データベース
var dbn = "session";
var cdb = cloudant.db.use(dbn);

// リスト
cdb.list(function(err, body) {
    if (!err) {
	body.rows.forEach(function(doc) {
	    cdb.get(doc.key, function(err,data) {
		if (!err) {
		    console.log("key = ", doc.key);
		    console.log("get = ", data);
		} else {
		    console.log("err = ",err);
		}
	    });
	})
    } else {
	console.log("err = ",err);
    }
});


