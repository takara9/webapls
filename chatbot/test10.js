#!/usr/bin/env node
/*
  セッション情報をクラウダントへ書き込む
*/
var fs = require('fs');
var async = require('async');

// LINE MESSAGE API
var LineMsgApi = require('line-msg-api');
var line_cnf = require('./line_api_credential.json');
var bot1 = new LineMsgApi(line_cnf);

// Facebook Message API
fb_credentials = require('./facebook_api_credentials.json');
var MessengerPlatform = require('facebook-bot-messenger');
const https = require('https');
var server = https.createServer({
    key: fs.readFileSync(fb_credentials.server.key),
    cert: fs.readFileSync(fb_credentials.server.cert)
});
// Facebook メッセージ
var bot2 = MessengerPlatform.create(fb_credentials, server);
bot2.webhook('/webhook');
server.listen(fb_credentials.server.port);


// IBM Watson Conversation
var watson = require('watson-developer-cloud');
var conv_auth = require('./conversation_credentials.json');
var conv_wsid = require('./conversation_workspace_id.json');
var conversation = watson.conversation(conv_auth);

// 
var users = {};

// UUID
//var uuid = require('node-uuid');
var uuid = require('uuid');

// セッション管理 Cloudantへの接続
var cred = require('./cloudant_credentials.json');
var Cloudant = require('cloudant')
var cloudant = Cloudant(cred.credentials.url);
var db_session = cloudant.db.use("session");               // セッション 
var db_session_log = cloudant.db.use("session_log");       // セッションログ
var db_conv_log = cloudant.db.use("conversation_log");     // 会話ログDB
var db_user_knowledge = cloudant.db.use("user_knowledge"); // ユーザー知識

// ダウンロードフォルダー
const DOWNLOAD = "downloads";


// ================ LINE ==================
bot1.on(function (message) {
    userId = message.events[0].source.userId;
    session_ctrl( "LINE", userId, message, function(err, session) {
	if (err) {
	    console.log("error: ", err)
	}
    });
});

// LINE イベント処理
function event_handler_line( message, session, callback) {
    if (message.events[0].message.type == 'text') {
	session.input_msg = message.events[0].message.text;
	// Watson Conversation をコール
	watson_conversation(session,message,function(err,session) {
	    bot1.replyMessage(
		message.events[0].replyToken, 
		session.output_msg); 
	    // 会話ログ書き込み
	    chat_log_writer(session,function(err) {});
	    callback(err,session);
	});
    } else if (message.events[0].message.type == 'image') {
	console.log("Image ----");
	fpath = DOWNLOAD + "/" + message.events[0].message.id + ".jpg"
	bot1.getContent(message.events[0].message.id,fpath);
	console.log("The image file is saved at ", fpath);
	callback(null,session);
    } else if (message.events[0].message.type == 'audio') {
	console.log("Sound ----");
	fpath = DOWNLOAD + "/" + message.events[0].message.id + ".mp4"
	bot1.getContent(message.events[0].message.id,fpath);
	console.log("The sound file is saved at ", fpath);
	callback(null,session);
    } else if (message.events[0].message.type == 'sticker') {
	console.log("Sticker ----");
	console.log(message.events[0].message);
	// replay the sticker to the sender
	MessageObj = {
	    "type": "sticker",
	    "packageId": "1",
	    "stickerId": "3"
	};
	bot1.replyMessageObject(message.events[0].replyToken, MessageObj);
	callback(null,session);
    } else {
	console.log("Other ----");
	console.log(message.events[0]);
	callback(null,session);
    }
}



// ================ Facebook ==================

// FBメッセージ到着コールバック
bot2.on(MessengerPlatform.Events.MESSAGE, function(userId, message) {
    session_ctrl( "Facebook", userId, message, function(err, session) {
	if (err) {
	    console.log("error: ", err)
	}
    });
});

// Facebook イベント処理
function event_handler_facebook(message, session, callback) {
    console.log("UserID ", message.getSenderId());
    // テキストメッセージ
    if (message.isTextMessage()) {
	console.log("message text : ", message.getText());
	session.input_msg = message.getText();
	// Watson Conversation をコール
	watson_conversation(session,message,function(err,session) {
	    bot2.sendTextMessage(
		session.reply_id,
		session.output_msg); 
	    chat_log_writer(session,function(err) {});
	    callback(err,session);
	});
    } else {
	// テキスト以外の処理
	payload = message.toJSON().message.attachments[0].payload;
	if (payload.sticker_id != undefined ) {
	    console.log("sticker_id : ", payload.sticker_id);
	    bot2.sendImageMessage(session.reply_id, payload.url);
	}
	console.log("message json : ", message.toJSON());
	console.log("type : ", message.toJSON().message.attachments[0].type);
	console.log("url : ", payload.url);
    }
};

// Watson Conversation インタフェース
function watson_conversation(session,message,callback) {
    
    // Watson Conversation をコール
    conversation.message({
	workspace_id: conv_wsid.workspace_id,
	input: {'text': session.input_msg},
	context: session.context
    },function(err, response) {
	if (!err) {
	    console.log("watson resp: ", JSON.stringify(response, null, 2));
	    // 応答メッセージ組み立て
	    session.output_msg = "";
	    for(i = 0; i < response.output.text.length; i++) {
		session.output_msg = session.output_msg + " " + response.output.text[i];
	    }
	    // セッションデータ更新
	    session.response = response;
	    session.context = response.context;
	    callback(err,session);		
	} else {
	    callback(err,session);
	}
    });

}

