#!/usr/bin/env node
//
// LINEからの日本語テキストのメッセージを受けて、
// Watson NLCで分類して、応答するチャットボット
//
// 作者 Maho Takara    takara@jp.ibm.com
//
// Copyright (C) 2016 International Business Machines Corporation 
// and others. All Rights Reserved. 
// 
// 2016/8/15  初版
//

// DEBUG SW  ON;1, OFF;0
const __DEBUG = 0;
const __ROFF = 0;

// 共通
var fs = require('fs');
var async = require('async');
var watson = require('watson-developer-cloud');

// LINE BOTの初期化
var LineBot = require('line-bot');
var line_crd = require('./line_api_credential.json');
var linebot = new LineBot(line_crd);

// Watson NLC
var cnf_nlc = require('./nlc/nlc_config.json');
var pra_nlc = require('./nlc/nlc_id.json');
var crd_nlc = require('./nlc/watson_nlc_credentials.json');
var nlc = watson.natural_language_classifier(crd_nlc.credentials);

// Watson Dialog
var dialog_cnf  = require('./dialog/dialog_config.json');
var dialog_auth = require('./dialog/watson_dialog_credentials.json');
var dialog = watson.dialog(dialog_auth.dialog[0].credentials);

// Watson RR
var rr_cnf   = require('./rr1/rr_config.json');
var rr_pra   = require('./rr1/cluster_id.json');
var rr_auth  = require('./rr1/watson.rtrv_rank.auth.json');
var rr = watson.retrieve_and_rank(rr_auth.credentials);
var qs = require('qs');

// Watson Visual Recognition
var vr_auth = require('./vr/visual_recognition_credentials.json');
var vr = watson.visual_recognition(vr_auth.credentials);
var sleep = require('sleep-async')();

// 時間
var moment = require("moment");

// Cloudantへの接続
var cred = require('./cloudant_credentials_id.json');
var Cloudant = require('cloudant')
var cloudant = Cloudant(cred.credentials.url);

// 反応データベース
var dbname = "reactions";
var pdb = cloudant.db.use(dbname);

// 天気取得機能
var weather = require('./weather_report/libweather2.js');


// ラインAPI
var line_api = require('./line_api/lib_line_api.js');


// 動作モード
const NLC_MODE = 1;
const DIALOG_MODE =  2;
const RR_MODE =  3;

// セッション情報、配列で全体を保有
var session = {};  


//=============================================

