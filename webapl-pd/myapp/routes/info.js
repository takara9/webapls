var express = require('express');
var router = express.Router();
var os = require('os');


router.get('/', function(req, res, next) {
    var networkInterfaces = os.networkInterfaces();    
    //console.log(networkInterfaces.eth0[0].cidr);
    msg = {
	hostname: process.env.HOSTNAME,
	ip: networkInterfaces.eth0[0].cidr,
	host: req.headers.host,
	agent: req.headers['user-agent'],
    }	
    res.send(msg);
});

module.exports = router;
