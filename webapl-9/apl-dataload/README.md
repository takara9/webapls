# Istioテスト用のマルチレイヤなマイクロサービス

キャッシュのコンテナにデータをロードさせるコンテナ

## ビルドからDocker Hub登録まで

~~~
$ docker build -t maho/ml-load:1.0 .
$ docker run -it -p 5000:5000 --link dstore -e DATASTORE_HOST=dstore -e DATASTORE_PORT=9080 maho/ml-load:1.0
$ docker login
$ docker push maho/ml-load:1.0
~~~


## コンテナレベルのテスト

登録のテスト

~~~
$ docker run -it --link dstore -e DATASTORE_HOST=dstore -e DATASTORE_PORT=5000 maho/ml-load:1.0
1000 There is more to life than increasing its speed.
1001 Without haste, but without rest.
1002 There is always light behind the clouds.
1003 If you can dream it, you can do it.
~~~

