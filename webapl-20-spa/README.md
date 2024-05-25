# Angular + OIDC認証のテストアプリ


## コードの修正


~~~
git clone ssh://git@github.com/takara9/webapl-20-spa
cd webapl-20-spa
~~~

~~~
git push
~~~


## コンテナのビルドとレジストリ登録

~~~
docker build -t maho/webapl-20-spa:0.1 .
docker login
docker push maho/webapl-20-spa:0.1
~~~

ビルドキャッシュのクリア

~~~
docker system df
docker builder prune
~~~

## コンテナとして実行


~~~
docker run -it --name t3 -p 4200:4200 maho/webapl-20-spa:0.1 bash
~~~


~~~
docker run -d --name t4 -p 4200:4200 maho/webapl-20-spa:0.1
~~~