# Solr コレクションとランクの作成

## このディレクトリで、コレクションとランカー作成 

```
$ ./create_solr_collection.js 
$ ./upload_docs.js 
$ ./create_ranker_with_data.js
$ ./get_ranker_info.js 
```

"status"が、"Training" から "Available" に変わるまで待つ


## テスト

```
$ ./search_rank.js
$ ./search_solr_std_query_ja.js
```


## クリーンナップ

```
$ ./delete_ranker.js 
$ ./delete_solr_collection.js 
```


# ファイルの解説

### コレクション作成
- create_solr_collection.js
- upload_docs.js
- list_solr_collection.js

### ランカー作成とトレーニング
- create_ranker_with_data.js
- get_ranker_info.js
- list_ranker.js

### 削除
- delete_ranker.js
- delete_solr_collection.js

### 単体テスト用
- search_rank.js
- search_solr_std_query_ja.js

### トレーニングデータ、質問への回答
- input_docs/ : コレクションへアップロードする文書データ（質問への回答）
- training_qa/ : Ranker トレーニングデータ

### 資格情報など
- ranker_id.json : ランカーID
- rr_config.json : 設定ファイル
- cluster_id.json -> ../rr-solr/cluster_id.json : Solr クラスタID シンボリックリンク
- watson.rtrv_rank.auth.json -> ../rr-solr/watson.rtrv_rank.auth.json : RRの資格情報

