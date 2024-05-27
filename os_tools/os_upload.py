#!/usr/bin/env python
# -*- coding: utf-8 -*-
#
#  ローカルPCからObject Storageへアップロード
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

# ローカルファイル
lfn = ''
#####


# チャンクサイズ(200MB)に分割して登録するための情報
tfn = 'chunk'
csz = 209715200
seq = 1

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

    # マニフェストを登録
    header = {'Content-Length': '0'}
    mf = "%s/%s/%s" % (cnt,obj,tfn)
    header['X-Object-Manifest'] = mf
    oos[cnt][obj].create(headers=header)

    # チャンクサイズ毎にアップロードします。
    infile_size = os.path.getsize(lfn)
    print "input file size = %d" % infile_size
    infile_sent = 0.0
    progress_pst = 0.0
    fin = open(lfn, 'rb')
    try:
        bytes_read = fin.read(csz)
        while bytes_read:
            obj2 = "%s/%s-%04d" % (obj, tfn, seq)
            print "sending...  %3.1f %s" % (progress_pst,"%")
            oos[cnt][obj2].create()
            oos[cnt][obj2].send(bytes_read)
            seq = seq + 1
            infile_sent = infile_sent + csz
            progress_pst = (infile_sent / infile_size) * 100.0
            bytes_read = fin.read(csz)

    except IOError as (errno, strerror):
        print "I/O error({0}): {1}".format(errno, strerror)
    except:
        print "Unexpected error:", sys.exc_info()[0]
        raise
    finally:
        fin.close()






