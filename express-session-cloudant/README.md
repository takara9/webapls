# express-session sample on Bluemix

このコードに関する解説は、Qiita [Node.js Express4で Cloudant セッション・ストアの水平分散クラスタを構成する](http://qiita.com/MahoTakara/items/507dacf5a5dc81705d50) にありますので、合わせて参照してください。

# 実行するために必要事項

* [Bluemix アカウント](https://console.bluemix.net/)
* [Bluemix CLI のインストール](https://clis.ng.bluemix.net/ui/home.html)
* [Bluemix Cloudant Liteプランの作成](https://console.bluemix.net/catalog/services/cloudant-nosql-db?env_id=ibm:yp:au-syd)
* [git コマンドのインストール](https://github.com/)


# ローカル環境で実行する場合

1. Bluemix で Cloudant Lite プランを作成します。
2. vcap-local.jsonファイルを編集して、Cloudantのサービス資格情報をセットします。
3. 必要なモジュールをインストール

~~~
npm install
~~~

(4) セッション・ストア用のデータベースを作成します。

~~~
node ./create_db.js
~~~

(5) アプリをスタートします。

~~~
npm start 
~~~


# Bluemix CFコンテナで動作させる場合

(1) Bluemix で Cloudant Lite プランを作成します。
(2) manifest.yml を編集します。 編集箇所は以下の２箇所です。

~~~
applications:
- path: .
  memory: 128M
  instances: 2
  domain: mybluemix.net
  name: express-session-test
  host: express-session-test-tkr  <---　重複ない様にする
  disk_quota: 1024M
services:
- Cloudant NoSQL DB-zj  <--- 自分のインスタンス名に変更する
~~~

(3) bx cf push で、Bluemix 上にデプロイする

~~~
$ bx cf push
~~~


# Dockerコンテナとしてローカルで動作させる場合
ローカルのMacやWindowsに、Docker環境がインストールされている必要があります。

1. vcap-local.jsonを編集
2. npm install で必要なモジュールをインストール
3. docker build -t express-session .   コンテナをビルド
4. docker run -p 3000:3000 -t express-session  ローカル環境で実行開始
5. http://localhost:3000/foo でカウント・アップのテスト


# シングルのDockerコンテナとしてBluemix上で動作させる場合

1. bx login  Bluemixへログイン
2. bx cr login  コンテナ・レジストリへログイン 
3. bx ic init  コンテナの認証情報初期化
4. bx ic namespace-set / namespace-get ネームスペースの設定と取得
5. イメージをタグ付け docker tag express-session registry.ng.bluemix.net/[your_name_space]/express-session
6. イメージをレジストリへ登録 docker push registry.ng.bluemix.net/[your_name_space]/express-session
7. パブリックIPを取得 bx ic ip-request
8. コンテナ起動コマンド bx ic run --name tkrX -m 128 -p [public_ip_address]:3000:3000 --env "CCS_BIND_SRV=Cloudant NoSQL DB-j9" registry.ng.bluemix.net/takara_node/express-session


# マルチ・インスタンスのDockerコンテナとしてBluemix上で動作させる場合
前述の項目 8 を以下に置き換えて実行する

1. bx ic group-create --name tkrZ -m 128 -n tkr -d mybluemix.net --min 2 --max 3 --desired 2 -p 3000 --env "CCS_BIND_SRV=Cloudant NoSQL DB-j9" registry.ng.bluemix.net/[your_name_space]/express-session


