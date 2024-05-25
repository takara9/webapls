# Access_tokenを検証してアクセス可否を判定するサンプルAPIサーバー


Vue.js ver3 によるSPA(Single Page Application)が,
OIDC認証サーバーによるユーザー認証とアクセス認可を得て、
保護コンテンツを含むAPIサーバーで連携して動作することを検証するものです。

このコードはAPIサーバーの役割を担います

他に必要なソフトウェア
* https://github.com/takara9/marmot-coredns （LDAP、DNS、CAサーバー 非K8s環境）
* https://github.com/takara9/webapl-12-oidc-server （OIDCサーバー、共有側ユーザー認証）
* https://github.com/takara9/webapl-13-spa-oauthh （シングルページアプリ+ OAuth/OIDC認証）



## コンテナのビルド

~~~
$ docker build -t test-app:3 .
~~~


## コンテナの実行

~~~
docker run -it -p 9000:9000 --link auth --name app3 --rm test-app:3
~~~




