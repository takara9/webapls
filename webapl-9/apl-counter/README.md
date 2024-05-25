# Istioテスト用のマルチレイヤなマイクロサービス

REST サービスで、ID毎にカウントアップを実施する。



## ビルドからプッシュまで

~~~
$ docker build -t maho/ml-counter:1.0 .
$ docker run -it -p 5500:5500 maho/ml-counter:1.0
$ docker login
$ docker push maho/ml-counter:1.0
~~~


## コンテナ単体でのテスト方法

~~~
$ curl http://localhost:5500/ver
{
    "version": "1.0"
}

$ curl -X POST http://localhost:5500/count?id=1
{
    "counter": 1
}

$ curl -X POST http://localhost:5500/count?id=1
{
    "counter": 2
}

$ curl -X POST http://localhost:5500/count?id=1
{
    "counter": 3
}

$ curl -X POST http://localhost:5500/count?id=1
{
    "counter": 4
}

$ curl -X POST http://localhost:5500/count?id=4
{
    "counter": 1
}

$ curl -X POST http://localhost:5500/count?id=4
{
    "counter": 2
}

$ curl -X POST http://localhost:5500/count?id=1
{
    "counter": 5
}
~~~