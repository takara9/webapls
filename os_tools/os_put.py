#!/usr/bin/env python
# -*- coding: utf-8 -*-
#
#  5GB未満のオブジェクトをアップロードする
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
cnt = '' # コンテナ名
obj = '' # オブジェクト名
lfn = '' # ローカルファイル
#####

#
# メイン
#
if __name__ == '__main__':
    argvs = sys.argv  # 引数リストの取得
    argc = len(argvs) # 個数

    if (argc != 4):   
        print 'Usage: os_upload.py Local_file Container Object_name' 
        quit() 

    lfn = argvs[1]
    cnt = argvs[2]
    obj = argvs[3]


    # 認証取得
    oos = object_storage.get_client(cred['username'], cred['password'], datacenter=cred['data_center'])


    # コンテナが存在しなければ作成
    try:
        if oos[cnt].objects():
            pass
    except object_storage.errors.NotFound as (errno, strerror):
        #print "error({0}): {1}".format(errno, strerror)
        oos[cnt].create()
    except:
        print "Unexpected error:", sys.exc_info()[0]
        raise
    finally:
        pass


    # オブジェクト・ストレージへ書き込み
    try:
        print "uploading... "
        fin = open(lfn, 'rb')
        data = fin.read()
        oos[cnt][obj].send(data)
    except IOError as (errno, strerror):
        print "I/O error({0}): {1}".format(errno, strerror)
    except:
        print "Unexpected error:", sys.exc_info()[0]
        raise
    finally:
        fin.close() 
        print "Complete"






