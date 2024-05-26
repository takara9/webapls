# Goウェブサーバー テストページ


## IBM Cloud CloudFoundry アプリ(Bluemix PaaS) としてデプロイ方法

このリポジトリをクローン

~~~
git clone https://github.com/takara9/go_webpages --recursive
~~~

IBM Cloud CloudFoundy へデプロイ

~~~
bx cf push
~~~

これだけで、PaaSにGo言語のウェブサーバーのHTMLページがデプロできます。




## このデータの作り方

Golangのリポジトリから、このリポジトリのデータを作る方法です。

プロジェクトディレクトリをつくって、移動します。

~~~
mkdir ~/go/go_webpages
cd ~/go/go_webpages
~~~

GOPATH環境変数をセットします。 

~~~
export GOPATH=`pwd`
~~~

Go言語で書いたコードのリポジトリから、マスタープロジェクトを取得して、パッケージマネージャのgodepを取得します。

~~~
go get github.com/takara9/go_webserver2
go get github.com/tools/godep
~~~

マスタプロジェクトを指定して、godepで設定やコードを取得します。取得したコードはvendorディレクトリに配置されます。
そして、パッケージマネージャの定義ファイルは、Godepsに置かれます。

~~~
godep save github.com/takara9/go_webserver2
~~~

CloudFoundryにデプロイするために不要なファイルを削除しておきます。

~~~
rm -fr bin pkg src
~~~

gitリポジトリとして初期化します。

~~~
git init
~~~

vender のしたのgo_utilやgo_webserver2は、削除して、GitHub でサブモジュールとして登録します。
削除

~~~
rm -fr vender/github.com/takara9/go_util
rm -fr vender/github.com/takara9/go_webserver2
~~~
サブモジュールに登録

~~~
$ git submodule add https://github.com/takara9/go_util.git  go_util
$ git submodule add https://github.com/takara9/go_webserver2.git  go_webserver2
~~~

