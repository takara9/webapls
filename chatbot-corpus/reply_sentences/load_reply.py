#!/usr/bin/env python
# coding: UTF-8

import sys
import json
import uuid
from cloudant.client import Cloudant

f = open('./vcap-local.json', 'r')
vcap = json.load(f)
f.close()

cred = vcap['services']['cloudantNoSQLDB'][0]
client = Cloudant(cred['credentials']['username'],
                  cred['credentials']['password'],
                  url=cred['credentials']['url'])
client.connect()
dbname = "reply"

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

# DB書き込み
f = open(sys.argv[1])
line = f.readline() 
while line:
    line = line[:-1]
    words = line.split(",")
    doc = {
        "_id": str(uuid.uuid4()),
        "class_name": words[0],
        "reply_message": words[1]
    }
    cdoc = db.create_document(doc)
    line = f.readline() 
    
