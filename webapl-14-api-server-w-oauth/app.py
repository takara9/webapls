#!/usr/bin/env python
# -*- coding:utf-8 -*-
#
# アプリケーション（クライアント）
#
import os
import sys
import uuid
import json
import hashlib
import requests
import time
import base64

# Flaskフレームワーク関連
from flask import Flask, render_template, make_response, request, send_from_directory, redirect
from flask_restful import Resource, Api, reqparse
from flask_cors import CORS

# OAuth2関連
from authlib.jose import jwt
import authlib.jose.errors


# LDAP関連
from ldap3 import Server, Connection, ALL
from pySSHA import ssha
from base64 import b64encode as encode
from base64 import b64decode as decode

# URL操作
import urllib.parse

# 認証サーバー
jwtPublicKey = 'http://auth:5810/publickey'


app = Flask(__name__)
app.config['CORS_EXPOSE_HEADERS'] = "*"
CORS(app)


@app.route('/')
def home():
    return render_template('index.html', title='plane-test', name="home") 

#
#  保護コンテンツの配信 JSONを応答するケース
#
@app.route('/test', methods=['GET'])
def test():
    # 検証用の公開鍵取得
    try:
        app.logger.debug("公開鍵の取得")
        response = requests.get(jwtPublicKey)
        key = response.content
    except:
        app.logger.debug("Unexpected error:", sys.exc_info()[0])
        return { 'test': 'Unable to get the public key for JWT validation' },401
        
    ## トークンを検証
    try:
        app.logger.debug("トークンの検証")
        token = request.headers['Authorization'].split(" ")
        claims = jwt.decode(token[1], key)
        claims.validate()
        app.logger.debug(claims)
    ## トークンに不正があると例外処理
    except authlib.jose.errors.BadSignatureError:
        app.logger.debug("トークンの改竄を検知")
        return { 'test': 'Bad Token' },401
    except:
        app.logger.debug("不正なトークン")        
        app.logger.debug("Unexpected error:", sys.exc_info()[0])        
        return { 'test': 'Unknown' },401

    ## 正常の場合の応答
    return { 'test': 'ok' },200


#
#  保護コンテンツの配信 HTMLを応答するケース
#
@app.route('/private', methods=['GET'])
def protected_html_1():
    try:
        app.logger.debug("公開鍵の取得")
        response = requests.get(jwtPublicKey)
        key = response.content
    except:
        app.logger.debug("Unexpected error:", sys.exc_info()[0])
        return make_response(render_template('error.html', status="内部エラー発生"), 401)
        
    ## トークンを検証
    try:
        app.logger.debug("トークンの検証")
        token = request.headers['Authorization'].split(" ");
        claims = jwt.decode(token[1], key)
        claims.validate()
        
    ## トークンに不正があると例外処理
    except authlib.jose.errors.BadSignatureError:
        app.logger.debug("トークンの改竄を検知")
        return make_response(render_template('error.html', status="トークンの改竄を検知"), 401)
    
    except:
        app.logger.debug("不正なトークン検知")        
        app.logger.debug("Unexpected error:", sys.exc_info()[0])
        return make_response(render_template('error.html', status="不正なトークン"), 401)

    ## 正常の場合の応答
    return render_template('reply.html', status="成功")

    
##
## MAIN
##
if __name__ == '__main__':
    api = Api(app)
    bx_port = os.getenv("PORT")
    listen_port = int(bx_port if bx_port else 9000)
    app.run(host='0.0.0.0', port=listen_port, debug=True)
