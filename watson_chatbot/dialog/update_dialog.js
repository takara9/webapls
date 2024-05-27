#!/usr/bin/env node
//
// dialog_id.json を読んで、Dialogの定義XMLの更新する
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
var params = require('./dialog_id.json');
var dialog = watson.dialog(auth.dialog[0].credentials);

var itemno = 2;
params.file = fs.createReadStream(cnf.dialogs[itemno].file),

dialog.updateDialog(params, function(err, resp) {
    if (err) {
	console.log("watson dialog err = ", err);
    } else {
	console.log("resp = ", resp);
    }
});



