#!/usr/bin/env node
//
// Solrの単体テストする。 Rankerを入れないでテスト
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
var rr_cnf = require('./rr_config.json');
var params = require('./cluster_id.json');
params.collection_name = rr_cnf.collection_name;
params.wt = 'json';

var solrClient = retrieve_and_rank.createSolrClient(params);
var query = solrClient.createQuery();

var qtext = 'RRとは何ですか';
//var qtext = 'RRの利用料金は';
console.log("質問= " + qtext);

query.q({ 'input text' : qtext });
var sw = 1;

solrClient.search(query, function(err, searchResponse) {
    if(err) {
	console.log('Error searching for documents: ' + err);
    }
    else {
	console.log('Found ' + searchResponse.response.numFound + ' documents.');
	if (sw) {
	    console.log('---------');
	    for (var i=0;i<searchResponse.response.docs.length;i++) {
		console.log("[" + searchResponse.response.docs[i].id + "] ",
			    searchResponse.response.docs[i].title[0]);	    
	    }
	    console.log('---------');
	} else {
	    console.log(JSON.stringify(searchResponse.response.docs, null, 2));
	}

    }
});

