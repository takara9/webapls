# OAuth2 認証アプリ


## 動作環境

* OAuth2 のサンプルプログラム
* marmot-k8s/manifests/istio-09-jwt の管理下のアプリケーションへ接続
* marmot-corednsにあるDNS,LDAP,CAが前提


## コンテナのビルド方法


~~~
docker build -t maho/webapl-11:1.0 .
~~~



## コンテナ単体での実行方法


~~~
# 対話型
docker run -it -p 3000:3000 maho/webapl-11:1.0 sh
# デーモン型
docker run -it -p 3000:3000 maho/webapl-11:1.0
~~~


## Docker Hub への登録


~~~
docker login
docker push maho/webapl-11:1.0
~~~


## Kubernetesへのデプロイ

~~~
kubectl apply -f spa-apl-11.yaml
~~~



