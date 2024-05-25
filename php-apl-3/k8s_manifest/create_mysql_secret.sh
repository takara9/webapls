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








