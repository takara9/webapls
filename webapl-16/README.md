# Webサーバー テストアプリ


Docker Hubにある[Nginx公式コンテナイメージ](https://hub.docker.com/_/nginx)は、コンテナ内でrootで実行されいます。そのため、セキュリティの固いKubernetes環境では動作させることができません。

この問題に対応するための、root以外のユーザーで実行する Nginx のDockerfile と関連ファイルです。
以下の手順でコンテナをビルドして、レジストリに登録することで、一般ユーザー nginx (uid=101, gid=101) で実行するコンテナを作成できます。

~~~
cd container
docker build -t nginx:anyuser .
docker login <server>
docker tag nginx:anyuser <registry-user>/nginx:anyuser
docker push <registry-user>/nginx:anyuser
~~~

Kubernetesへのデプロイでは、deployment.yaml の image を登録したレジストリに変更します。
そして、以下の手順でデプロイできます。

~~~
kubectl apply -f service.yaml
kubectl apply -f deployment.yaml
~~~

これにより Service の ClusterIP でデプロイされます。 type を Loadbalancer に変更することで、Kubernetesクラスタ外部へ公開もできます。
