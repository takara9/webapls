# Python から dashDB をアクセスする on Bluemix or local

## 事前準備事項

このアプリを動作させるには、以下のアイテムが必要です。 開発プラットフォームに合わせて準備をします。

* [Bluemix アカウント](https://console.ng.bluemix.net/)
* [Bluemix CLI](https://clis.ng.bluemix.net/ui/home.html)
* [git](https://git-scm.com/)
* [Python](https://www.python.org/)

Bluemix CLI は bx login して 組織とスペースを設定しておきます。


## 本コードのクローン
このリポジトリを開発環境PCへコピーするために、下記のコマンド実行します。 

~~
git clone https://github.com/takara9/python-dashDB
cd python-dashDB
~~

## dashDB の起動

はじめにdashDBを起動しておく必要があります。 Bluemix のカタログ [dashDB for Analytics](https://console.ng.bluemix.net/catalog/services/dashdb-for-analytics?env_id=ibm:yp:us-south&taxonomyNavigation=cf-apps)からdashDBを作成できます。


## ローカルの実行

dashDBのサービス資格情報を **vcap-local.json** に設定します。 Bluemix のポータル サービス dashDB からサービス資格情報を作成して、ssldsn の項目をコピペでセットします。

~~~
{
    "services": {
	"dashDB": [
	    {
		"credentials": {
		    "ssldsn": サービス資格情報で置き換える"
		},
		"label": "dashDB"
	    }
	]
    }
}
~~~
必要な python パッケージのインストール

~~~
pip install -r requirements.txt
~~~
アプリの実行

~~~
python main.py
~~~

ブラウザから http://localhost:8080/ をアクセスして、python から dashDB をアクセスした結果を見ることができます。


## Bluemix へのデプロイ準備

manifest.yml を編集します。 dashDBの最後の２文字は作成時に動的にアサインされるので、Bluemix のダッシュボードから調べて書き換えます。

~~~
---
applications:
 - name: Python_dashDB
   random-route: true
   memory: 64M
   services:
   - dashDB for Analytics-iq
~~~
  

## Bluemix デプロイ実行
このフォルダで次のコマンドを実行して、デプロイします。

~~~
bx cf push
~~~
デプロイが完了したら、Bluemix ポータル 及び以下のコマンドで確認します。

~~~
bx cf apps
~~~