/*
 LINE BOT API メッセージ受信
*/
linebot.on('message', function (msg) {
    date = new Date(msg.result[0].content.createdTime);
    time = date.toLocaleString()
    write_log("=== EVENT RECIVE (time:" + time + ") ===");

    async.series([
	// プロファイルを毎回取得しなくても良い様にするため、asyncを入れる
	function(callback) {
	    //セッションが無い時は、プロファイルを取得する
	    if (session[msg.result[0].content.from] == undefined ) {
		console.log("EVENT: new session");
		// メッセージ送信相手の情報取得
		linebot.getProfile(msg.result[0].content.from,function(err,profile) {
		    session[msg.result[0].content.from]
			= { count: 0, 
			    mode: NLC_MODE,
			    profile: profile,
			    start_time: time,
			    last_time: time
			  };
		    callback(null);
		});
	    } else {
		session[msg.result[0].content.from].count++;
		session[msg.result[0].content.from].last_time = time;
		callback(null);
	    }
	}],function(err, results) {
	    // テキスト
	    if ( msg.result[0].content.contentType == 1) {
		write_log("=== LINEからテキスト受信 ===");
		write_log("受信TEXT> " + msg.result[0].content.text);

		watson_input_data = {
		    text: msg.result[0].content.text,
		    date: msg.result[0].content.createdTime,
		    from: msg.result[0].content.from
		};

		session[msg.result[0].content.from].input_text 
		    = msg.result[0].content.text;
		session[msg.result[0].content.from].input_from
		    = msg.result[0].content.from;
		
		// Watson Chat Bot メイン
		watson_chatbot_main(session[msg.result[0].content.from],
				    function(err,watson_ans) {
					write_log("応答TEXT> " + watson_ans.phrase);
					// 送信元へメッセージ送信
					linebot.sendMessage(
					    msg.result[0].content.from,
					    watson_ans.phrase);
					//console.log(session[msg.result[0].content.from]);
				    });
		
	    }
	    // 画像
	    else if ( msg.result[0].content.contentType == 2) {
		write_log("=== LINEから画像受信 ===");
		//console.log(msg.result[0].content);
		var uploaded_file = 'vr/images/' + msg.result[0].content.id + '.jpg';
		linebot.getContent(msg.result[0].content.id,uploaded_file);
		session[msg.result[0].content.from].image_file = uploaded_file
		
		watson_vr(session[msg.result[0].content.from],function(err,watson_ans) {
		    // 送信元へメッセージ送信
		    linebot.sendMessage(
			msg.result[0].content.from,
			watson_ans.phrase);
		    //console.log(session[msg.result[0].content.from]);
		});
	    }
	    // 音源
	    else if ( msg.result[0].content.contentType == 4) {
		write_log("=== LINEから音源受信 ===");
		//console.log(msg.result[0].content);
	    }
	    // スタンプ
	    else if ( msg.result[0].content.contentType == 8) {
		write_log("=== LINEからスタンプ受信 ===");
		//console.log(msg.result[0].content);
	    }
	    // その他
	    else {
		write_log("=== LINEからその他受信 ===");
		//console.log(msg.result[0].content);
	    }
	});
});


/*
  Watson Chat Bot メイン処理
     状態(MODE)で処理を振り分ける
 */
function watson_chatbot_main( session_handle, callback) {

    if (session_handle.mode == DIALOG_MODE) {
	// Dialog 対話
	watson_dialog(
	    session_handle,
	    function(err,dialog_ans) {
		if (err) {throw err;}
		callback(err,dialog_ans);
	    });
    } else if ( session_handle.mode == RR_MODE) {
	// R & R
	watson_retrieve(
	    session_handle,
	    function(err,rr_ans) {
		callback(err,rr_ans);
	    });
	
	session_handle.mode = NLC_MODE;
    } else {
	// 自然言語分類 NLC
	watson_nlc(
	    session_handle,
	    function(err,nlc_ans) {
		callback(err,nlc_ans);
	    });
    }
}

/*
  Watson NLC 自然言語分類と対応処理
*/
function watson_nlc(session_handle,callback) {
    pra_nlc.text = session_handle.input_text;
    nlc.classify( pra_nlc, function(err, resp) {
	if (err) {
	    write_log("error:", err);
	    callback(err,null);
	} else {

	    // 判別されたクラスをリスト
	    for(var i = 0;i < resp.classes.length; i++) {
		if (resp.classes[i].confidence > 0.01) {
		    write_log(" [" + i + "]" + " NLC CLASS= " + resp.classes[i].class_name 
			      + "、確信度= " + parseInt(resp.classes[i].confidence * 100 )
			      + "%");
		}
	    }

	    // セッション情報にNLCのトップクラスをセット
	    session_handle.nlc_class  = resp.classes[0].class_name;
	    session_handle.confidence = resp.classes[0].confidence;
	    session_handle.nlc_pst    = parseInt(session_handle.confidence * 100);
	    

	    // 確信度 70%　で対応を検索
	    if (session_handle.confidence > 0.7) {
		take_action(session_handle, function(err,reply) {
		    callback(err,reply);
		});
	    } else {
		msg = "確度 " 
		    + session_handle.nlc_pst + "％で「" 
		    + session_handle.nlc_class
		    + "」と判定されますが、"
		+ "確度が低いので、別の言い方でお願いします。"
		callback(null, { phrase: msg });
	    }
	}
    });
}


// ログファイルへ書き込み
function write_log(data) {
    console.log(data);
    write_buf = data + '\n';
    fs.appendFileSync('watson_nlc_log.txt', write_buf ,'utf8');
}

