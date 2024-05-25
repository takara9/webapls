# Istioテスト用のマルチレイヤなマイクロサービス



## ビルドとプッシュ方法

~~~
$ docker build -t maho/ml-cache:1.0 .
$ docker run -it -p 5000:5000 maho/ml-cache:1.0
$ docker login
$ docker push maho/ml-cache:1.0
~~~


## テスト方法

コンテナを起動しておく。--name をセットしないと、apl-dataloadのコンテナと連携できないので付加する。

~~~
$ docker run -it -p 5000:5000 --name dstore maho/ml-cache:1.0
~~~


別のターミナルから、curlコマンドで、データとIDの書込みのテスト

~~~
$ curl -X POST "http://localhost:5000/?id=1&val='HELLO'"
{
    "ret": "ok"
}
~~~


IDを使ってデータの取得のテスト

~~~
$ curl http://localhost:5000/?id=1
{
    "id": "'HELLO'"
}
~~~
