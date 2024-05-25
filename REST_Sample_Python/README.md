# REST Service sample python code of Bluemix 

First of all, login to Bluemix.

Clone this code from GitHub to local PC

~~~
git clone https://https://github.com/takara9/REST_Sample_Python
~~~

## REST Server

* Change directory to restServerPython

* Edit manifest.yml: change Value of "random-route" from "false" to "true"

* Deploy application

~~~
$ bx cf push
~~~

* Copy URL of pyCalcxx line from the resutls of folowing command 

~~~
$ bx cf apps
~~~

* Create user-provided service

Make a user-provided service instance available to CF apps. In following sample command, replace Sample URI address to new URI of above.

~~~
bx cf cups pycalcxxu -p '{"username":"takara","password":"hogehoge","uri":"https://pycalcxx.mybluemix.net/calc"}' -r https://pycalcxx.mybluemix.net/calc
~~~


## REST Client

* Change directory to restClientPython

* Edit vcap-local.json. change from Sample URI to your URI in above.

* Execute client program.

~~~
$ php test_rest_clinet.php
~~~

You got results like a following.

~~~
$ php test_rest_clinet.php 
username = takara
password = hogehoge
REST Service URI = https://pycalcxx.mybluemix.net/calc
----------------------
Input A = 391.345
Input B = 5.4452
Result = 2130.951794
~~~





