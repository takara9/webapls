#!/usr/bin/env python
# -*- coding:utf-8 -*-
import os
from flask import Flask
from flask_restful import Resource, Api, reqparse
from flask_httpauth import HTTPBasicAuth

# for Health Check
class HelloWorld(Resource):
    def get(self):
        return {'message': 'Hello World'}

# for POST
class Calc(Resource):
    auth = HTTPBasicAuth()
    @auth.login_required
    def post(self):
        args = parser.parse_args()
        ans = float(args['a']) * float(args['b'])
        return {'ans': ans }

    @auth.verify_password
    def verify_password(username, password):
        return username == 'user' and password == 'pass'


if __name__ == '__main__':

    app = Flask(__name__)
    api = Api(app)
    api.add_resource(Calc, '/calc')
    api.add_resource(HelloWorld, '/')

    parser = reqparse.RequestParser()
    parser.add_argument('a')
    parser.add_argument('b')

    bx_port = os.getenv("PORT")
    listen_port = int(bx_port if bx_port else 5000)
    app.run(host='0.0.0.0', port=listen_port, debug=True)
