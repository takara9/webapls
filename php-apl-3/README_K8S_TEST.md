# Kubernetesでアプリケーションを起動する



## 前提条件

* コンテナがレジストリへ登録されている事
* コンテナに与える設定ファイルとデータが出来ている事



## 作業計画作成

作業工程は以下になる。

1. 専用の名前空間の作成
1. MySQLの認証用のシークレット作成
1. MySQLの初期設定用SQL文のコンフィグマップ登録
1. MySQLの設定ファイルのコンフィグマップ登録
1. Redisの設定ファイルをコンフィグマップへ登録
1. NginxのHTTPSアクセス用の証明書と鍵をシークレットへ登録
1. Nginx設定ファイルをコンフィグマップへ登録
1. PHP-FPMの設定ファイルをコンフィグマップへ登録
1. MySQLのサービスとステートフルセットのマニフェストを作成
1. MySQLのデプロイ
1. Redisのサービスとステートフルセットのマニフェストを作成
1. Redisのデプロイ
1. NginxとPHP-FPMのサービスとデプロイメントのマニフェストを作成
1. NginxとPHP-FPMのポッドをデプロイ




## 専用の名前空間の作成

アプリ専用のネームスペースを作成して、デフォルトのネームスペースを変更する。

~~~
kubectl create ns petshop
kubectl config set-context ps --namespace=petshop --cluster=kubernetes --user=kubernetes-admin
kubectl config use-context ps
kubectl config get-contexts
~~~


## MySQLアクセスのシークレットの作成


~~~file:create_mysql_secret.sh
#!/bin/sh

MYSQL_DATABASE=`echo -n 'petshopdb' |base64`
MYSQL_ROOT_PASSWORD=`echo -n 'root' |base64`
MYSQL_USER_NAME=`echo -n 'petshop' |base64`
MYSQL_USER_PASSWORD=`echo -n 'petshop' |base64`

cat <<EOF | kubectl apply -f -
apiVersion: v1
kind: Secret
metadata:
  name: mysql-secret
type: Opaque
data:
  MYSQL_DATABASE: $MYSQL_DATABASE
  MYSQL_ROOT_PASSWORD: $MYSQL_ROOT_PASSWORD
  MYSQL_USER: $MYSQL_USER_NAME
  MYSQL_PASSWORD: $MYSQL_USER_PASSWORD
EOF
~~~


~~~
$ kubectl describe secret mysql-secret
Name:         mysql-secret
Namespace:    petshop
Labels:       <none>
Annotations:  
Type:         Opaque

Data
====
MYSQL_DATABASE:       9 bytes
MYSQL_PASSWORD:       7 bytes
MYSQL_ROOT_PASSWORD:  4 bytes
MYSQL_USER:           7 bytes
~~~



## MySQL初期化用データをコンフィグマップへ登録

ディレクトリ mysql_init にデータベース初期化用のSQL文のファイルを配置する。
このファイルをコンフィグマップ mysql-init に登録する。

~~~
$ kubectl create configmap mysql-init --from-file=mysql_init/
~~~
登録されたことの確認

~~~
$ kubectl get configmap mysql-init
NAME         DATA   AGE
mysql-init   1      13s
~~~
このコマンドでファイルの内容を見ることができる。

~~~
$ kubectl describe configmap mysql-init
~~~


## PHP-FPMの設定ファイルを登録

~~~
$ tree php_conf
php_conf
├── php-fpm.conf
├── php-fpm.d
│   └── www.conf
└── pini
~~~

~~~
$ kubectl create configmap php.ini --from-file=php_conf/php.ini
$ kubectl create configmap php-fpm.conf --from-file=php_conf/php-fpm.conf
~~~

~~~
$ kubectl create configmap php-fpm.d --from-file=php_conf/php-fpm.d
~~~


## NginxのTLS用証明書と鍵をシークレットへ登録


~~~
$ kubectl create secret tls cert --cert=nginx_cert/mahot.pem --key=nginx_cert/mahot.key
~~~


~~~
$ kubectl describe secret certkubectl describe secret cert
Name:         cert
Namespace:    petshop
Labels:       <none>
Annotations:  <none>

Type:  kubernetes.io/tls

Data
====
tls.crt:  4372 bytes
tls.key:  1679 bytes
~~~


## Nginx設定ファイルをコンフィグマップへ登録


~~~
$ kubectl create configmap nginx-conf --from-file=nginx_conf
~~~


## MySQLのサービスとステートフルセットのマニフェストを作成

別ページで説明


## MySQLのデプロイ

~~~
$ cd k8s
$ kubectl apply -f mysql-statefulset.yaml 
service/mysql created
statefulset.apps/mysql created
~~~

~~~
$ kubectl get pod -w
NAME      READY   STATUS     RESTARTS   AGE
mysql-0   0/1     Init:0/1   0          12s
nginx     1/1     Running    0          54m
mysql-0   0/1     PodInitializing   0          19s
mysql-0   1/1     Running           0          20s
~~~


~~~
$ kubectl get pvc
NAME               STATUS   VOLUME         CAPACITY   ACCESS MODES   STORAGECLASS      AGE
data-vol-mysql-0   Bound    pvc-d600f8e8-  10Gi       RWO            rook-ceph-block   2m9s
~~~

## Redisのマニフェスト


## Redis のデプロイ

~~~
$ kubectl apply -f redis-statefulset.yaml 
service/redis created
statefulset.apps/redis created
~~~

