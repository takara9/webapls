#!/usr/bin/python
# -*- coding: utf-8 -*-
#
# 研修用ユーザーのリストツール
#  
#  機能
#    このプログラムは、ソフトレイヤーのハンズオン研修用などの目的で、
#    子ユーザーのリストを表示します。
#    
#　使い方
#　　1. 初回実行時だけユーザーIDとAPI-KEYをインプットする
#
#  注意点
#    ポータル画面に表示されなユーザーが表示される事があります。
#
#  作成者  Maho Takara   takara@jp.ibm.com
#
#  2015/5/8  初版リリース
#  2015/8/13 ユーザーIDとAPI-KEYを初回実行時だけ入力する様に改良


import SoftLayer
import random
import string
import requests
import user_account as ua

#
#
# メイン
#
#
if __name__ == '__main__':
    requests.packages.urllib3.disable_warnings()
    clt = ua.api_login()
    if clt == False:
        print "Failed: api_login()"
        exit(1)

    #
    # 子ユーザーのリスト
    #
    try:
        object_mask = 'id,username,firstName,lastName,sslVpnAllowedFlag,userStatusId'
        ret = clt['Account'].getCurrentUser(mask=object_mask)
        users = clt['SoftLayer_User_Customer'].getChildUsers(mask=object_mask,id=ret['id'])

    except SoftLayer.SoftLayerAPIError as e:
        print("faultCode=%s, faultString=%s" % (e.faultCode, e.faultString))
        exit(1)

    print "%-16s       %-6s    %-15s           %-15s  %-10s  %-7s" % ("Username", "id", "firstName", "lastName","SSL_VPN","Status")

    for user in users:
        ret = clt['SoftLayer_User_Customer'].isMasterUser(id=user['id'])
        if ret != True:
           print "%-16s       %-6d    %-15s           %-15s  %-10s  %-7s" % (user['username'],user['id'],user['firstName'],user['lastName'],user['sslVpnAllowedFlag'],user['userStatusId'])


#exit(0)





