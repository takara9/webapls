# LDAPと連動する認証マイクロサービス

LDAPと連携して、OAuth2 認証を実行する REST-APIサーバーをコンテナで実行する。

基本的な動作は以下になる。

* コンテナのOAuth2サーバーが、JSON形式でユーザーとパスワードをPOSTで受け取る
* OAuth2 サーバーは LDAPサーバーと連携してユーザーを認証する
* ユーザーの認証が成功すると、HTTP 200 と トークン JWT をJSON形式で返す
* 認証が失敗すると、HTTP 401 を返す

LDAPは https://github.com/takara9/marmot-coredns で起動するサーバーをリファレンスにした。



##　コンテナのビルドとリポジトリへの登録

コンテナのリポジトリ名は maho/oauth-server としたが、変更してい利用もできる。
タグの 0.1 は、https://github.com/takara9/webapl-8　で利用しているので、0.2 を使用する。
0.1は、スタンドアロンでLDAPと連携しない簡易版です。

~~~
cd oauth-server
docker build -t maho/oauth-server:0.2 .
~~~

テストで起動する場合は、対話型で実行する。

~~~
docker run -it --name auth-server -p 5000:5000 --rm maho/oauth-server:0.2
~~~

バックグランドで起動する。

~~~
docker run -d --name auth-server -p 5000:5000 --rm maho/oauth-server:0.2
~~~

コンテナイメージのDocker Hubへの登録

~~~
docker login
docker push maho/oauth-server:0.2
~~~



## ローカル環境でテスト方法

認証のテスト

~~~
curl -i --header 'Content-Type: application/json' -d '{"userid":"sato","passwd":"secret"}' -X POST http://localhost:5000/login
~~~

JWTをバリデーションするためのJWKSの取得方法

~~~
curl -X GET http://localhost:5000/jwks
~~~



## Kubernetes環境でのテスト方法

デプロイ方法は、k8sディレクトリ下のYAMLをアプライする。

~~~
cd k8s
kubectl apply -f oauth-server.yaml
~~~

認証サービスは、ClusterIPでK8sクラスタ内部向けに提供するので、対話型のポッドを起動してテストする。

~~~
kubectl run -it mypod --image=maho/my-ubuntu:0.1 -- bash
curl -i --header 'Content-Type: application/json' -d '{"userid":"sato","passwd":"secret"}' -X POST http://oauth-server:8000/login
~~~


同様に対話型ポッドからJWKSを取得する

~~~
curl -X GET http://oauth-server:8000/jwks
~~~



