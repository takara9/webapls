#!/usr/bin/env node
//
// Solr clusterの設定を登録する
// 
// 2016/3/28 Maho Takara
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


query.q({ 'id' : 101 });
console.log(query);

solrClient.search(query, function(err, searchResponse) {
    if(err) {
	console.log('Error searching for documents: ' + err);
    }
    else {
	console.log('Found ' + searchResponse.response.numFound + ' documents.');
	console.log(JSON.stringify(searchResponse.response.docs, null, 2));
    }
});

