#!/usr/bin/env node
/*
  ビューの保存
  
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


ddoc = {
    all: {
	map: function(doc) {
	    if (doc.name) emit(doc.name,doc);
	}
    },
    sniper: {
	map: function(doc) {
	    if (doc.name && doc.occupation == 'スナイパー') {
		emit(null,doc)
	    }
	}
    }
};

db.save('_design/person', ddoc, function(err, res) {
    console.log("err = ", err);
    console.log("res = ", res);
});

