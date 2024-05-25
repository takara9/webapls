# Istioテスト用のシンプルなマイクロサービス

Python Flask で書いた RESTのサンプルアプリケーションです。
それぞれ、バージョンを返します。

## Docker Hub

Docker Hub ( https://hub.docker.com/r/maho/webapl7 )  に登録してあります。



## v1 ビルド、テスト、プッシュ

~~~
$ cd v1
$ docker build -t maho/webapl7:1.0 .
~~~

## ローカルでのテスト

~~~
$ docker run -it -p 5000:5000 maho/webapl7:1.0
~~~

異なるターミナルからcurlでアクセスすると、以下の応答がある。

~~~
$ curl http://localhost:5000/
version: 1.0
~~~

## Docker Hubへの登録

~~~
$ docker login
$ docker push maho/webapl7:1.0
~~~


## v2 ビルド、テスト、プッシュ

~~~
$ cd v2
~~~

あとは、以下のようにTAGを2.0に変更して実施

~~~
$ docker build -t maho/webapl7:2.0 .
$ docker run -it -p 5000:5000 maho/webapl7:2.0
$ docker push maho/webapl7:2.0
~~~
