#!/usr/bin/env node
/*
   RESTクライアント
*/
var request = require('request')


//var url = 'http://127.0.0.1:3000'
var url = 'https://nodehashxx.mybluemix.net'


// GET
var dispGet = function(err, res, body) {
    console.log("\nGET");
    if (err) {
	console.log("err = ", err);
    } else if (res.statusCode != 200) {
	console.log("status = ", res.statusCode);
    } else if (res.statusCode === 200) {
	console.log("text   = ", body)
    }
};
request.get(url,dispGet);


// POST
var dispPost = function(err, res, body) {
    console.log("\nPOST");
    if (err) {
	console.log("err = ", err);
    } else if (res.statusCode != 200) {
	console.log("status = ", res.statusCode);
    } else if (res.statusCode === 200) {
	console.log("status = ", res.statusCode)
	console.log("sha1   = ", body.sha1)
	console.log("sha256 = ", body.sha256)
	console.log("md5    = ", body.md5)
    }
};

var options = {
    url: url + "/hash",
    method: 'POST',
    headers: {
	'Content-Type':'application/json'
    },
    auth: {
	user: "takara",
	password: "hogehoge"
    },
    json: true,
    form: {
        textbody: 'Hello World'
    }
};
request.post(options, dispPost);




