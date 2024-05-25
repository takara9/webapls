#!/usr/bin/env python
# -*- coding:utf-8 -*-
#
# 認証認可サーバー
#
import os
import uuid
import json
import hashlib
import requests
import time
import base64

import auth_config as cf

# Flaskフレームワーク関連
from flask import Flask,render_template,make_response,request,send_from_directory,redirect,send_file
from flask_restful import Resource,Api,reqparse
from flask_httpauth import HTTPBasicAuth
# https://flask-cors.readthedocs.io/en/latest/
from flask_cors import CORS

# OAuth2関連
#import python_jwt as jwt, jwcrypto.jwk as jwk, datetime
from authlib.jose import jwt

# LDAP関連
from ldap3 import Server, Connection, ALL
from pySSHA import ssha
from base64 import b64encode as encode
from base64 import b64decode as decode

# URL操作
import urllib.parse

# アクセストークンDB MongoDB
from pymongo import MongoClient
from datetime import datetime

#MONGO_SERVER   = 'mongo'
#MONGO_PORT     = 27017
#MONGO_DATABASE = 'oidc_database'
#MONGO_COLLECTION_ACCESS_TOKEN = "access_token"
#MONGO_COLLECTION_CLIENTS = "clients"
#MONGO_COLLECTION_USERINFO = "userinfo"


client = MongoClient(cf.MONGO_SERVER, cf.MONGO_PORT)
db = client[cf.MONGO_DATABASE]
col_atoken = db[cf.MONGO_COLLECTION_ACCESS_TOKEN]
col_clients = db[cf.MONGO_COLLECTION_CLIENTS]
col_userinfo = db[cf.MONGO_COLLECTION_USERINFO]

# LDAP関連
from ldap3 import Server, Connection, ALL
from pySSHA import ssha
from base64 import b64encode as encode
from base64 import b64decode as decode
#LDAP_SERVER='ldap.labo.local'
#LDAP_PORTNO=636
#USE_LDAPS=True
#LDAP_DOMAIN='dc=labo,dc=local'
#LDAP_USER='cn=Manager,dc=labo,dc=local'
#LDAP_PASSWD='secret'


# 認証サーバーのアドレス
#OAUTH_SERVER_URL='http://localhost:5810/' 



# Flaskの初期化
#  ブラウザのJavaScriptからヘッダー Authorization を読み取れるようにするための設定を加える
#  Cross-Origin Resource Sharing (CORS) を設定して、他オリジンからのアクセスを許可する
#    参考 https://flask-cors.readthedocs.io/en/latest/
#
app = Flask(__name__, static_url_path='/public')
app.config['CORS_EXPOSE_HEADERS'] = "*"
CORS(app)

auth = HTTPBasicAuth()
codes = {}
requests = {}


#-------------------------------------
# 関数 ユーザー名から取得
def get_userinfo(user):
    return col_userinfo.find_one({'uid': user},{"_id": 0})

# 関数 ランダム文字列生成
import random, string
def get_random_string(n):
   return ''.join(random.choices(string.ascii_letters + string.digits, k=n))


# 関数 client_id のチェック
#   
def check_client_id(client_id):
    return col_clients.find_one({'client_id': client_id},{"_id": 0}) != None

# 関数 リダイレクト先指定のチェック
def check_redirect(client_id,redirect_uri):
    doc = col_clients.find_one({'client_id': client_id},{"_id": 0})
    if doc == None:
        return False
    for uri in doc['redirect_uris']:
        if uri == redirect_uri:
            return True
    return False
    
# 関数 スコープのチェック
def check_scope(client_id,scope):
    doc = col_clients.find_one({'client_id': client_id},{"_id": 0})
    if doc == None:
        return False
    cscope = doc['scope'].split(" ")
    rscope = scope.split(" ")
    for req in rscope:
        if req not in cscope:
            return False
    return True

# 関数 クライアントid とsecret のチェック
def check_client_secret(client_id,client_secret):
    query = {"client_id": client_id, "client_secret": client_secret}
    return col_clients.find_one(query,{"_id": 0}) != None


