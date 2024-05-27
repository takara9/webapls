#!/usr/bin/env python                                                           
# -*- coding:utf-8 -*-                                                          
#
# Cloudant のデータベース作成
#
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

# DBを読んでループを回す
for doc in db:
    print doc['_id'],doc['e_description'],doc['j_description']


doc = db['800']
print doc['j_description']

# Disconnect from the server
client.disconnect()
