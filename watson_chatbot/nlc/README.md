# NLC 構築用のスクリプト

チャットボットのNLCを作成、トレーニングするためのスクリプト

## 作成と削除
- create_trainingData_reactionDb.py : CSVからトレーニングデータの作成、反応DB作成
- create_nlc.js
- delete_nlc.js : NLCの削除
- delete_nlc_by_id.js


## 確認、テスト用
- get_nlc_info.js
- list_nlc.js
- list_cloudant_reactionDb.js
- search_cloudant_reactionDb.js
- test_nlc.js


## 定義ファイル、資格情報
- nlc_config.json : NLCインスタンス名、トレーニングファイルの定義
- nlc_id.json : create_nlc.js から作成されるNLCのidファイル
- cloudant_credentials_id.json -> ../cloudant_credentials_id.json : Cloudant 資格情報
- watson_nlc_credentials.json : Bluemix NLC 資格情報 のコピペ


## トレーニングデータ
- data/　

