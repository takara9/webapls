var client = {
    client_id:      "oauth-client-3",
    client_secret:  "oauth-client-secret-3",
    client_home:    "http://localhost:3000",
    scope:          "openid profile email phone address"
};

var authServer = {
    id_token_iss:            'http://localhost:5810/',
    authorizationEndpoint:   'http://localhost:5810/authorize',
    tokenEndpoint:           'http://localhost:5810/token',
    userInfoEndpoint:        'http://localhost:5810/userinfo',
    jwtPublicKey:            'http://localhost:5810/publickey'
};

var aplServer  = 'http://localhost:9000/test';
var aplServer2 = 'http://localhost:9000/private';


//
// 正しいアクセストークンでアクセステスト
//
function getApi1() {
    console.log("getApi1()")

    var access_token = localStorage.getItem('access_token');
    console.log("access_token = " + access_token);
    if (access_token == null) {
	return;
    }
    
    var xhr = new XMLHttpRequest();
    xhr.open("GET", aplServer);
    xhr.setRequestHeader('content-type', "application/json");
    xhr.setRequestHeader('Authorization', 'Bearer ' + access_token);
    xhr.setRequestHeader('Access-Control-Allow-Origin', "*");      
    xhr.send();

    xhr.onreadystatechange = function () {
	if(xhr.readyState === XMLHttpRequest.DONE) {
	    var status = xhr.status;
	    if (status === 0 || (status >= 200 && status < 400)) {
                console.log("リクエストが正常に終了した");
                var obj = JSON.parse(xhr.responseText);
		console.log(obj.test);
		alert("レスポンス = " + obj.test);		
            } else {
                console.log("リクエストでエラーが発生");
            }
	}
    }
}

//
// 不正に書き換えたトークンでアクセステスト
//
function getApi2() {
    console.log("getApi2()")
    // ヘッダーにAccess Token をセットしてデータを取得
    var access_token = localStorage.getItem('access_token')
    if (access_token == null) {
	return;
    }
    // アクセストークンの不正操作
    //   有効期限の書き換え
    access_token = access_token.split('.');
    console.log("access_token payload = " + access_token[1]);
    var decoded_pl = atob(access_token[1]);
    console.log("decoded payload = " + decoded_pl);
    var obj_pl = JSON.parse(decoded_pl);
    console.log("json payload = " + obj_pl.exp);

    // 有効期限を100日に変更
    obj_pl.exp = Math.floor(Date.now()/1000) + (3600*24*100);

    // 再度アクセストークンを組み立て
    var text_pl = JSON.stringify(obj_pl); 
    access_token[1] = btoa(text_pl);
    console.log("access_token = " + access_token.length);
    var at = null;
    for (i = 0; i < access_token.length; i++) {
	if (i == 0) {
	    at = access_token[i];
	} else {
	    at += "." + access_token[i];
	}
    }

    // アクセス要求
    var xhr = new XMLHttpRequest();
    xhr.open("GET", aplServer);
    xhr.setRequestHeader('content-type', "application/json");
    xhr.setRequestHeader('Authorization', 'Bearer ' + at);
    xhr.setRequestHeader('Access-Control-Allow-Origin', "*");      
    xhr.send();

    xhr.onreadystatechange = function () {
	if(xhr.readyState === XMLHttpRequest.DONE) {
	    var status = xhr.status;
            var obj = JSON.parse(xhr.responseText);
            console.log(obj.test);
	    if (status === 0 || (status >= 200 && status < 400)) {
                console.log("リクエストが正常に終了した");
            } else {
                console.log("リクエストでエラーが発生");
            }
	    alert("レスポンス = " + obj.test);
	}
    }
}

//
// access_tokenをヘッダに付与して、保護コンテンツを
//   認可されない場合はエラーを表示
//
function getApi3() {
    console.log("getApi3()")
    var xhr = new XMLHttpRequest();
    xhr.open("GET", aplServer2);
    xhr.setRequestHeader('content-type', "application/json");
    xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem('access_token'));
    xhr.setRequestHeader('Access-Control-Allow-Origin', "*");      
    xhr.send();

    xhr.onreadystatechange = function () {
	if(xhr.readyState === XMLHttpRequest.DONE) {
	    var status = xhr.status;
	    if (status === 0 || (status >= 200 && status < 400)) {
                console.log("リクエストが正常に終了した");
		console.log(xhr.responseText);
		var reply = document.getElementById('reply');
		reply.innerHTML = xhr.responseText;
            } else {
                console.log("リクエストでエラーが発生");
            }
	}
    }
}


//
// access_tokenをヘッダに付与して、保護コンテンツをアクセス
//　 認可されない場合は認証画面へジャンプ
//
function getApi4() {
    console.log("getApi4()")
    var xhr = new XMLHttpRequest();
    xhr.open("GET", aplServer2);
    xhr.setRequestHeader('content-type', "application/json");
    xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem('access_token'));
    xhr.setRequestHeader('Access-Control-Allow-Origin', "*");      
    xhr.send();

    xhr.onreadystatechange = function () {
	if(xhr.readyState === XMLHttpRequest.DONE) {
	    var status = xhr.status;
	    if (status === 0 || (status >= 200 && status < 400)) {
                console.log("リクエストが正常に終了した");
		console.log(xhr.responseText);
		var reply = document.getElementById('reply');
		reply.innerHTML = xhr.responseText;
            } else {
		// 認証要求を作成して認証サーバーへの認証画面へジャンプ
		var params = createAuthnReq("/");
		window.location = authServer.authorizationEndpoint + "?" + params;
            }
	}
    }
}




