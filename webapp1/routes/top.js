var express = require('express');
var router = express.Router();

function render(req, res, next) {
    res.render('top', { title: 'トップページ', user: req.session.user, expressFlash: req.flash('success')});
}

router.get('/', function(req, res, next) {
    render(req, res, next);
});

router.post('/', function(req, res, next) {
    render(req, res, next);
});


module.exports = router;
