# docker_chat

Bluemix コンテナの ibmnode をテンプレートとして、チャットアプリのコンテナを作成する。


コンテナの作成手順

* GitHubから本コードをクローンして、ディレクトリをwebsocket_chatへ移動します。

~~~
# git clone https://github.com/takara9/docker_chat
# cd docker_chat/websocket_chat
~~~

* package.json に定義されたパッケージをインストールします。

~~~
# npm install
~~~

* Cloudant のサービス資格情報を取得して、websocket_chat/cloudant_credentials.json を更新します。

* ローカルの環境に docker イメージをビルドします。　dockerが未インストール場合は、apt-get install docker.io を予め実行しておきます。

~~~
# cd ..
# docker build -t mynode:node1 .
~~~

* 自己のアカウントのネームスペース名を取得します。

~~~
# cf ic namespace get
takara_node
~~~

* 先に作成した docker イメージにタグを付けます。

~~~
# docker tag mynode:node1 registry.ng.bluemix.net/takara_node/mynode1
~~~

* ローカルで作成した docker イメージをBluemix のリポジトリに PUSH します。

~~~
# docker push registry.ng.bluemix.net/takara_node/mynode1
~~~

* 完了したら、以下のコマンドで登録された事を確認できます。

~~~
# cf ic images
REPOSITORY                                    TAG                 IMAGE ID            CREATED             SIZE
<中略>
registry.ng.bluemix.net/takara_node/mynode1   latest              54c09e04680e        3 minutes ago       190.9 MB
~~~

* Bluemixのリポジトリから、Bluemix IBMコンテナとして、コンテナを起動します。

~~~
# cf ic run -p 3000 --name mynode1 registry.ng.bluemix.net/takara_node/mynode1:latest
183a6898-cd39-457e-baf4-4ee7a7348761
~~~

* 起動の確認とコンテナIDを取得します。

~~~
# cf ic ps
CONTAINER ID        IMAGE                                                COMMAND             CREATED             STATUS                        PORTS               NAMES
183a6898-cd3        registry.ng.bluemix.net/takara_node/mynode1:latest   ""                  39 seconds ago      Shutdown (-1) 6 seconds ago   3000/tcp            mynode1
~~~

* 起動したコンテナ用に、パブリックIPアドレスをリクエストします。

~~~
# cf ic ip request
OK
The IP address "169.46.18.176" was obtained.
~~~

* パブリックIPアドレスを コンテナに結び付けます。

~~~
# cf ic ip bind 169.46.18.176 mynode1
OK
The IP address was bound successfully.
~~~

これで外部からアクセスできる様になりましたので、ブラウザから http://169.46.18.176:3000/ へアクセスします。


