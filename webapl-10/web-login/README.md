# HTTPSサーバーの作成

## コンテナのビルド＆プッシュ

~~~
docker build -t maho/web-login:0.1 .
docker push maho/web-login:0.1
~~~



## nginx の設定ファイルをConfigMapへ保存


~~~
kubectl create configmap nginx-config --from-file=default.conf

kubectl get cm nginx-config
NAME           DATA   AGE
nginx-config   1      14s
~~~


## サーバー証明書をsecretへ保存


~~~
curl -L -O https://ca.labo.local/sso.labo.local/sso.labo.local.crt 
curl -L -O https://ca.labo.local/sso.labo.local/sso.labo.local.key

kubectl create secret tls tls-secret \
  --cert=sso.labo.local.crt \
  --key=sso.labo.local.key

kubectl get secret tls-secret
NAME                       TYPE                                  DATA   AGE
tls-secret                 kubernetes.io/tls                     2      26s
~~~


## ログインページをデプロイ


~~~
kubectl apply -f web-login.yaml 
~~~



