#!/usr/bin/python
# -*- coding: utf-8 -*-
#
# APIを実行するアカウントIDとAPI-KEYを管理する共通ライブラリ
# 
#  
#  作成者  Maho Takara   takara@jp.ibm.com
#  2015/8/13
#
import SoftLayer
import string
import os
import json

#
#  プライマリーアカウントの
#    ユーザーIDとパスワード (1)
#
account = {"username": None, "api_key": None}
account_file = 'account.json'

#
# APIキーの入ったファイルが存在すれば読み込み、
# 存在しなければ新規作成する
#
def apikey():

    global account
    global account_file

    if account["username"] is None:
        if os.path.isfile(account_file) is False:
            print "The account infomation is not found !"
            account["username"] = raw_input("What's your account id ? ")
            account["api_key"] = raw_input("api_key (password) ? ")
            with open(account_file, 'w') as f:
                json.dump(account, f, sort_keys=True,indent=4)
        else:
            with open(account_file, 'r') as f:
                account = json.load(f)
                

#
# APIログイン
#
def api_login():
    global account
    apikey()

    client = SoftLayer.Client(username=account["username"], api_key=account["api_key"])
    try:
        object_mask = 'id,username,firstName,lastName'
        ret = client['Account'].getCurrentUser(mask=object_mask)
        print "Current User = %s " % ret['username']
    except SoftLayer.SoftLayerAPIError as e:
        print("faultCode=%s, faultString=%s" % (e.faultCode, e.faultString))
        return False

    return client




