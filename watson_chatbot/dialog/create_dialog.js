#!/usr/bin/env node
//
// XMLのダイアログファイルをWatson Dialog に読ませ 
// dialog_id.json のファイルを作成する
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

var itemno = 4;
var params = {
    name: cnf.dialogs[itemno].name,
    file: fs.createReadStream(cnf.dialogs[itemno].file),
    language: cnf.dialogs[itemno].lang
}

dialog.createDialog( params, function(err,resp) {
    if (err) {
	console.log("Watson dialog err = ",err);
    } else {
	console.log("response = ", resp);
	resp.name = cnf.name;
	fs.writeFile( "dialog_id.json", JSON.stringify(resp,null,'  '));
    }
});
