#!/usr/bin/python
# -*- coding: utf-8 -*-
#
# 研修用ユーザーの作成ツール
#  
#  機能
#    このプログラムは、ソフトレイヤーのハンズオン研修用などの目的で、
#    同じ権限の子ユーザーIDを一度に複数作るためのプログラムです。
#    子ユーザーの作成条件は、下記の使い方に表した様に、このプログラムを
#    編集して設定する方式のエッセンシャルな機能だけを持つものです。
#
#
#　使い方
#　　1. APIのユーザーIDとAPI-KEYをコピペでインプットできる様に準備する
#    2. ユーザーの属性情報 (2)を編集して、利用目的に則した内容にする
#    3. ユーザーに与える権限のリスト(3)を編集（そのままでもOK）
#    4. 本プログラムの実行
#    5. 作成するユーザー数をインプット
#    6. ユーザーIDとパスワードのリストをコピペして保存
#    7. 実行結果の確認（ポータルのAccount->Usersで確認)
#    8. 演習ユーザーの利用(ハンズオン・セッション）
#    9. ユーザーの削除 x3_del_user.py
#
#  注意点
#    ・作成した子ユーザーの削除には、x3_del_user.pyを実行してください。
#      子ユーザーを一括で削除するので、必要なユーザー全てを消す可能性があります。
#　　・ソフトレイヤーの制約により、削除した同じユーザー名は、しばらく再利用できません。
#
#
#  作成者  Maho Takara   takara@jp.ibm.com
#  2015/5/8  初版リリース
#  2015/8/13 ユーザーIDとAPI-KEYを初回実行時だけ入力する様に改良
#  2015/10/3 パスワード有効期限の設定、コーディングミス修正
#
#  既知のバグ
#    sslVpnAllowedFlag をTrueに出来ない、登録後にポータルから変更する必要がある。
#

import SoftLayer
import random
import string
import os
import requests
import json
import user_account as ua

#
# ユーザーに与える権限のリスト(3)
#   コメントを外せば、権限が付与される
#   逆にコメントにすれば権限が与えられない
#
param = [
#Support
'TICKET_VIEW',
#'TICKET_ADD',
'TICKET_SEARCH',
#'TICKET_EDIT',
'TICKET_VIEW_BY_HARDWARE',
'TICKET_VIEW_BY_VIRTUAL_GUEST',
'TICKET_VIEW_ALL',
#Devices
#'HARDWARE_VIEW',
#'MONITORING_MANAGE',
'VIRTUAL_GUEST_VIEW',
#'REMOTE_MANAGEMENT',
#'FIREWALL_MANAGE',
#'SERVER_UPGRADE',
#'FIREWALL_RULE_MANAGE',
#'HOSTNAME_EDIT',
#'SOFTWARE_FIREWALL_MANAGE',
'SERVER_RELOAD',
#'LOADBALANCER_MANAGE',
#'PORT_UPGRADE',
#'PORT_CONTROL',
#'SCALE_GROUP_MANAGE',
#Network
#'BANDWIDTH_MANAGE',
#'NETWORK_ROUTE_MANAGE',
#'IP_ADD',
#'NETWORK_VLAN_SPANNING',
#'NETWORK_MESSAGE_DELIVERY_MANAGE',
#'NETWORK_TUNNEL_MANAGE',
#'VPN_MANAGE',
#'GATEWAY_MANAGE',
#Security
#'REQUEST_COMPLIANCE_REPORT',
#Services
#'CDN_BANDWIDTH_VIEW',
#'QUEUE_MANAGE',
#'LICENSE_VIEW',
#'VIEW_QUANTASTOR',
#'DNS_MANAGE',
#'CUSTOMER_POST_PROVISION_SCRIPT_MANAGEMENT',
#'ANTI_MALWARE_MANAGE',
#'PUBLIC_IMAGE_MANAGE',
#'SSL_VPN_ENABLED',
#'HOST_ID_MANAGE',
#'SECURITY_MANAGE',
'VULN_SCAN_MANAGE',
#'SECURITY_CERTIFICATE_VIEW',
#'CDN_ACCOUNT_MANAGE',
#'SECURITY_CERTIFICATE_MANAGE',
#'CDN_FILE_MANAGE',
'CUSTOMER_SSH_KEY_MANAGEMENT',
#'VIEW_CPANEL',
#'SERVICE_UPGRADE',
#'VIEW_PLESK',
#'LOCKBOX_MANAGE',
#'VIEW_HELM',
#'VIEW_URCHIN',
#'NAS_MANAGE',
#Account
#'ACCOUNT_SUMMARY_VIEW',
#'USER_MANAGE',
#'NTF_SUBSCRIBER_MANAGE',
#'RESET_PORTAL_PASSWORD',
#'FORUM_ACCESS',
#'ADD_SERVICE_STORAGE',
#'INSTANCE_UPGRADE',
#'COMPANY_EDIT',
#'UPDATE_PAYMENT_DETAILS',
#'ONE_TIME_PAYMENTS',
'SERVER_CANCEL',
#'SERVICE_ADD',
#'SERVICE_CANCEL',
'SERVER_ADD',
#'DATACENTER_ACCESS',
#'DATACENTER_ROOM_ACCESS',
#'USER_EVENT_LOG_VIEW',
]
###################

