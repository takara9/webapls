#!/usr/bin/env node
//
// データをアップロードして、インデックスを生成する
//
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
var auth   = require('./watson.rtrv_rank.auth.json');
auth.credentials['version'] = 'v1';
var watson = require('watson-developer-cloud');
var retrieve_and_rank = watson.retrieve_and_rank(auth.credentials);
var params = require('./cluster_id.json');
var rr_cnf = require('./rr_config.json');

params.collection_name = rr_cnf.collection_name;

solrClient = retrieve_and_rank.createSolrClient(params);
console.log('Uploading documents ...');
var path = rr_cnf.docs_path;
var files = fs.readdirSync(path);

for ( var i = 0; i < files.length; i++) {
    console.log(i + ":" + files[i]);
    filepath = path + "/" + files[i];
    doc = fs.readFileSync(filepath,'utf8');
    doc = JSON.parse(fs.readFileSync(filepath,'utf8'));

    solrClient.add(doc, function (err, response) {
	if (err) {
	    console.log('Error indexing document: ', err);
	}
	else {
	    console.log('Indexed a document.');
	    solrClient.commit(function(err) {
		if(err) {
		    console.log('Error committing change: ' + err);
		}
		else {
		    console.log('Successfully committed changes.');
		}
	    });
	}
    });
}

