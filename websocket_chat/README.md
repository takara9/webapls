# websocket_chat
Minimal Web-chat application based on Express.js and websocket 

WebSocket と Express.js を利用した 最小のWebチャット・アプリ


前提条件 
* チャットのログを Cloudant に書き込むため、Bluemix の Cloudant のサービス資格情報を取得している必要があります。


利用方法

* git clone https://github.com/takara9/websocket_chat してローカルにコピーを作ります

* cd websocket_chat でディレクトリに移動します。

* Bluemix のダッシュボードから Cloudant を選択してサービス資格情報を表示します。このサービス比較情報にはJSON形式で、Cloudantを利用するために必要な情報がありますので、cloudant_credentials.json のファイルの中身と入れ替えます。

* npm install を実行して、package.jsonに定義されたパッケージをインストールします。

* node index.js でアプリケーションが実行されます。

* ブラウザから http://サーバーIPアドレス:3000/ をアクセスするとチャット画面が表示されます。



