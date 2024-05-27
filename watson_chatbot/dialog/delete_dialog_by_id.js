#!/usr/bin/env node
//
// このコードの中のdialog_idを編集してインスタンスを削除する
// dialog_id を知るには、list_dialogs.js を実行すると良い
//
// 作者 Maho Takara    takara@jp.ibm.com
//
// Copyright (C) 2016 International Business Machines Corporation 
// and others. All Rights Reserved. 
// 
// 2016/8/15  初版
//
//

var fs     = require('fs');
var watson = require('watson-developer-cloud');
var auth   = require('./watson_dialog_credentials.json');
var cnf    = require('./dialog_config.json');
var dialog = watson.dialog(auth.dialog[0].credentials);

var params = {
    dialog_id: 'b7d3e91e-55c8-4a74-8ec0-b1067c6f063c'
}

dialog.deleteDialog(params, function(err,resp) {
    if (err) {
	console.log("Watson dialog error = ", err);
    } else {
	console.log("resp = ", resp);
    }
})




