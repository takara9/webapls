# OIDC認証サーバーの利用方法


## ビルド

~~~
docker build -t maho/oidc-auth-server:1.0 .
docker push maho/oidc-auth-server:1.0
~~~


## MongoDBの起動

はじめにMongoDBを起動しておき、s01-clients.py を実行してDBを初期化する。

~~~
docker run -d -p 27017:27017 --name mongo --rm mongo
s01-clients.py
~~~


## OIDC認証サーバー起動

次にOIDC認証サーバーを起動では、-v の3つのパラメータが必須となる。

1.JWTに署名するための秘密鍵 key-private.pem
2.署名の検証のための公開鍵  key-public.pem
3.認証サーバーに必要なLDAPやMongoDBなどの接続先を記述した auth_config.py

~~~
docker run -it --link mongo --name auth -p 5810:5810 --rm \
-v `pwd`/key-private.pem:/app/key-private.pem \
-v `pwd`/key-public.pem:/app/key-public.pem \
-v `pwd`/auth_config.py:/app/auth_config.py \
maho/oidc-auth-server:1.0
~~~


## ローカル Harbor を利用するケース

ローカルのHarbor に保存して、実行するには、レジストリのタグを変更すれば良い。

~~~
$ docker login -u tkr harbor.labo.local
$ docker tag maho/oidc-auth-server:1.0  harbor.labo.local/marmot/oidc-auth-server:1.0 
$ docker push  harbor.labo.local/marmot/oidc-auth-server:1.0
$ docker run -it --link mongo --name auth -p 5810:5810 --rm \
-v `pwd`/key-private.pem:/app/key-private.pem \
-v `pwd`/key-public.pem:/app/key-public.pem \
-v `pwd`/auth_config.py:/app/auth_config.py \
harbor.labo.local/marmot/oidc-auth-server:1.0
~~~


## TODO
* docker-compose で手軽に mongodb とoidc-server を起動できるようにする。
* marmot-coredns に組み込んで、演習環境の一環に加える。
* LDAPの項目を追加して、実践的な内容にする。
* webapl-14-api-server-w-oauth と webapl-14-api-server-w-oauth を統合して一個のリポジトリにして、一つのサーバーからSPAアプリを含めて配信するようにする。
* 統合後は、YAMLを準備して、K8sへデプロイ、ISTIOとの連携が可能な構成にする。