// Intの乱数を返す 0からmaxまで
function getRandomInt(max) {
    return Math.floor( Math.random() * max );
}


/*
  対応アクションの検索結果に基づき応答を実施する
*/
function take_action(session_handle,callback) {

    write_log("対応DB 検索 NLC_CLASS= " + session_handle.nlc_class);
    
    // 対応DB 検索
    pdb.find( {"selector": {"class": session_handle.nlc_class}} ,function(err, body) {
	if (err) {
	    write_log("find error:", err);
	    callback(err,null);
	}
	write_log("対応DB 候補Hit数= " + body.docs.length);


	if (body.docs.length) {
	    // DEBUG 候補をログに出力
	    for (var i=0;i<body.docs.length;i++) {
		write_log(" [" + i + "] " + body.docs[i].reply_phrase);
	    }

	    // 簡易処理　ヒットした解答候補の中から乱数で選択する
	    var ans_i = getRandomInt( body.docs.length);
	    // =================================================

	    var msg = "";
	    // DEBUG NLCレベルでの応答
	    if (__DEBUG) {
		msg = "確度 " 
		    + session_handle.nlc_pst + "％で\n「" 
		    + session_handle.nlc_class
		    + "」と判断\n\n";
	    }

	    // NLCレベルのレスポンス
	    msg = msg + body.docs[ans_i].reply_phrase;
	    callback(null, {phrase : msg});

	    // 選択結果に Dialog, RR, 外部APIの定義に従って、次のモジュールをCALL
	    if (body.docs[ans_i].reaction.length > 0) {
		eval( body.docs[ans_i].reaction 
		      + "(session_handle,function(err,rsp){callback(err,rsp)});");
	    } else if (body.docs[ans_i].dialog_name.length > 0) {

		session_handle.dialog = {
		    input: session_handle.input_text,
		    name: body.docs[ans_i].dialog_name
		};
		watson_dialog(session_handle,function(err,dialog_ans) {
		    if (err) {throw err;}
		    callback(err,dialog_ans);
		});
	    } else if (body.docs[ans_i].rr_name.length > 0) {
		session_handle.rr_name = body.docs[ans_i].rr_name;
		session_handle.sc_name = body.docs[ans_i].sc_name;
		if (__ROFF) {
		    search_solr_collection( session_handle,function(err,rr_ans) {
			callback(err,rr_ans);
		    });
		} else {
		    watson_rr( session_handle, function(err,ans) {
			if (err) {throw err;}
			callback(err,ans);
		    });
		}
	    }

	} else {
	    callback(null, {phrase : 'リアクションDBに反応候補がありません'});
	}
	if (__DEBUG) console.log("DEBUG action_reply L2 を抜けたぞ");
    });
    if (__DEBUG) console.log("DEBUG action_reply L1 を抜けたぞ");
}


