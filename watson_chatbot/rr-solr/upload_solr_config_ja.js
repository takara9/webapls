#!/usr/bin/env node
//
//  Apache Solr Cluster の設定を登録する
//   設定ファイルをzipでまとめて登録する
//   登録する前に、
//   zipファイルを作るためmake_config_pkg.shを実行する
//
//  作者 Maho Takara    takara@jp.ibm.com
//
// Copyright (C) 2016 International Business Machines Corporation 
// and others. All Rights Reserved. 
// 
// 2016/8/15  初版
//
//

var fs     = require('fs');
var auth   = require('./watson.rtrv_rank.auth.json');
auth.credentials['version'] = 'v1';
var watson = require('watson-developer-cloud');
var retrieve_and_rank = watson.retrieve_and_rank(auth.credentials);
var params = require('./cluster_id.json');
var rr_cnf = require('./rr_config.json');
    
params.config_name = rr_cnf.config_name;
params.config_zip_path = rr_cnf.config_zip_path;

retrieve_and_rank.uploadConfig( params,
   function (err, response) {
       if (err)
           console.log('upload config error:', err);
       else
           console.log(JSON.stringify(response, null, 2));
});