# 関数 クライアントIDからパスワードを得る
@auth.get_password
def get_pw(client_id):
    doc = col_clients.find_one({'client_id': client_id},{'_id': 0,'client_secret': 1 })
    if doc != None:
        return doc['client_secret']
    else:
        return None

    
# 関数 ログインをLDAPサーバーの応答と比較する
def valid_login(user_id,passwd):
    server = Server(cf.LDAP_SERVER, port=cf.LDAP_PORTNO, use_ssl=cf.USE_LDAPS)
    conn = Connection(server, cf.LDAP_USER, cf.LDAP_PASSWD, auto_bind=True)
    user_filter = '(&(objectclass=inetOrgPerson)(uid=%s))' % (user_id)
    conn.search(cf.LDAP_DOMAIN, user_filter, attributes=['uid','userPassword'])
    for entry in conn.entries:
        data_json = json.loads(entry.entry_to_json())
        app.logger.debug("==================")
        app.logger.debug(data_json)
        app.logger.debug("==================")        
        ssha_pw = data_json['attributes']['userPassword'][0]
        check = ssha.checkPassword( passwd, ssha_pw, suffixed = True, salt_size = 4, debug = 3)
        return check

def search_ldap(user_id):
    server = Server(cf.LDAP_SERVER, port=cf.LDAP_PORTNO, use_ssl=cf.USE_LDAPS)
    conn = Connection(server, cf.LDAP_USER, cf.LDAP_PASSWD, auto_bind=True)
    user_filter = '(&(objectclass=inetOrgPerson)(uid=%s))' % (user_id)
    conn.search(cf.LDAP_DOMAIN, user_filter, attributes=['uid','sn','cn','ou','userPassword'])
    for entry in conn.entries:
        data_json = json.loads(entry.entry_to_json())
        app.logger.debug("xxxxxxxxxxxxxxxxxx")
        app.logger.debug(data_json)
        app.logger.debug(data_json['attributes'])
        app.logger.debug("xxxxxxxxxxxxxxxxxx")
        return data_json['attributes']


#
# JWT生成 アクセストークン
#
def create_access_token(apl_id,user_id):
    app.logger.debug("create_access_token  ")
    header = {
        'typ': 'JWT',        
        'alg': 'RS256',
        'kid': 'authserver',
    }

    payload = {
        "iss": "Auth_Server",
        "sub": apl_id,
        "aud": user_id,
        'iat': int(time.time()),         # 現在時刻
        'exp': int(time.time()) + 3600,  # 有効期限時刻 1時間
        "scope": "openid profile email address phone read:appointments"
    }

    with open('key-private.pem', 'rb') as f:
        key = f.read()

    return jwt.encode(header, payload, key).decode()
    
    
#-------------------------------------
#
# ダミーのトップページを表示
#    認証認可サーバーであることを表示
#
@app.route('/')
def home():
    return render_template('index.html', title='plane-test', name="home") 


#
# 公開鍵の配布
#
@app.route('/publickey')
def download_file():
    path = "/app/key-public.pem"
    return send_file(path)
    

