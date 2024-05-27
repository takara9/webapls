#!/usr/bin/env python
# -*- coding: utf-8 -*-
#
# Object Storage からローカルPCヘダウンロード
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

    if (argc != 4):   
        print 'Usage: os_download.py Container Object_name Local_file' 
        quit() 
    oos = object_storage.get_client(cred['username'], cred['password'], datacenter=cred['data_center'])

    cnt = argvs[1]
    obj = argvs[2]
    lfn = argvs[3]

    oos[cnt][obj].save_to_filename(lfn)




