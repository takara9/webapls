# -*- coding: utf-8 -*-
default["mysql"]["root_password"] = 'passw0rd'
default["mysql"]["db_name"] = 'testdb'
default["mysql"]["user"]["name"] = 'wordpress'
default["mysql"]["user"]["password"] = 'wordpress'
default["mysql"]["node"] = 'service'

# Pacemaker から起動する場合は、disableにする
#default["mysql"]["service"] == 'enable'
default["mysql"]["service"] == 'disable'