// Dialog を利用した会話処理本体
function watson_dialog(session_handle, callback) {

    if (session_handle.dialog == undefined)  {
	session_handle.dialog 
	    = { name: session_handle.dialog_name,
		input: session_handle.input_text }
    } else {
	session_handle.dialog.input = session_handle.input_text;
    }

    // DIALOGサービスの名称からインスタンスのIDを取得する
    dialog.getDialogs({}, function(err, resp) {
	session_handle.mode = NLC_MODE;
	if (err) {
	    console.log("error =", err);
	    //callback(err,null);
	    return;
	}

	if (resp.dialogs.length == 0) {
	    console.log("Not found dialog");
	    return;
	}

	var dialog_id = null;
	for (var i = 0; i < resp.dialogs.length;i++) {
	    if ( resp.dialogs[i].name == session_handle.dialog.name) {
		dialog_id = resp.dialogs[i].dialog_id;
		break;
	    }
	}

	if (dialog_id == null) {
	    console.log("Not found dialog_name");
	    return;
	}

	session_handle.mode = DIALOG_MODE;
	var param = {}
	if ( session_handle.dialog.conversation == undefined ) {
	    param = {
		dialog_id: dialog_id,
		input: session_handle.dialog.input}
	} else {
	    param = {
		dialog_id: dialog_id,
		input: session_handle.dialog.input,
		conversation_id: session_handle.dialog.conversation.conversation_id,
		client_id: session_handle.dialog.conversation.client_id
	    }
	}

	// Watson Dialog Service への問い合わせ
	dialog.conversation(param, function(err,conversation_reply) {
	    if (err) {console.log(err); throw err}

	    // Dialogのリプライは、配列を全部連結して、応答
	    reply = "";
	    for (var j=0;j < conversation_reply.response.length; j++) {
		if (conversation_reply.response[j].length > 0) {
		    if (reply.length) {
			reply = reply + "、";
		    }
		    reply = reply + conversation_reply.response[j];
		} else
		    break;
	    }
	    // セッション情報に対話IDを登録するため、情報を返すこと
	    session_handle.dialog.conversation = conversation_reply;
	    callback(null,{ phrase: reply, conversation: conversation_reply});
	    conversation_reply.dialog_id = dialog_id;
	    dialog.getProfile(conversation_reply, function(err, profile) {
		if (err) {
		    //console.log(err);
		    throw err;
		}
		//console.log("profile = ", profile);
		// Dialog終了を判定して、NLCチャットモードに戻す
		for(var i = 0; i < profile.name_values.length; i++) {
		    if (profile.name_values[i].name == 'Complete' &&
			profile.name_values[i].value == 'Yes') {
			///////////////////////////////////////////////////
			// ここにDIALOG で取得した内容に応じた処理を入れる
			///////////////////////////////////////////////////
			session_handle.mode = NLC_MODE;
			delete session_handle.dialog;
		    }
		}
	    });
	});
    });
}

// R&Rを利用した応答
function watson_rr(session_handle, callback) {

    console.log("=========== WATSON RR ===============");

    // ranker id を取得
    rr.listRankers({}, function(err, resp) {
	if (err) {
	    console.log('watson rr error: ', err);
	} else {
	    var rr_id = null;
	    for (var i = 0; i < resp.rankers.length; i++) {
		if (resp.rankers[i].name == session_handle.rr_name) {
		    rr_id = resp.rankers[i].ranker_id;
		    break;
		}
	    }
	    if (rr_id == null) {
		return;
	    }

	    rr_pra.config_name = rr_cnf.config_name;
	    rr_pra.collection_name = session_handle.sc_name
	    rr_pra.wt = 'json';

	    var query = qs.stringify({q: session_handle.input_text, ranker_id: rr_id, fl: 'id,title,body'});
	    var solrClient = rr.createSolrClient(rr_pra);
	    solrClient.get('fcselect', query, function(err, resp) {
		if(err) {
		    console.log('Error searching for documents: ' + err);
		    callback(null, { phrase: "該当の回答がありません" });
		}
		else {
		    if (resp.response.docs.length > 0) {
			if (__DEBUG) {
			    var msg = "回答の候補は、";
			    for (var i=0;i < resp.response.docs.length; i++) {
				console.log("R&R Candidate = ",resp.response.docs[i].id," ",resp.response.docs[i].title);
				if ( i < 3 ) {
				    msg = msg + "\n[" + resp.response.docs[i].id + "] " 
					+ resp.response.docs[i].title + "、";
				}
			    }
			    msg = msg + "\n[番号]を答えると内容を返すよ";
			    session_handle.mode = RR_MODE;
			    callback(null, { phrase: msg});
			} else {
			    callback(null, { phrase: resp.response.docs[0].body[0]});
			}
		    } else {
			callback(null, { phrase: "該当の回答がありません" });
		    }
		}
	    });
	}
    });
}


