#!/usr/bin/env python                                                           
# -*- coding:utf-8 -*-                                                          
#
# CSVファイルから、トレーニングデータとリアクションのDBを作成する
# 　　リアクションのDBは、Cloudant上にストアする
#     トレーニングデータは、nlcに取り込むcsv形式で書き出す
#　　 トレーニングファイル名は、nlc_config.json に定義
#
# 作者 Maho Takara    takara@jp.ibm.com
#
# Copyright (C) 2016 International Business Machines Corporation 
# and others. All Rights Reserved. 
# 
# 2016/8/15  初版
#

import json
import csv
import codecs
import uuid
import time
from cloudant.client import Cloudant
from cloudant.query import Query

# NLC コンフィグの取得
f = open('./nlc_config.json', 'r')
cnf = json.load(f)
f.close()

# Cloudant認証情報の取得
f = open('./cloudant_credentials_id.json', 'r')
cred = json.load(f)
f.close()

print "クラウダントへの接続"
dbname = cnf['database']
print dbname
client = Cloudant(cred['credentials']['username'], 
                  cred['credentials']['password'], 
                  url=cred['credentials']['url'])
client.connect()

# DBが存在していたら削除
print "既存データベースの削除"
try:
    db = client[dbname]
    if db.exists():
        client.delete_database(dbname)
except:
    print "新規データベースの作成"

# DBを新規作成
db = client.create_database(dbname)

# 失敗したら終了
if db.exists():
    print 'SUCCESS!!  Database creation on cloudant'
else:
    sys.exit()


# エクセルシートからのCSVデータを読んで
# NLCトレーニングデータを作成する
# リアクションデータをクラウダントに登録する
#
reader = codecs.open(cnf['input_csv'],'r','shift_jis')
lines = reader.readlines()
writer = codecs.open(cnf['training_csv'],'w','utf_8')

# Cloudantのインデックス作成
db.create_query_index(
    design_document_id='reaction_dd1',
    index_name='reaction_idx1', 
    index_type='text',
    fields=[{"name": "class", "type": "string"}],
    default_field={'enabled': True, 'analyzer': 'japanese'})


prev_reply_phrase = None
prev_class = None

# CSVを読み込んでDBに登録する
for line in lines:

    # トレーニングデータ作成
    recieve_sentence,class1,class2,class3,class4,reply_phrase,reaction,dialog_name,rr_name,sc_name = line.rstrip("\n\r").split(',');
    new_line = recieve_sentence + "," + class1 + "," + class2 + "," + class3 + "," + class4 + "\n"

    # NLCトレーニング用データ作成
    if len(recieve_sentence) > 0:
        writer.write(new_line)

    # NULLの判定用
    xclass = [class1,class2,class3,class4]

    # リアクションデータベース登録
    for i in range(0, 4):
        if len(xclass[i]) == 0:
            break

        # 重複登録防止
        if xclass[i] == prev_class:
            if reply_phrase == prev_reply_phrase:
                break


        id = str(uuid.uuid4())
        json_data = {
            "_id": id,
            "reply_phrase": reply_phrase,
            "class": xclass[i],
            "reaction": reaction,
            "dialog_name": dialog_name,
            "rr_name": rr_name,
            "sc_name": sc_name
        }

        cdoc = db.create_document(json_data)
        print "STORE DOC %s : %s" % (xclass[i], json_data['reply_phrase'])
        prev_reply_phrase = reply_phrase
        prev_class = xclass[i]

        # 書き込みチェック
        #if cdoc.exists():
        #    print "SUCCESS!! %s : %s" % (xclass[i], reply_phrase)



writer.close()
client.disconnect()

