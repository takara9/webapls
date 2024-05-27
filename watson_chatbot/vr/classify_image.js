#!/usr/bin/env node
//
// Visual Recognition 単体テスト用
//  
//
// 作者 Maho Takara    takara@jp.ibm.com
//
// Copyright (C) 2016 International Business Machines Corporation 
// and others. All Rights Reserved. 
// 
// 2016/8/15  初版
//

var watson = require('watson-developer-cloud');
var fs = require('fs');
var cred = require('./visual_recognition_credentials.json');


var visual_recognition = watson.visual_recognition(cred.credentials);

var params = {
    images_file: fs.createReadStream('./images/4731676339795.jpg')
};

visual_recognition.classify(params, function(err, res) {
  if (err)
    console.log(err);
  else
    console.log(JSON.stringify(res, null, 2));
});
