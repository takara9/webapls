#!/usr/bin/env python
# coding: utf-8
#
#  RESTクライアント
#

import threading
import requests
import time as tm
from requests.auth import HTTPBasicAuth
gcnt = 0
url = 'http://10.132.253.44'

def work(url):
    # GET
    ##uri = url + "/"
    ##resp = requests.get(uri)
    #print "GET"
    #print "status_code = ", resp.status_code
    #print "resp = ", resp.text
    #print

    # POST
    ##uri = url + "/hash"
    ##json = {'textbody': 'hello world'}
    ##username = 'takara';
    ##password = 'hogehoge';
    ##resp = requests.post(uri,json,auth=HTTPBasicAuth(username, password))

    # 結果表示
    ##rslt = resp.json()
    #print "POST"
    #print "status_code = ", resp.status_code
    #print "sha1   = ", rslt['sha1']
    #print "sha256 = ", rslt['sha256']
    #print "md5    = ", rslt['md5']

    # 高負荷
    uri = url + '/heavy'
    resp = requests.get(uri)
    #print "GET"
    #print "status_code = ", resp.status_code
    #print "resp = ", resp.text
    #print

def cmain(portno):
    global gcnt
    print "portno = ",portno
    while True:
        uri = url + ":" + str(portno)
        work(uri)
        gcnt += 1


def show_rate():
    global gcnt
    t0 = tm.time()
    while True:
        tm.sleep(5)
        t1 = tm.time()
        tps = gcnt/(t1-t0)
        print t0, gcnt, tps
        t0 = t1
        gcnt = 0

        

if __name__ == '__main__':
    
    #scale = 1
    #scale = 5
    #scale = 10
    #scale = 15
    #scale = 20
    #scale = 25
    scale = 6

    thread = [0] * scale
    show = threading.Thread(target=show_rate)

    for i in range(scale):
        portno = 3000 + i
        thread[i] = threading.Thread(target=cmain,args=(portno,))
        

    show.start()

    for i in range(scale):
        thread[i].start()





