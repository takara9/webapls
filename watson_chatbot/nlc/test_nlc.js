#!/usr/bin/env node
//
// Watson NLCのインスタンスをテストする
//   クラス判定するテキストは、本ファイルを編集する
//
// 作者 Maho Takara    takara@jp.ibm.com
//
// Copyright (C) 2016 International Business Machines Corporation 
// and others. All Rights Reserved. 
// 
// 2016/8/15  初版
//

var fs = require('fs');
var watson = require('watson-developer-cloud');
var wnc = require('./watson_nlc_credentials.json');
var cnf = require('./nlc_config.json');
var params = require('./nlc_id.json');
var nlc = watson.natural_language_classifier(wnc.credentials);

params.text = '今日は暑くなりますか？';
nlc.classify( params,
  function(err, response) {
    if (err) {
	console.log('nlc error = ', err);
    } else {
	console.log(JSON.stringify(response, null, 2));
    }
});

