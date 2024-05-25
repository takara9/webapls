var users = { 'tkr': 'password' };  // ユーザーパスワード

module.exports = function(req, res, next) {

    var method = req.method.toLowerCase();
    var user = req.body;
    var logout = (method === 'post' && req.url === '/logout');
    var login = (method === 'post' && user && req.url != '/logout');

    // ログアウト
    if (logout) {
	delete req.session.user;
    }

    // ログイン
    if (login) {
	Object.keys(users).forEach(function(name) {
	    if (user.name === name && user.pwd === users[name]) {
		req.session.user = {
		    name: user.name,
		    pwd: user.pwd
		};
	    } else {
		console.log("SET req.flash");
		req.flash('success', 'ログイン失敗、ユーザー名またはパスワードが誤りです。');
	    }
	});
    }
    
    // セッションが無ければ ログイン画面へ
    if (!req.session.user) {req.url = '/'}

    next();
}
