#!/usr/bin/env python                                                           
# -*- coding:utf-8 -*-                                                          
#
# Cloudant のデータベース作成
#
# Copyright (C) 2016 International Business Machines Corporation 
# and others. All Rights Reserved. 
#                                                                               
#
# https://github.com/cloudant/python-cloudant
# pip install cloudant
# 
# API Document
# http://python-cloudant.readthedocs.io/en/latest/cloudant.html
#


import json
import csv
import codecs
import uuid
from cloudant.client import Cloudant
from cloudant.result import Result, ResultByKey, QueryResult
from cloudant.query import Query

#import cloudant

# Cloudant認証情報の取得
f = open('cloudant_credentials_id.json', 'r')
cred = json.load(f)
f.close()
print cred


# データベース名の取得
f = open('database_name.json', 'r')
dbn = json.load(f)
f.close()
print dbn['name']

client = Cloudant(cred['credentials']['username'], 
                  cred['credentials']['password'], 
                  url=cred['credentials']['url'])

# Connect to the server
client.connect()

# DB選択
db = client[dbn['name']]

# CSVを読んでループを回す
fn = 'weather_code.csv';
reader = csv.reader(codecs.open(fn),delimiter=',',quoting=csv.QUOTE_NONE)
for id, e_description,j_description  in reader:
    print id, e_description,j_description
    data = {
        "_id": id,
        "e_description": e_description,
        "j_description": j_description
        }

    print data
    rx = db.create_document(data)
    if rx.exists():
        print "SUCCESS!!"
        

# Disconnect from the server
client.disconnect()
