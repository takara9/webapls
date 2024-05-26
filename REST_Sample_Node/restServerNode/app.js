#!/usr/bin/env node
/*
   RESTサービスのサンプルコード
   sha1, sha256, md5 のダイジェストを作るマイクロサービス
*/
var express = require('express');
var app = express();
var debug = require('debug')('app');
var port = parseInt(process.argv[2]);
//var port = parseInt(process.env.PORT || '3000');
var fs = require("fs");
outfile = '/dev/null';
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

function create_string(len,callback) {
    fs.readFile('data.txt', 'utf8', function (err, data) {
	if (err) {
            throw err;
	}
	var cl = data.length -1;
	var r = "";
	for(var i=0; i<len; i++){
	    r += data[Math.floor(Math.random()*cl)];
	}
	callback(r);
    });
}


// for Health Check
app.get('/', function(req, res) {
    res.send('hello world');
});


app.get('/end', function(req, res) {
    res.send('terminated');
    process.exit();
});


app.get('/heavy', function(req, res) {

    var i = 0;
    var m = 4000;
    var n = 1000;
    var c = create_string(10,function(c){
	//console.log("c=", c);
	var x = "";
	for (i=0; i < m; i++) {
	    for (j = i; j < n; j++) {
		x += c;
	    }
	}
	res.send('done');
	fs.writeFile(outfile, x);
	//console.log("DONE");
    });
});



// BASIC認証
var auth = require('express-basic-auth')
var route = express.Router();
route.use(auth({authorizer: authorizer}));
app.use('/', route);
function authorizer(u,p) {
    if (u == 'takara' && p == 'hogehoge' ) {
	return true;
    } else {
	return false;
    }
}


// ダイジェストサービス
route.post('/hash', function(req, res) {
    var crypto = require('crypto');
    //console.log("body = ", req.body);
    json = req.body;

    //console.log("username = ", req.auth.user);
    //console.log("password = ", req.auth.password);
    //console.log("textbody = ", json.textbody);

    var sha256 = crypto.createHash('sha256');
    sha256.update(json.textbody);
    var x256 = sha256.digest('hex');

    var sha1 = crypto.createHash('sha1');
    sha1.update(json.textbody);
    var x128 = sha1.digest('hex');

    var md5 = crypto.createHash('md5');
    md5.update(json.textbody);
    var xmd5 = md5.digest('hex');

    res.send({'sha256': x256, 'sha1': x128, 'md5': xmd5});
});


// イベント待機 
app.listen(port);
