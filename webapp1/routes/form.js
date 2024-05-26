var express = require('express');
var router = express.Router();
var db_data;

function render(req, res, next) {
    res.render('form', { title: 'EX FORM', user: req.session.user, expressFlash: req.flash('success'), rec_data: db_data });
}

router.get('/', function(req, res, next) {
    db_data = { id: "X2341", name: "JJ" };
    render(req, res, next);
});

router.post('/', function(req, res, next) {
    render(req, res, next);
});


module.exports = router;