// R&R ID指定で、一つの文書を取得
function watson_retrieve(session_handle,callback) {

    var msg;
    var solrClient = rr.createSolrClient(rr_pra);
    var query = solrClient.createQuery();

    rr_pra.config_name = rr_cnf.config_name;
    rr_pra.collection_name = session_handle.sc_name
    rr_pra.wt = 'json';
    
    query.q({ 'id' : session_handle.input_text });    

    solrClient.search(query, function(err, searchResponse) {
	if(err) {
	    console.log('Error searching for documents: ' + err);
	}
	else {
	    //console.log('Found ' + searchResponse.response.numFound + ' documents.');
	    //console.log(JSON.stringify(searchResponse.response.docs, null, 2));
	    if ( searchResponse.response.numFound > 0) {
		msg = searchResponse.response.docs[0].body[0];
	    } else  {
		msg = "指定番号の文書がありませんでした";
	    }
	}
	callback(null, { phrase: msg});
    });
}



// Watson Visual Recognition
// npm install sleep-async
function watson_vr(session_handle, callback) {

    // ファイルのアップロードを待つ
    sleep.sleep(2000, function(){
	var params = {
	    images_file: fs.createReadStream(session_handle.image_file)
	};
	
	vr.classify(params, function(err, res) {
	    if (err) {
		console.log(err);
	    } else {
		console.log("vr_classify = ", JSON.stringify(res, null, 2));
		if (res.images[0].classifiers[0].classes.length > 0) {
		    if (res.images[0].classifiers[0].classes[0].class == 'person') {
			var params_face = {
			    images_file: fs.createReadStream(session_handle.image_file)
			};
			vr.detectFaces(params_face, function(err, res) {
			    if (err) {
				console.log(err);
			    } else {
				console.log("vr_face_detect = ", JSON.stringify(res, null, 2));
				var message;
				if (res.images[0].faces.length > 0) {
				    var age,sex;
				    if (res.images[0].faces[0].age.min != undefined) {
					age = res.images[0].faces[0].age.min;
				    } else {
					age = res.images[0].faces[0].age.max;
				    };
				    if (res.images[0].faces[0].gender.gender == "MALE") {
					sex = "男性";
				    } else {
					sex = "女性";
					if (age > 30) {
					    age = age - 5;  // rip service (^_^)/
					}
				    };
				    message = "この方は、"
					+ parseInt(res.images[0].faces[0].age.score *100)
					+ "％で"
					+ age
					+ "歳、"
					+ parseInt(res.images[0].faces[0].gender.score *100)
					+ "％で"
					+ sex
					+ "と判別されます";
				} else {
				    message = "お顔を検出できませんでした";
				}
				callback(null,{ phrase: message });
			    }
			});

		    } else {
			// 候補を列挙
			var message = "この画像は、"
			for (var i = 0; i < res.images[0].classifiers[0].classes.length; i++) {
			    message = message 
				+ parseInt(res.images[0].classifiers[0].classes[i].score * 100 ) 
				+ "％で "
				+ res.images[0].classifiers[0].classes[i].class + " "
			}
			message = message + "と認識されます。"
			callback(null,{ phrase: message });
		    }

		} else {
		    var message = "この画像を判別できませんでした m(_ _)m"
		    callback(null,{ phrase: message });
		}
	    }
	});
    });
    
}



// 全文検索した場合
function search_solr_collection(session_handle, callback) {
    console.log("=========== Solr Collection ===============");
    session_handle.mode = NLC_MODE;
    rr_pra.config_name = rr_cnf.config_name;
    rr_pra.collection_name = session_handle.sc_name
    rr_pra.wt = 'json';
    var solrClient = rr.createSolrClient(rr_pra);
    var query = solrClient.createQuery();
    query.q({ 'input text' : session_handle.input_text });
    
    solrClient.search(query, function(err, searchResponse) {
	if(err) {
	    console.log('Error searching for documents: ' + err);
	}
	else {
	    if ( searchResponse.response.numFound > 0) {
		msg = searchResponse.response.docs[0].body[0];
	    } else  {
		msg = "答えが見つかりませんでした。";
	    }
	}
	callback(null, { phrase: msg});
    });
}

