#!/usr/bin/env python
# -*- coding:utf-8 -*-

import os
from flask import Flask
app = Flask(__name__)
port = os.getenv("PORT")
listen_port = int(port if port else 5000)


@app.route('/')
def version():
    return 'version: 2.0\n'

app.run(host='0.0.0.0', port=listen_port, debug=True)

