#!/usr/bin/env python
# -*- coding:utf-8 -*-

import os
import uuid
import json
import hashlib

# Flaskフレームワーク関連
from flask import Flask, render_template, make_response, request
from flask_restful import Resource, Api, reqparse
# https://flask-cors.readthedocs.io/en/latest/
from flask_cors import CORS

# OAuth2関連
import python_jwt as jwt, jwcrypto.jwk as jwk, datetime

# LDAP関連
from ldap3 import Server, Connection, ALL
from pySSHA import ssha
from base64 import b64encode as encode
from base64 import b64decode as decode


jwks = { 'keys':[] }
PRIVATE_KEY_FILE="/private-key.pem"
PUBLIC_KEY_FILE="/public-key.pem"
CHARSET='utf-8'
hashlib.sha = hashlib.sha1
LDAP_SERVER='ldap.labo.local'
LDAP_PORTNO=636
USE_LDAPS=True
LDAP_DOMAIN='dc=labo,dc=local'
LDAP_USER='cn=Manager,dc=labo,dc=local'
LDAP_PASSWD='secret'


#
# 初期化の一部
#   鍵ペアの生成
#
def create_keys():
    os.system("openssl genrsa -out " + PRIVATE_KEY_FILE + " 2048")
    os.system("openssl rsa -in " + PRIVATE_KEY_FILE + " -pubout -out " + PUBLIC_KEY_FILE)

    with open(PUBLIC_KEY_FILE, "rb") as pemfile:
        public_key = jwk.JWK.from_pem(pemfile.read()).export()
        #public_key = public_key.export()
        jwks['keys'].append(json.loads(public_key))

# 
# ログインをLDAPサーバーの応答と比較する
#
def valid_login(user_id,passwd):
    server = Server(LDAP_SERVER, port=LDAP_PORTNO, use_ssl=USE_LDAPS)
    conn = Connection(server, LDAP_USER, LDAP_PASSWD, auto_bind=True)
    user_filter = '(&(objectclass=inetOrgPerson)(uid=%s))' % (user_id)
    conn.search(LDAP_DOMAIN, user_filter, attributes=['uid','userPassword'])
    for entry in conn.entries:
        data_json = json.loads(entry.entry_to_json())
        ssha_pw = data_json['attributes']['userPassword'][0]
        check = ssha.checkPassword( passwd, ssha_pw, suffixed = True, salt_size = 4, debug = 3)
        return check

        
#
# JWTトークンの生成
#
def generate_jwt_token(user_id):
    payload = {
        'iss':'ISSUER', 
        'sub': user_id, 
        'aud': user_id, 
        'role': 'user', 
        'permission': 'all' 
    }
    private_key = ""
    with open(PRIVATE_KEY_FILE, "rb") as pemfile:
        private_key = jwk.JWK.from_pem(pemfile.read())
        private_key = private_key.export()

    return jwt.generate_jwt(payload, jwk.JWK.from_json(private_key), 'RS256', datetime.timedelta(minutes=120))


#
# ウェブサービスのファンクション
#

#
# ログイン処理
#
class Login(Resource):
    def post(self):
        args = parser.parse_args()
        print(args['userid'])
        print(args['passwd'])
        
        if valid_login(args['userid'], args['passwd']):
            token = generate_jwt_token(args['userid'])
            resp = make_response({'login': 'ok' }, 200)
            resp.headers['Authorization'] = 'Bearer ' + token
            resp.set_cookie('Authorization', 'Bearer ' + token)
            return resp
        else:
            return {'login': 'failed'},401
        
#        
# JWTのバリデーション
#
class Jwks(Resource):
    def get(self):
        return jwks




    
##
## MAIN
##
if __name__ == '__main__':

    # 公開鍵の生成
    create_keys()

    # Flaskの初期化
    #  ブラウザのJavaScriptからヘッダー Authorization を読み取れるようにするための設定を加える
    #  Cross-Origin Resource Sharing (CORS) を設定して、他オリジンからのアクセスを許可する
    #    参考 https://flask-cors.readthedocs.io/en/latest/
    #
    app = Flask(__name__)
    app.config['CORS_EXPOSE_HEADERS'] = "*"    
    CORS(app)


    api = Api(app)

    # ユーザー向けのサービス
    #  JSON形式でuserid, passwd を受けてLDAPに問い合わせ
    #  パスワード認証を実施する。パスしたものには JWTを通知する。
    api.add_resource(Login, '/login')

    # アプリケーション側へのサービス
    #  JWTを検証するためのJWKSを配布するURI
    #  このアドレスはアプリサーバー以外に公開してはいけない。
    api.add_resource(Jwks, '/jwks')    

    # 受け取るパラメータの設定
    parser = reqparse.RequestParser()
    parser.add_argument('userid')
    parser.add_argument('passwd')
    parser.add_argument('Authorization', location='headers')

    # ポートの設定とイベントループ待ち
    bx_port = os.getenv("PORT")
    listen_port = int(bx_port if bx_port else 5000)
    app.run(host='0.0.0.0', port=listen_port, debug=True)


