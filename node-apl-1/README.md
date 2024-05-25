Node.js サンプルアプリケーション


## アプリの実行

~~~
cd myapp
npm install
npm start
~~~


## コンテナの作成

~~~
docker build –t myapp:0.1 .
~~~


## コンテナの実行

~~~
docker run –d –p 3000:3000 --name myapp myapp:0.1
~~~


