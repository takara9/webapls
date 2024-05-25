var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    msg = [
        { user_id: 'halu',
          sex: 'f',
          age: 20
        },
	{ user_id: 'yuki',
	  sex: 'f',
	  age: 33
	}
    ]
    res.send(msg);
});

module.exports = router;
