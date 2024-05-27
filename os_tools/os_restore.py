#!/usr/bin/env python
# -*- coding: utf-8 -*-
#
# restore コマンドと組み合わせて バックアップからのリストア
#

import object_storage
import os
import sys
import json

#####
# オブジェクト・ストレージ認証情報の取得
f = open('./credentials.json', 'r')
cred = json.load(f)
f.close()

# コンテナとアップロード時のオブジェクト名
cnt = ''
obj = ''

# ローカルファイル
lfn = ''
#####


#
# メイン
#
if __name__ == '__main__':
    #
    argvs = sys.argv  # 引数リストの取得
    argc = len(argvs) # 個数

    if (argc != 3):   
        print 'Usage: os_restore.py Container Object_name | restore rf -' 
        quit() 
    oos = object_storage.get_client(cred['username'], cred['password'], datacenter=cred['data_center'])

    cnt = argvs[1]
    obj = argvs[2]

    sz = 209715200 # 200MB
    os = None

    try:
        while 1:
            buf = oos[cnt][obj].read(size=sz, offset=os)
            sys.stdout.write(buf)
            if len(buf) < sz:
                break
            if os == None:
                os = 0
            os = os + sz

    except IOError as (errno, strerror):
        print "I/O error({0}): {1}".format(errno, strerror)
    except:
        print "Unexpected error:", sys.exc_info()[0]
        raise
    finally:
        pass






