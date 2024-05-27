# Watson Dialog サービスのセットアップ方法

チャットボットの Dialog をセットアップ、アップデートするためスクリプト


## ファイルの説明

- create_dialog.js : itemno でdialog_config.jsonの定義を指定して対話を作成、dialog_id.jsonを書き込み
- list_dialogs.js : 作成済みの対話のリスト表示
- update_dialog.js : itemno で dialog_config.json の定義を指定して対話を更新
- unit_test_dialog.js : dialog_id.json の dialog_id に対して単体テスト
- delete_dialog.js : dialog_id.json の dialog_id を削除
- delete_dialog_by_id.js : 直接 dialog_id を編集して対話を削除

## 設定、資格情報
- dialog_id.json : 対話作成時に、付与されるdialog_idをJSON形式で保存したもの
- dialog_config.json : 対話のXMLスキームファイルと名前を定義したもの
- watson_dialog_credentials.json : Blumeix の Dialog 資格情報をコピペしたもの


## Dialog の会話スキームのフォルダdialogs

- explain_myname_history.xml : 名前の由来を説明する会話
- explain_myself.xml : 質問を受ける会話
- simple_piza_shop.xml : ピザオーダーテイク
- talk_yourself_movie.xml : 好きな映画のタイトル名と評価を聞く
- talk_yourself_noodle.xml : 好きな麺類を聞く








