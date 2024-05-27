#!/usr/bin/env python
# -*- coding: utf-8 -*-
#
# dump コマンドと組み合わせて Linux のOSバックアップ
#
import object_storage
import os
import sys
import json

# オブジェクト・ストレージ認証情報の取得
f = open('./credentials.json', 'r')
cred = json.load(f)
f.close()

#####
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

    if (argc != 3):   
        print 'Usage: dump -0u -f - / | os_dump.py Container Object_name' 
        quit() 

    cnt = argvs[1]
    obj = argvs[2]

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


    # マニフェストを登録
    header = {'Content-Length': '0'}
    mf = "%s/%s/%s" % (cnt,obj,tfn)
    header['X-Object-Manifest'] = mf
    oos[cnt][obj].create(headers=header)

    # チャンクサイズ毎にアップロードします。
    infile_sent = 0.0
    progress_pst = 0.0
    fin = sys.stdin
    try:
        bytes_read = fin.read(csz)
        while bytes_read:
            obj2 = "%s/%s-%04d" % (obj, tfn, seq)

            oos[cnt][obj2].create()
            oos[cnt][obj2].send(bytes_read)
            seq = seq + 1
            infile_sent = infile_sent + len(bytes_read)
            print "sending...  %3.3f MB" % (infile_sent/1000/1000)
            bytes_read = fin.read(csz)

    except IOError as (errno, strerror):
        print "I/O error({0}): {1}".format(errno, strerror)
    except:
        print "Unexpected error:", sys.exc_info()[0]
        raise
    finally:
        fin.close()