// ユーザープロファイル取得 LINE & Facebook
function get_profile(agent, userId, callback) {
    if (agent == "LINE") {
	bot1.getProfile(userId,function(err,profile) {
	    callback(null, profile);
	}).catch(function(err) {
	    callback(err, null);
	});
    } else if ( agent == "Facebook") {
	bot2.getProfile(userId).then(function(profile) {
	    callback(null, profile);
	}).catch(function(err) {
	    callback(err, null);
	});
    }
    // 例外
}


// イベントハンドラー LINE & Facebook
function event_handler(message, session, callback) {
    if (session.agent == "LINE") {
	event_handler_line( message, session, function(err,session) {
	    callback(err,session);
	});
    } else if (session.agent == "Facebook") {
	event_handler_facebook( message, session, function(err,session) {
	    callback(err,session);
	});
    }
}


//=============== セッション管理 =================
// セッション管理
//
//   SNSのユーザーIDで検索して無ければ新規と判定
//   端末が複数処理しても同時に一人のユーザーとしか会話できない
function session_ctrl(agent, userId, message, callback) {
    var date = new Date();
    var time = date.toLocaleString();

    // ユーザーIDでセッションの存在をチェック
    db_session.get(userId, function(err,session) {
	if (err) {
	    // 新規セッション
	    if (err.error == 'not_found') {
		// ユーザー・プロファイル取得
		profile = get_profile(agent, userId, function(err,profile) {
		    if (err) {callback(err,null)}
		    //console.log("user profile = ", profile);
		    // セッション開始
		    session_open(agent, userId, message, profile, function(err, session) {
			if (err) {callback(err,null)}
			session.agent = agent;	// エージェントを設定
			// イベント処理
			event_handler(message, session, function(err,session) {
			    if (err) {callback(err,null)}
			    // セッション更新
			    session_update(session, function(err) {
				if (err) {callback(err,null)}
				callback(null,session);
			    });
			});			
		    });
		});
	    } else {
		callback(err,null);
	    }
	} else {
	    // 既存セッション
	    session.count = session.count + 1;
	    session.last_time = time;
	    // イベント処理
	    event_handler(message, session, function(err,session) {
		if (err) {callback(err,null)}
		session_update(session, function(err,session) {
		    if (err) {callback(err,null)}
		    callback(null,session);
		});
	    });			
	}
    });
}


// 新規セッションの作成
function session_open(agent, userId, message, profile, callback) {
    var date = null;
    var reply = null;
    if (agent == "LINE"){
	date = new Date(message.events[0].timestamp);
	reply = message.events[0].replyToken
    } else {
	date = new Date(message.getTime());
	reply = message.getSenderId();
    }
    var time = date.toLocaleString();

    // 新規セッション 開始登録
    session = {
	session_id: uuid.v4(),
	user_id: userId,
	profile: profile,
	context: {},
	count: 0,
	reply_id: reply,
	start_time: time,
	last_time: time
    };
    db_session.insert(session, session.user_id, function(err, body, header) {
	if (err) { callback(err,null) }
	// 登録時の識別情報をセッションに書き込み
	session._id = body.id;
	session._rev = body.rev;

	// セッションログ 登録
	session_log = {
	    session_id: session.session_id,
	    user_id: userId,
	    start_time: time,
	    last_time: time,
	    session_complete: false
	}
	db_session_log.insert(session_log, session.session_id,function(err, body, header) {
	    if (err) { callback(err,null)}
	});
	callback(null,session);
    });
}

// セッションの情報更新
function session_update(session, callback) {
    var date = new Date();
    var time = date.toLocaleString();

    if (session.context.complete == true) {
	// 取得情報の書き込み
	doc = session.context;
	delete doc.system;
	delete doc.conversation_id;
	doc.profile = session.profile;
	doc.user_id = session.user_id;
	doc.session_id = session.session_id;
	doc.request_time = session.last_time;
	doc.agent = session.agent;
	//console.log("doc = ", doc);
	db_user_knowledge.insert(doc,function(err,body,header) {});
	session_close(session, function(err) {
	    if (err) { callback(err,null) }
	});
    } else {
	// セッション継続
	db_session.insert(session, function(err, body, header) {
	    if (err) { callback(err,null) }
	});
    }
    callback(null,null);
}



// セッション終了
function session_close(session, callback) {
    console.log("セッションの終了");
    var date = new Date();
    var time = date.toLocaleString();

    db_session.get(session.user_id, function(err,session) {
	// セッション情報の削除
	db_session.destroy(session.user_id, session._rev, function(err, body, header) {
	    if (err) {callback(err);}
	    // セッションログの最終時刻の記録、終了状態へ変更
	    db_session_log.get(session.session_id, function(err, doc) {
		doc.last_time = time;
		doc.session_complete = true;
		//console.log("teminate session : ",doc);
		db_session_log.insert(doc, function(err, body, header) {
		    if (err) {callback(err); } 
		    callback(null);
		});
	    });
	});
    });
}


// 会話ログ書き込み
function chat_log_writer(session, callback) {
    // ログのレコード作成
    var doc = {
	session_id:  session.session_id,
	user_id:     session.reply_id,
	time:        session.last_time,
	count:       session.count,
	input_text:  session.input_msg,
	output_text: session.output_msg
    }
    // ログへ書き込み
    db_conv_log.insert(doc,function(err,body) {
	if (err) {callback(err,null)}
	callback(null,session);
    });
}
