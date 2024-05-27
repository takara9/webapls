# LINE Chat-Bot on SoftLayer and Bluemix

IBM Watson API を利用した Chat Bot のコードです。


## Bluemix, SoftLayer などのアカウントについて

このコードを実行するためには、次のアカウントが必要です。

- IBM Bluemix	  https://console.ng.bluemix.net/registration/	
- IBM SoftLayer	  https://www.softlayer.com/promo/freeCloud/free-cloud
- LINE BOT API    https://business.line.me/services/products/4/introduction
- OpenWaatherMap  http://openweathermap.org/appid
- Lets Encripts   https://letsencrypt.jp/

Bluemix, SoftLayerは、登録から1ヶ月間は無料で利用できます。また、Bluemixは、毎月の無料枠のを利用して無料で利用する事もできます。


## Nodeのバージョンについて

このChat Bot コードは、foever で バックグランドで 動作させるために Node v0.12.9 を使う様に開発しています。 複数のNode.js のバージョンを動かす方法は、Qiita 「node.js のバージョン管理ツール ndenv を試した」(http://qiita.com/MahoTakara/items/8fdebe32e8f326afa7f8) を参照してください。


## Python のバージョンについて

このセットアップ用のコードの一部に、Python 2.7.10 を利用して、開発しています。pyenv を利用して、Linux ディストリビューションに含まれない Python のバージョンをインストールする方法は、Qiita 「pyenv と slcli コマンドをインストールする手順」(http://qiita.com/MahoTakara/items/cbd861112b00da82c95b) の「pyenv の導入と設定」の章を参照してください。


## 前提 Bluemix API サービス について

このアプリケーションを動作させるための Bluemix の API サービスは以下です。

- Watson Natural Language Classifier
- Watson Retrieve and Rank
- Watson Dialog
- Watson Visual Recognition
- Cloudant NoSQL DB

Bluemix にログインして、各インスタンス１個を作成して、サービス資格情報(JSON形式)をコピペできる様にしてくください。 


## LINE BOT API について

LINE BOT API の Node APIライブラリは https://github.com/laziel/line-bot から fork した https://github.com/takara9/line-bot を利用します。 これにより Node v0.12.9 で動作が可能となり、LINE アカウントのプロファイル取得、写真などのファイルの取得ができる様になります。


## ファイルとフォルダの説明

- watson_chatbot.js : Chat Bot プログラム本体
- cloudant_credentials_id.json : Cloudant のBluemix から付与される資格情報のファイル
- nlc/ : NLCのインスタンス作成、訓練用コード、資格情報
- dialog/ : Dialog の XMLスキーマ、登録用などのコード、資格情報
- rr-solr/ : R&R Solrクラスタ作成、訓練などのコード、資格情報
- rr1/ : R&R Collection と Ranker 構築用コード 分野はガンダム
- rr2/ : R&R Collection と Ranker 構築用コード 分野はクラウド
- vr/ : Visual Recognition のテストコード、資格情報
- line_api/ : LINE API コールバック用のコード
- weather_report/ : OpenWeatherMap用のコード、天気コードと名称変換DB構築
- excel/ : NLC,R&R Ranker 訓練用、Cloudant 反応DBデータ


## 資格情報、証明書

以下のファイルは、それぞれ、手作業で作成する必要があります。

- line_api_credential.json : LINE Develper の資格情報 Chennel ID, Secret, MID のファイル
- openweathermap.json : OpenWatherMap の API Key の入ったファイル
- lets_encript.key : Let Encript の プライベート鍵
- lets_encript_fullchain.crt : Let Encript の 証明書
- nlc/watson_nlc_credentials.json : NLC の Bluemix 資格情報
- dialog/watson_dialog_credentials.json : Dialog の Bluemix 資格情報
- rr-solr/watson.rtrv_rank.auth.json : R&R の Bluemix 資格情報
- rr1/cluster_id.json : シンボリックリンク ln -s ../rr-solr/cluster_id.json .
- rr1/watson.rtrv_rank.auth.json : シンボリックリンク ln -s ../rr-solr/watson.rtrv_rank.auth.json .
- rr2/cluster_id.json : シンボリックリンク ln -s ../rr-solr/cluster_id.json .
- rr2/watson.rtrv_rank.auth.json : シンボリックリンク ln -s ../rr-solr/watson.rtrv_rank.auth.json .



# チャット ボットの起動方法

SoftLayer 仮想サーバーを起動する。 最小スペックは、Hourly CPU 1 core, RAM 1GB, Local DISK 25GB です。
一般ユーザーを作成して、そのHOMEディレクトリに、ndenv, pyenv をインストールして、Node.js と Python の実行環境を作成する。 GitHubからコードをサーバーにダウンロードする。


```
tkr@tkr02:~$ git clone https://github.com/takara9/watson_chatbot
tkr@tkr02:~$ cd watson_chatbot
```
前提となるサービスのBluemixのAPIサービスのインスタンスを作成して、クローンしたディレクトリに、前述の資格情報のJSONファイルを作成する。必要なnodeのバージョンをインストールして、ndenv で node のバージョンを確認する。

```
tkr@tkr02:~/watson_chatbot$ ndenv local
v0.12.9
tkr@tkr02:~/watson_chatbot$ node -v
v0.12.9
```
foever を npm でインストールして、watson_chatbot.js をバックグランドで起動する。

```
tkr@tkr02:~/watson_chatbot$ forever start ./watson_chatbot.js 
```



# API ライブラリ資料

- Watson Natural Language Classifier ( http://www.ibm.com/watson/developercloud/natural-language-classifier/api/v1/ )
- Watson Retrieve and Rank ( http://www.ibm.com/watson/developercloud/retrieve-and-rank/api/v1/ )
- Watson Dialog ( http://www.ibm.com/watson/developercloud/dialog/api/v1/ )
- Watson Visual Recognition ( http://www.ibm.com/watson/developercloud/visual-recognition/api/v3/ )
- Cloudant NoSQL DB ( https://github.com/cloudant/nodejs-cloudant )
- LINE BOD API ( https://github.com/takara9/line-bot )