#
# 認証と認可
#
#   クライアント（アプリ）からの要求を受けて、
#   認証画面（ログイン）フォームを表示する
#
#  不正アクセス防止のチェックで問題が検知されたら error をつけて
#  リダイレクト先へリクエストを送る
#
@app.route('/authorize')
def authorize():
    app.logger.debug(request.url)
    app.logger.debug(request.method)
    qs = urllib.parse.urlparse(request.url)
    query = dict(urllib.parse.parse_qsl(qs.query))
    app.logger.debug(query)
    
    # reqid を生成して、/authn でチェックする
    # フォームの隠しフィールドにreqid をセットして、次でチェックする。
    reqid = get_random_string(8)
    

    app.logger.debug("client_id = " + query['client_id'])
    #app.logger.debug("client_secret = " + query['client_secret'])
    app.logger.debug("redirect_uri = " + query['redirect_uri'])
    app.logger.debug("scope = " + query['scope'])
    app.logger.debug("state = " + query['state'])
    app.logger.debug("response_type = " + query['response_type'])    
    app.logger.debug("reqid = " + reqid)

    # クライアントIDの存在チェック
    #   クライアントID（アプリID)は、事前に認証サーバーに登録されていないといけない
    if check_client_id(query['client_id']) == False:
        app.logger.debug('Unknown client = ' + query['client_id'])
        resp = { 'error': 'Unknown client' }
        url = query['redirect_uri'] + "?" + urllib.parse.urlencode(resp)
        response = redirect(url, code=302)
        return response

     
    # リダイレクトURLのチェック
    #   リダイレクト先URIも、事前に認証サーバーに登録されていなければならない
    if check_redirect(query['client_id'],query['redirect_uri']) == False:
        app.logger.debug('Invalid redirect URI = ' + query['client_id'],query['redirect_uri'])
        resp = { 'error': 'Invalid redirect URI' }
        url = query['redirect_uri'] + "?" + urllib.parse.urlencode(resp)
        response = redirect(url, code=302)
        return response

    
    # 次の処理を照合するためにDBへ保存する
    requests[reqid] = qs.query
    
    # 個人を認証（ログイン）フォームを表示
    return render_template('authorize.html',
                           client_id=query['client_id'],
                           redirect_uri=query['redirect_uri'],
                           state=query['state'],
                           reqid=reqid,scope=query['scope']) 



#
# 認証（ログイン）フォームからのインプットを受け、
# ユーザーIDとパスワードを照合して、一致していれば、認証は成功とする
#
## Approve 
@app.route('/approve', methods=['POST', 'GET'])
def authn():
    ## 認証の処理を実行
    ##  QSの存在チェック 無ければエラー応答
    ##  QSの内容は？
    ##    1. client_id
    ##    2. redirect_uris
    ## 　 3. state
    ##
    ##  レスポンスタイプ code であれば処理
    ##  scope の範囲の逸脱が無いことをチェック
    #
    # ユーザーの認証もここで実施
    #
    # user: フォームから取得
    # scope: フォームから取得
    # client_id: QSから取得
    # code, state のQSをつけて、リダイレクト先へ転送する
    
    query_recv = urllib.parse.urlparse(request.url)
    query = dict(urllib.parse.parse_qsl(query_recv.query))


    # reqidをキーとして送ったQuery String を取り出して
    # 辞書からキーreqidの値を削除する
    reqid = request.form['reqid']
    query_sent = None
    squery = {}
    if reqid in requests:
       query_sent = requests.pop(reqid)
       squery = dict(urllib.parse.parse_qsl(query_sent))
    else:
       # 送信したQuery String のIDが無ければ、不正としてエラーを返す
        app.logger.debug('No matching authorization request [' + reqid + ']')
        resp = { 'error': 'No matching authorization request' }
        url = query['redirect_uri'] + "?" + urllib.parse.urlencode(resp)
        response = redirect(url, code=302)
        return response
     
    app.logger.debug(query_recv)    
    app.logger.debug("client_id = " + query['client_id'])
    app.logger.debug("username = " + request.form['username'])
    app.logger.debug("password = " + request.form['password'])
    #app.logger.debug("scope    = " + request.form['scope'])
    #app.logger.debug("scope2   = " + request.form.getlist['scope2'])
    app.logger.debug("scope2 ======")
    scope2 = request.form.getlist('scope2')
    scope = ""
    n = 0
    for x in scope2:
        if n == 0:
            scope = x
        else:
            scope = scope + " " + x
        n = n + 1
    app.logger.debug("scope    = " + scope)
    app.logger.debug(scope)
    app.logger.debug("redirect_uri = " + query['redirect_uri'])
    app.logger.debug("state = " + query['state'])    

    #############################################################
    # 認証 ユーザーID と パスワードのチェック LDAPで照合
    #############################################################
    if valid_login(request.form['username'],request.form['password']):
        app.logger.debug("認証成功")
    else:
       resp = { 'error': 'id or password failed' }
       url = query['redirect_uri'] + "?" + urllib.parse.urlencode(resp)
       response = redirect(url, code=302)
       return response


    
    if 'approve' not in request.form:
       resp = { 'error': 'access_denied' }
       url = query['redirect_uri'] + "?" + urllib.parse.urlencode(resp)
       response = redirect(url, code=302)
       return response

    app.logger.debug("approve  = " + request.form['approve'])    
    
    # 送信したQSのレスポンスタイプがcodeで無ければエラーを返す
    if squery['response_type'] != 'code':
       resp = { 'error': 'unsupported_response_type' }
       url = query['redirect_uri'] + "?" + urllib.parse.urlencode(resp)
       response = redirect(url, code=302)
       return response
    
    # code へ 8桁のランダムな文字列セット    
    code = get_random_string(8)
    
    # QSを追加して、リダイレクトするURIを作る
    resp_qs = {}
    resp_qs['code'] = code             # ランダムな文字列を生成してセット
    resp_qs['state'] = query['state']  # クライアントから出されたランダム文字列 
    url = query['redirect_uri'] + "?" + urllib.parse.urlencode(resp_qs)
    app.logger.debug("URL = " + url)
    
    # スコープのチェック
    #if not check_scope(query['client_id'], request.form['scope']):
    if not check_scope(query['client_id'], scope):
       resp = { 'error': 'unsupported_response_type' }
       url = query['redirect_uri'] + "?" + urllib.parse.urlencode(resp)
       response = redirect(url, code=302)
       return response
       
    
    # code をキーにして以下を保存する
    codes[code] = {
        'request': query_recv,
        'scope': scope,         #request.form['scope'],
        'user':  request.form['username'],
        'client_id': query['client_id']
    };

    response = redirect(url, code=302)
    return response


