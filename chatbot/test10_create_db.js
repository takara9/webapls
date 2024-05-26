#!/usr/bin/env node

// Cloudantへの接続
var cred = require('./cloudant_credentials.json');
var Cloudant = require('cloudant')
var cloudant = Cloudant(cred.credentials.url);

/*
  データベース初期化
  
  session : 
  　進行中のセッションの情報を保管しています。
  　チャットサーバーを並列化した場合でも、複数のチャットサーバーで
    コンテキストを共有するために役立ちます。

  session_log:
    過去のセッションIDの記録です。 
    このセッションIDで conversation_log のフィルタ条件とする事で
    会話のトラッキングができます。

  conversation_log:
　  セッションIDやユーザーIDで、フィルタする事で、会話の記録を参照する事ができます。

  user_knowledge:
    チャット・ユーザーと会話した事による記憶の蓄積する領域です。

*/

var async = require('async');

databases = [
    'session',
    'session_log', 
    'conversation_log',
    'user_knowledge'
];

var session_log_count_index = {
    type: "json", 
    name: "count-index", 
    ddoc: "count_index",
    index: {
	fields: ["count"]
    }
}

// データベースの作成
function create_database(database_name, callback) {
    console.log("database name = ", database_name);
    cloudant.db.destroy(database_name, function(err) {
	cloudant.db.create(database_name, function(err) {
	    if (!err) {
		console.log("created");
	    } else {
		console.log("failed to create");
	    }
	    callback(err);
	});
    });
}

// インデックスの作成
function create_index(db, ddoc_body, callback) {
    doc_id =  "_design/" + ddoc_body.ddoc;
    db.get(doc_id, function(err,data) {
	if (!err) {
	    db.destroy(doc_id, data._rev, function(err, body, header) {
		if (!err) {
		    console.log("Existing index deleted: %s", doc_id);
		}
		db.index(ddoc_body, function(err, response) {
		    if (err) {
			throw err;
		    }
		    console.log("Index creation result: %s", response.result);
		});
	    });
	} else {
	    db.index(ddoc_body, function(err, response) {
		if (err) {
		    throw err;
		}
		console.log("Index creation result: %s", response.result);
	    });
	}
    });
}


// メイン処理
console.log("start");
async.series([
    function(callback) {
	create_database(databases[0], function(err) {
	    console.log("step #1 complete");
	    callback(err);
	});
    },
    function(callback) {
	create_database(databases[1], function(err) {
	    console.log("step #2 complete");
	    var db = cloudant.db.use(databases[1]);
	    create_index(db, session_log_count_index, function(err) {});
	    callback(err);
	});
    },
    function(callback) {
	create_database(databases[2], function(err) {
	    console.log("step #3 complete");
	    callback(err);
	});
    },
    function(callback) {
	create_database(databases[3], function(err) {
	    console.log("step #4 complete");
	    callback(err);
	});
    }],
    function(err) {
	console.log("end");
    }
);
