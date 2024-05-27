#!/usr/bin/env node
//
// Cloudant のデータベースから索引検索する
//   単体テスト用
//
// 作者 Maho Takara    takara@jp.ibm.com
//
// Copyright (C) 2016 International Business Machines Corporation 
// and others. All Rights Reserved. 
// 
// 2016/8/15  初版
//

var cred = require('./cloudant_credentials_id.json');
var Cloudant = require('cloudant')
var cloudant = Cloudant(cred.credentials.url);
var db = cloudant.db.use("reactions");


// 検索式
query = {
    "selector": {
	"class": "朝挨拶"
    },
    "fields": [
	"_id",
	"_rev",
	"class",
	"reply_phrase",
	"dialog_name",
        "rr_name"
    ]
}

// 検索実行
db.find(query,function(err, body) {
    if (err) {
	console.log("Err:",err);
    } else {
	console.log("Hits:",body.docs.length);
	for (var i = 0; i < body.docs.length; i++) {
	    console.log(body.docs[i]);
	}
    }
});



