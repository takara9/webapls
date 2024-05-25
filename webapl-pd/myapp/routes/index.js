var express = require('express');
var router = express.Router();
var os = require('os');

/* GET home page. */
router.get('/', function(req, res, next) {
    var networkInterfaces = os.networkInterfaces();        
    res.render('index', {
	title: "POD問題判別用コンテナ",
	hostname: process.env.HOSTNAME,
	ip: networkInterfaces.eth0[0].cidr,	
	host: req.headers.host,
	agent: req.headers['user-agent'],
	env: process.env
    });
});

module.exports = router;
