# Solrクラスター作成


Solrクラスターの新規構築

```
$ ./create_solr_cluster.js 
$ ./getinfo_solr_clustor.js 
  "solr_cluster_status"が、"NOT_AVAILABLE" から "READY" に変わるまで待つ
```


もしSolrの設定を編集したら、忘れない様に、zipファイルにします

```
rr-solr/solr_config_ja$ ./make_config_pkg.sh 
```

Solrの設定ファイルをアップロードします

```
$ ./upload_solr_config_ja.js 
```


## rr1やrr2のディレクトリで、コレクションとランカー作成 

```
$ ./create_solr_collection.js 
$ ./upload_docs.js 
$ ./create_ranker_with_data.js
$ ./get_ranker_info.js 
  "status"が、"Training" から "Available" に変わるまで待つ
```

## テスト

```
$ ./search_rank.js
$ ./search_solr_std_query_ja.js
```



## クリーンナップ

```
$ ./delete_ranker.js 
$ ./delete_solr_collection.js 
$ ./delete_solr_cluster.js 
```


## ファイルの解説

- create_solr_cluster.js
- delete_solr_cluster.js
- delete_solr_config.js
- getinfo_solr_clustor.js
- list_solr_cluster.js
- list_solr_config.js
- upload_solr_config_ja.js


## 定義ファイル
- watson.rtrv_rank.auth.json
- rr_config.json
- cluster_id.json

## Solr 定義ファイルの保存場所
- solr_config_ja/