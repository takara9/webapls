#!/usr/bin/env python
# -*- coding:utf-8 -*-

from flask import Flask
import os
import json
import ibm_db
app = Flask(__name__)


# アクセス時のコールバック
@app.route('/')
def hello():
    conn = ibm_db.connect(url, '', '')
    stmt = ibm_db.prepare(conn, 'SELECT RACE_CODE, RACE_DESC from SAMPLES.RACE_CODE FETCH FIRST 5 ROWS ONLY')
    ibm_db.execute(stmt)
    out = "<html><h2>5 rows from RACE_CODE</h2>"
    out = out + "<table border=\"1\"><tr><td>RACE_CODE</td><td>RACE_DESC</td>"

    data = ibm_db.fetch_tuple(stmt)
    while (data):
        out = out + "<tr><td>"+data[0]+"</td><td>"+data[1]+"</td></tr>"
        data = ibm_db.fetch_tuple(stmt)

    ibm_db.free_stmt(stmt)
    ibm_db.close(conn)
    out = out + "</table></html>"

    return out


# メイン
if __name__ == '__main__':

    creds = None

    if 'VCAP_SERVICES' in os.environ:
        vcap = json.loads(os.getenv('VCAP_SERVICES'))
        print('Found VCAP_SERVICES')
        if 'dashDB' in vcap:
            creds = vcap['dashDB'][0]['credentials']

    elif os.path.isfile('vcap-local.json'):
        with open('vcap-local.json') as f:
            print('Found local VCAP_SERVICES')
            vcap = json.load(f)
            creds = vcap['services']['dashDB'][0]['credentials']


    url = creds["ssldsn"]
    
    port = int(os.getenv('PORT', 8080))
    app.run(host='0.0.0.0', port=port, debug=True)
