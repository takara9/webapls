#!/usr/bin/env node
//
// RankerのトレーニングデータをCSVファイルから作成する
// 生成したトレーニングデータでrankerのトレーニングを開始する
//     トレーニングの状況はget_ranker_info.jsで確認する
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

var watson = require('watson-developer-cloud');
var fs = require('fs');
var async = require('async');
var request = require('request');
//require('request-debug')(request);
var auth   = require('./watson.rtrv_rank.auth.json');
var params = require('./cluster_id.json');
var rr_cnf = require('./rr_config.json');

var urlparam = "&generateHeader=true"
    + "&rows=10"
    + "&returnRSInput=true"
    + "&wt=json";

var uri = auth.credentials.url
    + '/v1/solr_clusters/' 
    + params.cluster_id
    + '/solr/' 
    + rr_cnf.collection_name 
    + '/fcselect';

async.series([
    function(callback) {

	try {
	    fs.truncateSync(rr_cnf.training_raw, 0);
	} catch(e) {
	    console.log("e = ", e);
	}

	fs.readFile(rr_cnf.training_csv, 'utf8', function(err, fileData) {
	    lines = fileData.split('\n');
	    console.log("lines = ", lines.length);

	    async.each(lines, function(line,next) {
		fields = line.split(',');

		var gt = fields[1];
		for (var j = 2; j < fields.length; j++) {
		    if (fields[j].length > 0 ) {
			gt = gt + ',' + fields[j]
		    }
		}
		
		var options = {
		    uri: uri,
		    headers: {'Content-Type': 'application/x-www-form-urlencoded' },
		    form: 'q=' + fields[0] + '&gt=' + gt + urlparam
		};

		console.log(options);
		
		header = 0;
		request.post(options, function(error, response, body){
		    if (!error && response.statusCode == 200) {
			res = JSON.parse(body);
			console.log("rest = ",res);
			if (res.response.numFound > 0) {
			    var line = res.RSInput.split('\n');
			    for (var i = header; i < line.length-1; i++) {
				//console.log(i, line[i]);
				fs.appendFileSync(rr_cnf.training_raw, line[i] + '\n', 'utf8');
			    }
			    header = 1;
			}
		    } else {
			console.log('soler error: '+ response.statusCode);
			console.log('error question = ', 'q=' + fields[0] + '&gt=' + gt + urlparam);
		    }
		    next();
		}).auth(auth.credentials.username,auth.credentials.password, false);
	    }, function complete(err) {
		callback(null);
	    });

	});
    }
],function(err,results) {

    auth.credentials['version'] = 'v1';
    var retrieve_and_rank = watson.retrieve_and_rank(auth.credentials);
    var params = {
	training_data: fs.createReadStream(rr_cnf.training_raw),
	training_metadata: JSON.stringify({name: rr_cnf.ranker_name})
    };

    retrieve_and_rank.createRanker(params,function(err, response) {
	if (err) {
	    console.log('watson rr error: ', err);
	} else {
	    console.log(JSON.stringify(response, null, 2));
	    fs.writeFile( "ranker_id.json", JSON.stringify(response,null,'  '));
	}
    });

});