#
# パスワード生成
#
def passwd_gen():
    s = ''
    for i in range(1, 7):
        s += random.choice(string.letters)
    s += random.choice("!#$%")
    s += random.choice(string.digits)
    return s


#
# アカウント作成
#
def add_user(client, username, password):
    #
    # ユーザーの属性情報 (2)
    #
    userObj={
        'username': username,
        'firstName': 'Hands on user', 
        'lastName': username,
        'companyName': 'ANY',
        'address1': 'ANY',
        'city': 'Tokyo',
        'country': 'JP',
        'postalCode': '000-0000',
        'email': 'takara@jp.ibm.com',
        'userStatusId': 1001,
        'timezoneId': 158,
        'secondaryPasswordTimeoutDays': 3,
    }
    try:
        account = client['SoftLayer_User_Customer'].createObject(userObj,password)
        print "account id : %s" % account['id']

        return True
    except SoftLayer.SoftLayerAPIError as e:
        print("faultCode=%s, faultString=%s" % (e.faultCode, e.faultString))
        return False


#
# ユーザー名からオブジェクトIDの取得
#
def get_id_from_username(client, username):
    object_mask = 'username,accountId,id,lastName,firstName'
    ret = client['SoftLayer_Account'].getUsers(mask=object_mask)
    for x in ret:
        if username == x['username']:
            return x['id']
    return False


#
# アクセス権限の付与
#
def set_permission(client, xid):
    for kn in param:
        try:
            ret = client['SoftLayer_User_Customer'].addPortalPermission({'keyName': kn},id=xid)
            #print 'Permission: %s done' % kn
        except SoftLayer.SoftLayerAPIError as e:
            print("faultCode=%s, faultString=%s" % (e.faultCode, e.faultString))


#
# 自分が作成したサーバーしか見えない設定
#  既存のサーバーのアクセス権を外す
def remove_permission_existing_servers(client, xid):
    try:
        ret = client['SoftLayer_User_Customer'].removeAllHardwareAccessForThisUser(id=xid)
        ret = client['SoftLayer_User_Customer'].removeAllVirtualAccessForThisUser(id=xid)
    except SoftLayer.SoftLayerAPIError as e:
        print("faultCode=%s, faultString=%s" % (e.faultCode, e.faultString))


#
# ユーザーにVPNのアクセス件を付与する
#  
def set_vpn_access_permission(client, xid, password):
    vpnObj = {
        'sslVpnAllowedFlag': True,
        'pptpVpnAllowedFlag': False,
        'vpnManualConfig' : False
    }
    try:
        ret = client['SoftLayer_User_Customer'].updateVpnPassword(password,id=xid)
        ret = client['SoftLayer_User_Customer'].updateVpnUser(vpnObj,id=xid)
    except SoftLayer.SoftLayerAPIError as e:
        print("faultCode=%s, faultString=%s" % (e.faultCode, e.faultString))

#
# ユーザーIDの開始番号の管理
#
def userid_gen(n):
    user_list = []
    filename = "./user_seqno.txt"
    exist = os.path.exists(filename)
    if exist == False:
        fd = open(filename, "w")
        seq = ''
        for i in range(1, 6):
            seq += random.choice(string.digits)
        seq += '\n'
        fd.write(seq)
        fd.close()
        
    try:
        fd = open(filename, "r")
        seq = fd.readline()
        fd.close()

        iseq = int(seq)
        eseq = iseq + n
        for no in range(iseq, iseq + n):
            user_list.append(no)

        fd = open(filename, "w")
        buf = "%d\n" % eseq
        fd.write(buf)
        fd.close()

    except SoftLayer.SoftLayerAPIError as e:
        print("faultCode=%s, faultString=%s" % (e.faultCode, e.faultString))
        return None

    return user_list


#
# メイン
#
if __name__ == '__main__':
    requests.packages.urllib3.disable_warnings()

    clt = ua.api_login()
    if clt == False:
        print "Failed: api_login()"
        exit(1)

    num_of_user = input("How many the child user id do you want to add ? ")


    # 新規ユーザーのリスト作成
    userlist = userid_gen(num_of_user)
    if userlist == None:
        print "Failed: userid_gen()"
        exit(0)


    # リストに従って登録、権限付与他
    for username in userlist:
        password = passwd_gen()
        susername = "hack%s" % username
        print 'username = %s  password = %s' % (susername, password)

        ret = add_user(clt, susername, password)
        if ret == False:
            print "Failed: add_user()"
            # exit(1)

        # パーミッション設定、既存サーバーのアクセス権削除
        id = get_id_from_username(clt, susername)
        set_permission(clt, id)    
        remove_permission_existing_servers(clt, id)
        set_vpn_access_permission(clt, id, password)








