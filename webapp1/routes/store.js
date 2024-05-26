var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  console.log("GET");
  console.log("id   = ", req.session.id);
  console.log("name = ", req.session.name);
  res.send('respond with a resource');
  //render(req, res, next);
});


router.post('/', function(req, res, next) {
  console.log("POST");
  //console.log("req = ", req.body);
  console.log("id   = ", req.body.id);
  console.log("name = ", req.body.name);
  res.send('respond with a resource');
  //render(req, res, next);
});

module.exports = router;
