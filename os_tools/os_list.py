#!/usr/bin/env python
# -*- coding: utf-8 -*-
#
# コンテナを指定してオブジェクトのリストを取得
#

import object_storage
import os
import sys
import json

# オブジェクト・ストレージ認証情報の取得
f = open('./credentials.json', 'r')
cred = json.load(f)
f.close()

# コンテナとアップロード時のオブジェクト名
cnt = ''
obj = ''
#####


#
# メイン
#
if __name__ == '__main__':
    argvs = sys.argv  # コマンドライン引数のリスト
    argc = len(argvs) # 個数

    if (argc != 2):   
        print 'Usage: os_list.py Container' 
        quit() 

    cnt = argvs[1]
    #
    oos = object_storage.get_client(cred['username'], cred['password'], datacenter=cred['data_center'])

    obj = oos[cnt].objects()
    for obn in obj:
        print obn['path']

    





