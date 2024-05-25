#!/bin/bash

DOMAIN=labo.local
HOST=oauth
FQDN=$HOST.$DOMAIN
ISTIO_FQDN=istio-ingressgateway.istio-system.k8s2.labo.local
EXPIRY_DATE=1825


if [ ! -f $DOMAIN.crt ] ; then
    # プライベート認証局証明書作成
    openssl req -x509 -sha256 -nodes -days $EXPIRY_DATE -newkey rsa:2048 -subj "/O=$HOST. /CN=$DOMAIN" -keyout $DOMAIN.key -out $DOMAIN.crt

    # サーバー証明要求
    openssl req -out $FQDN.csr -newkey rsa:2048 -nodes -keyout $FQDN.key -subj "/CN=$ISTIO_FQDN/O=$HOST Organization"

    # 認証局署名
    openssl x509 -req -days $EXPIRY_DATE -CA $DOMAIN.crt -CAkey $DOMAIN.key -set_serial 0 -in $FQDN.csr -out $FQDN.crt
fi


if [ "running" == $( kubectl cluster-info |awk 'NR==1 { print $4 }') ]; then
    echo "シークレット作成"
    kubectl create -n istio-system secret tls $HOST-credential --key=$FQDN.key --cert=$FQDN.crt
    echo "OAuthサーバーのデプロイ"
    kubectl apply -f auth-server.yaml
    echo "Istio GW,VS のデプロイ"
    kubectl apply -f istio-gateway.yaml
else
    exit 1
fi

kubectl get secret -n istio-system $HOST-credential
kubectl get gw
kubectl get vs
kubectl get svc
kubectl get deploy
kubectl get pod

exit 0