//
// 認証要求のクエリーストリングを作成する
//
//  リダイレクト先は複数存在する。割り込んだ場合
//
function createAuthnReq(callback_path) {
    redirect = client.client_home + callback_path
    var state = uuid()
    localStorage.setItem('oidc_state', state);
    var authorizeUrl = {
	response_type: "code",
	'scope': client.scope,
	'client_id': client.client_id,
	'redirect_uri': redirect,
	'state': state
    }
    return new URLSearchParams(authorizeUrl);
}


//
// UUID生成器
//
function uuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
	var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
	return v.toString(16);
    });
}

//
// ログインしているかどうかをチェック
//
function checkLogin() {
    return localStorage.getItem('access_token') != null
}

//
// JWTのペイロードを取り出し
//
function parseJwt(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
};

//
// JWTのヘッダーを取り出し
//
function parseHeader(token) {
    var base64Url = token.split('.')[0];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
};

//
// id_token有効期限チェック
//
function checkExpair() {
    xidt = localStorage.getItem('id_token_payload')
    console.log(xidt);
    idt = JSON.parse(xidt);
    if (idt != null) {
	console.log(idt.exp);
	console.log(Math.floor(Date.now()/1000));
	console.log(idt.exp - Math.floor(Date.now()/1000));
	if (idt.exp < Math.floor(Date.now()/1000)) {
	    doLogout()
	}
	return idt.name
    }
}

// ログアウト
//  ローカルストレージのトークン消去
//
function doLogout() {
    console.log("Logout")
    localStorage.removeItem('id_token_payload');
    localStorage.removeItem('id_token_header');    
    localStorage.removeItem('access_token');
    localStorage.removeItem('oidc_state');
    //alert("Logout");
    window.location = "/";
}


// state をチェック
// 自分で発行した state が一致していれば続行
//
// code を付与してaccess_token, id_token を取得する
// 取得したtokenはローカルストレージに保存する
var queryString = window.location.search;      
var urlParams = new URLSearchParams(queryString);
var state = urlParams.get('state')
console.log("state = " + state);
var code = urlParams.get('code')
console.log("code = " + code);
var redirect_uri = urlParams.get('redirect_uri')
console.log("redirect_uri = " + redirect_uri);
console.log("LOGIN = " + checkLogin());

// access_token, id_token の発行依頼作成
if (checkLogin() == false && code != null) {
    console.log("CALLBACK")    
    var formData = jQuery.param({
	grant_type: 'authorization_code',
	code: code,
	redirect_uri: redirect_uri
    });
    console.log("formData = " + formData);
    
    var clientId = "oauth-client-3";
    var clientSecret = "oauth-client-secret-3";
    var authorizationBasic = window.btoa(clientId + ':' + clientSecret);
    
    // トークン発行依頼送信
    var xhr = new XMLHttpRequest();
    xhr.open("POST", authServer.tokenEndpoint);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
    xhr.setRequestHeader('Authorization', 'Basic ' + authorizationBasic);
    xhr.setRequestHeader('Access-Control-Allow-Origin', "*");      
    xhr.send(formData);

    /*
      トークンを受けた後の処理
    */
    xhr.onreadystatechange = function () {
	// ローカルファイルでは、 Mozilla Firefox で成功するとステータスは0になります
	if(xhr.readyState === XMLHttpRequest.DONE) {
	    var status = xhr.status;
	    if (status === 0 || (status >= 200 && status < 400)) {
		// リクエストが正常に終了した
		console.log(xhr.responseText);
		var obj = JSON.parse(xhr.responseText);
		console.log(obj.access_token);
		console.log(obj.scope);
		console.log(obj.id_token);
		
		// アクセストークンをローカルストレージに保存
		localStorage.setItem('access_token', obj.access_token);
		
		// IDトークンをバリデーションしてローカルストレージに保存
		if (typeof obj.id_token !== 'undefined') {
		    // IDトークンを公開鍵でベリファイする
		    // 各項目をチェックして合格したらローカルストレージへ保存
		    var xhr2 = new XMLHttpRequest();
		    // false は同期処理のリクエスト
		    xhr2.open( "GET", authServer.jwtPublicKey, false );
		    xhr2.send( null );
		    console.log("public-key = " + xhr2.responseText);
		    // JWTの検証
		    var payload = parseJwt(obj.id_token);
		    console.log(payload);
		    var header = parseHeader(obj.id_token);
		    console.log(header);
		    //
		    // 署名の検証は一旦パスする
		    // 
		    console.log(payload.exp);
		    console.log(Math.floor(Date.now()/1000));

		    if (payload.exp >= Math.floor(Date.now()/1000)) {
			if (payload.iat <= Math.floor(Date.now()/1000)) {
			    localStorage.setItem('id_token_payload', JSON.stringify(payload));
			    localStorage.setItem('id_token_header', JSON.stringify(header));
			}
		    }
		    //
		    // リダイレクト
		    //
		    //window.location = redirect_uri;
		}
		var x = localStorage.getItem('id_token_payload');
		console.log(x);
	    } else {
		console.log("リクエストでエラーが発生");
	    }
	}
    };
};





