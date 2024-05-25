# Istioテスト用のマルチレイヤなマイクロサービス

## Version 1.0

~~~
$ docker build -t maho/ml-head:1.0 .

$ docker run -it --link dstore -e DATASTORE_HOST=dstore -e DATASTORE_PORT=5000 maho/ml-head:1.0


$ docker login
$ docker push maho/ml-head:1.0
~~~
