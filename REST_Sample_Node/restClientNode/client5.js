#!/usr/bin/env node
/*
   RESTクライアント
*/
var request = require('request')

var url = 'http://127.0.0.1:3000'
//var url = 'https://nodehashxx.mybluemix.net'

// GET
var dispGet = function(err, res, body) {
    console.log("\nGET");
    if (err) {
	console.log("err = ", err)
    } else if (res.statusCode != 200) {
	console.log("status = ", res.statusCode)
    } else if (res.statusCode === 200) {
	console.log("text   = ", body)
    }
};
request.get(url,dispGet)



// POST
var uri = url + "/hash"
var form = { 
    form: { 
	textbody: 'Hello World'
    },
    auth: {
	user: "takara",
	password: "hogehoge"
    }
};
request.post(uri, form, function (err, res, body) {
    console.log("\nPOST");
    if (err) {
	console.log("err = ", err)
    } else if (res.statusCode != 200) {
	console.log("status = ", res.statusCode)
    } else if (res.statusCode === 200) {
	console.log("status = ", res.statusCode)
	json = JSON.parse(body)
	console.log("sha1   = ", json.sha1)
	console.log("sha256 = ", json.sha256)
	console.log("md5    = ", json.md5)
    }
})


