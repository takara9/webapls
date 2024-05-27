#!/usr/bin/env python
# -*- coding: utf-8 -*-
#
# Object Storageのオブジェクトを削除
#

import object_storage
import os
import sys
import json

# オブジェクト・ストレージ認証情報の取得
f = open('./credentials.json', 'r')
cred = json.load(f)
f.close()

# コンテナとオブジェクト名
cnt = ''
obj = ''

###
#
# メイン
#
if __name__ == '__main__':
    argvs = sys.argv  # コマンドライン引数のリスト
    argc = len(argvs) # 個数

    if (argc != 3):   
        print 'Usage: os_delete.py container object_name' 
        quit() 

    cnt = argvs[1]
    obj = argvs[2]

    oos = object_storage.get_client(cred['username'], cred['password'], datacenter=cred['data_center'])

    res = {}
    res = oos[cnt][obj].search(obj)
    for rec in res['results']:
        print "Delete %s" % rec
        rec.delete()
    oos[cnt][obj].delete()
