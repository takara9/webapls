#!/usr/bin/env node
//
// Cloudant に登録されたデータをダンプする
//
// 作者 Maho Takara    takara@jp.ibm.com
//
// Copyright (C) 2016 International Business Machines Corporation 
// and others. All Rights Reserved. 
// 
// 2016/8/15  初版
//

var fs   = require('fs');
var cred = require('./cloudant_credentials_id.json');
var Cloudant = require('cloudant')
var cloudant = Cloudant(cred.credentials.url);
var dbname = "reactions"
var db = cloudant.db.use(dbname);

db.list(function(err, body) {
    if (!err) {
        body.rows.forEach(function(doc) {
            db.get(doc.id, function(err, data) {
                console.log(data);
                console.log("---");
            });
        });
    }
});

