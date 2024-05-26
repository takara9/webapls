# Chatbot 応答用コーパスツール

| ファイル名       | 説明               |
|:-----------------|:-------------------|
| list_classes.py  | クラスリスト変換   |
| load_reply.py    | DBへのロード       |
| greetings.csv    | トレーニングデータ |
| classes.csv      | クラスリスト       |
| reply.csv        | 応答データ         |


# 事前準備

このディレクトリに、下記のvcap-local.jsonを作成して、Bluemix の Clondant のサービス資格情報を***の部分にセットします。

~~~
{
    "services": {
        "cloudantNoSQLDB": [
            {
                "credentials": {
		    "username": "***",
		    "password": "***",
		    "host": "***",
		    "port": 443,
		    "url": "***"
                },
                "label": "cloudantNoSQLDB"
            }
        ]
    }
}
~~~



# 応答データロードまでの流れ

(1) トレーニングデータから、クラスリストを作成します。

~~~
list_classes.py greetings.csv classes.csv
~~~
**classes.csv** はクラスの出現回数のリストです。

(2) sortコマンドを使って、カウント数の降順リストを作成します。

~~~
sort -t , -nrk2 classes.csv > reply.csv
~~~
**reply.csv** の編集前の状態は、次の様になっています。

~~~
良評価,24
挨拶,21
質問名前,8
質問状態,5
自己依頼,3
感謝,4
朝挨拶,3
<省略>
~~~


(3) **reply.csv** を編集して、応答データを作成します。

~~~
良評価,ありがとう
挨拶,こんにちは
質問名前,名前の質問に答える機能はありません、どうか私を育ててください
質問状態,状態の質問に答える機能はありません、どうか私を育ててください
自己依頼,自己紹介の機能はありません、 どうか私を育ててください
感謝,どういたしまして
朝挨拶,おはようございます
<省略>
~~~


(4) Cloudant の reply DBへ、メッセージを登録します。

~~~
./load_reply.py reply.csv
~~~