#
#  認証の成功を受けて、
#    access_token, id_token を発行してアプリへ提供する
#
@app.route('/token', methods=['POST', 'GET'])
@auth.login_required
def token():
    app.logger.debug("/token")
    app.logger.debug(request.headers)
    app.logger.debug(request.form)

    clientId = None
    clientSecret = None
    # authorizationヘッダーから client_id と client_secret を取り出す
    if 'authorization' in request.headers:
       app.logger.debug("authorization = " + request.headers['authorization'])
       app.logger.debug("client_id = " + auth.username())
       app.logger.debug("client_secret = " + get_pw(auth.username()))
       clientId = auth.username()
       clientSecret = get_pw(auth.username())

    # client_id がPOSTされていればclient_id と client_secret を取り出す
    if 'client_id' in request.form:
       # clientId が二つの方法で送られてきたら不審なクライアントと判断
       if clientId != None:
          app.logger.debug('Client attempted to authenticate with multiple methods')
          return {'error': 'invalid_client'}, 401
       clientId = request.form['client_id']
       clientSecret = request.form['client_secret']

    # client_id の存在と一致のチェック
    if check_client_id(clientId) == False:
       app.logger.debug('Unknown client ' + clientId)
       return {'error': 'invalid_client'}, 401
    
    # client_secret パスワードの一致チェック
    if check_client_secret(clientId,clientSecret) == False:
       app.logger.debug('Mismatched client secret')
       return {'error': 'invalid_client'}, 401

    app.logger.debug("code = " + request.form['code'])
    app.logger.debug("redirect_uri = " + request.form['redirect_uri'])
    app.logger.debug("grant_type = " + request.form['grant_type'])

    
    # grant_type のチェック
    if request.form['grant_type'] != 'authorization_code':
       app.logger.debug('Unknown grant type ' + request.form['grant_type'])
       return {'error': 'unsupported_grant_type'}, 400
       

    # リクエストのコードがDBに存在していなければエラー応答
    code = request.form['code']
    if code not in codes:
       app.logger.debug('Unknown code ' + code)
       return {'error': 'Unknown code '}, 400           

    # 自己のDBからcodeを削除して再利用を防止する    
    code = codes.pop(code)

    ###
    ### アクセストークン作成
    ###

    # アクセストークンは 2つの方法がある
    #  1 乱数文字を生成、対応する情報をKVSでアプリと共有する
    #  2 JWTを作成 アプリでJWTをバリデーションすることで情報をエル

    # 以下は
    # ランダムな文字列でアクセストークンを生成
    #   アプリサーバーが、リソースサーバーへアクセスする際に
    #   HTTPヘッダのAuthorization にaccess_token をセットする。
    #　 つまり、JWTをセットすることも可能であり、ISTIOにも適用できるだろう
    #

    #access_token = get_random_string(26)
    access_token = create_access_token(clientId, get_userinfo(code['user']))
    app.logger.debug("access_token = ")
    app.logger.debug(access_token)    
    
    #>>> claims = jwt.decode(s, read_file('public.pem'))
    #>>> print(claims)
    #{'iss': 'Authlib', 'sub': '123', ...}
    #>>> print(claims.header)
    #{'alg': 'RS256', 'typ': 'JWT'}
    #>>> claims.validate()


    
    # NoSQLに保存
    # access_token はNoSQLに登録しておき、リソースサーバーでNoSQLをアクセスして
    # access_token を照合して、不一致であればアクセスを拒否する
    access_token_data = {
       'access_token': access_token,
       'client_id': clientId,
       'scope': code['scope'],
       'user': get_userinfo(code['user'])
    }
    col_atoken.insert_one(access_token_data)


    ###
    ### IDトークンを作成 
    ###
    # スコープをセット
    cscope = None
    if 'scope' in code:
       cscope = code['scope']

    app.logger.debug("toke_response")
    token_response = {
       'access_token': access_token,
       'token_type': 'Bearer',
       'scope': cscope
    }
    
    # スコープにopenid が存在、ユーザーがセットされていたら
    work_scope = code['scope'].split(" ")
    if ('openid' in work_scope ) and ('user' in code):

       header = {
          'typ': 'JWT',
          'alg': 'RS256',
          'kid': 'authserver'
       }


       #
       # LDAPからユーザーの属性をセットする
       #
       app.logger.debug("mongo user = " + code['user'])
       app.logger.debug("mongo client_id = " + code['client_id'])
       for c in code:
           app.logger.debug(c)
       
       user_info = search_ldap(code['user'])
       app.logger.debug("user_info = " + user_info['cn'][0])

       #
       # OIDCのペイロード
       #　参考 https://qiita.com/TakahikoKawasaki/items/8f0e422c7edd2d220e06
       #       https://openid.net/specs/openid-connect-core-1_0.html#StandardClaims
       #
       payload = {
           'iss': cf.OAUTH_SERVER_URL,      # 認証サーバーのURLアドレス
           'sub': code['user'],             # 一意のユーザーUID
           'aud': code['client_id'],        # 認可を受けたアプリID
           'name': user_info['cn'][0],      # ユーザー名
           'iat': int(time.time()),         # 現在時刻
           'exp': int(time.time()) + 300    # 有効期限時刻 5分
       }

       # リクエストのnonceが入っていれば nonceを追加する
       if 'request' in code:
          if 'nonce' in code['request']:
             payload['nonce'] = code['request']['nonce']
          
       # JWTの生成
       with open('key-private.pem', 'rb') as f:
          prvkey = f.read()
       id_token = jwt.encode(header, payload, prvkey)
       app.logger.debug('Issued tokens for code ' + id_token.decode())

       app.logger.debug('id_tokenはバイナリからストリング化する')
       token_response['id_token'] = id_token.decode()
       app.logger.debug('id_tokenはバイナリからストリング化した')

    return token_response, 200


##
## MAIN
##
if __name__ == '__main__':

    api = Api(app)
    bx_port = os.getenv("PORT")
    listen_port = int(bx_port if bx_port else 5000)
    app.run(host='0.0.0.0', port=listen_port, debug=True)
