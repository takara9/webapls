
## コンテナネットワークの設定

コンテナ同士を連携させるためのネットワークを作成する

docker network create my_network 



## データベースの起動

業務データを保管するためにMySQL、作業中のデータを一時保管するためにRedisを使用する。



### MySQLサーバーの起動

MySQLのコンテナは、Docker Hubに保存された既成のコンテナを使用する。
このコンテナのAPIに従って、二つのディレクトリを準備する。

* mysql_sql: データベース初期化のSQL
* mysql_data: ローカルで起動する際に使用するデータ領域

~~~
docker run -d --net my_network --name mysql \
-v `pwd`/mysql_init:/docker-entrypoint-initdb.d \
-v `pwd`/mysql_data:/var/lib/mysql \
-e MYSQL_DATABASE=testdb \
-e MYSQL_ROOT_PASSWORD=root \
-e MYSQL_USER=dev \
-e MYSQL_PASSWORD=dev \
-p 3306:3306 mysql:5.7
~~~


### Redisサーバーの起動

PHPアプリケーションのセッションデータを保存するために、Docker Hub に保存されている Redisサーバーを利用する。

Redisはキャッシュであると同時に永続データを保存する機能があるので、ディレクトリを準備する。

* redis_data: Redisのデータ領域

~~~
docker run -d --net my_network --name redis \
-v `pwd`/redis_data:/data \
-p 6379:6379 redis:5.0.7
~~~



## アプリケーションの起動

アプリケーションは、二つのコンテナを組み合わせて構成する。
Nginx コンテナは、静的コンテンツを送出と暗号化を担当する。そして、PHPのアプリケーションの処理は PHP-FPMコンテナへリクエストする。
このために、NginxコンテナとPHP-FPMコンテナは、ディレクトリを共有する。



### アプリケーションの起動

アプリケーションの実行環境用コンテナは、CentOS7のコンテナをベースにして、独自にPHPとFPMの環境を独自にビルドしたものを使用する。

* htdocs: PHPアプリケーションのコードが入ったディレクトリ
* container/php.ini: PHP-FPM用の設定ファイル

~~~
docker run -d --net my_network --name fpm \
-e DB_USER=root \
-e DB_PASSWORD=root \
-v `pwd`/apl/php_apl:/var/www/html \
-v `pwd`/php_conf/php.ini:/etc/php.ini \
-v `pwd`/php_conf/php-fpm.conf:/etc/php-fpm.conf \
-v `pwd`/php_conf/www.conf:/etc/php-fpm.d/www.conf \
-p 9000:9000 maho/php-app:0.1
~~~


### Nginxサーバーの起動

* php_apl: PHPアプリケーションのコードが入ったディレクトリ
* cert: TLS暗号化用の証明書と鍵とファイル
* nginx-conf: NGINXの設定ファイル

~~~
docker run -d --net my_network --name nginx \
-v `pwd`/apl/php_apl:/usr/share/nginx/html  \
-v `pwd`/nginx_cert:/cert \
-v `pwd`/nginx_conf:/etc/nginx/conf.d \
-p 8443:443 -p 8080:80 nginx:1.17.8
~~~






## クリーンナップ


docker kill nginx fpm redis mysql
docker rm nginx fpm redis mysql
docker network rm my_network
sudo rm -fr mysql_data/*
sudo rm -fr redis_data/*





