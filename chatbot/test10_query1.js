#!/usr/bin/env node

// Cloudantへの接続
var cred = require('./cloudant_credentials.json');
var Cloudant = require('cloudant')
var cloudant = Cloudant(cred.credentials.url);

// データベース
var dbn = "session_log";
var cdb = cloudant.db.use(dbn);
query = {
    "selector": {
	"count": { "$gt": 0 }
    },
    "fields": [
	"session_id",
	"user_id",
	"count",
	"input_text",
	"output_text"
    ],
    "sort": [
	{
	    "count": "asc"
	}
    ]

}

// 検索実行
cdb.find(query,function(err, body) {
    if (err) {
	throw err;
    }
    console.log("Hits:",body.docs.length);
    for (var i = 0; i < body.docs.length; i++) {
	console.log(body.docs[i]);
    }
});

