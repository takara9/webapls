# bluemix-cloudant-coding-patterns
Bluemix Cloudant コーディング パターン サンプルコード


## 事前準備

node バージョンは、v4.4.7 で開発とテストを実施しています。

本サンプルコードを自己の環境へコピーします。

~~~
$ git clone https://github.com/takara9/bluemix-cloudant-coding-patterns
~~~

必要なパッケージをインストールします。

~~~
$ cd bluemix-cloudant-coding-patterns
$ npm install
~~~

## 認証パターン

Bluemix Cloudant サービス資格情報を cloudant_credentials.json に配置しておき読み込んで認証します。これにより、コードと認証情報を分離する事ができる様になります。

~~~
var cred = require('./cloudant_credentials.json');
var Cloudant = require('cloudant')
var cloudant = Cloudant(cred.credentials.url);
~~~

以下の認証情報の中で、"credentials"の中身が、Bluemix Cludant にサービス資格情報のコピペです。下記は、cloudant_credentials.json例です。

~~~
{
  "credentials": {
      "username": "c1d4ea7b-****-****-****-1d60f***1898-bluemix",
      "password": "****************************************************************",
      "host": "c1d4ea7b-d310-4dd4-a12d-1d60fc371898-bluemix.cloudant.com",
      "port": 443,
      "url": "https://c1d4ea7b-****-****-****-1d60fc371898-bluemix:****************************************************************@c1d4ea7b-d310-4dd4-a12d-1d60fc371898-bluemix.cloudant.com"
  }
}
~~~




## データベース作成パターン
データベース新規作成します。

~~~
var dbn = "testdb";
cloudant.db.create(dbn, function(err) {
    if (err) {
	throw err;
    }
});
~~~

ソースコード:[c01_create_database.js](https://github.com/takara9/bluemix-cloudant-coding-patterns/blob/master/c01_create_database.js)


## データベース削除パターン
データベース名を指定して削除します。

~~~
var dbn = "testdb";
cloudant.db.destroy(dbn, function(err) {
    if (err) {
    throw err;
    }
});
~~~

ソースコード:[c02_drop_database.js](https://github.com/takara9/bluemix-cloudant-coding-patterns/blob/master/c02_drop_database.js)


## データベースの選択パターン

データベース名を変数dbnに入れて、現在のデータベース・オブジェクト変数cdbへ設定する。

~~~
var dbn = "testdb";
var cdb = cloudant.db.use(dbn);
~~~

ソースコード:[c12_create_index_json.js](https://github.com/takara9/bluemix-cloudant-coding-patterns/blob/master/c12_create_index_json.js)


## インデックス処理パターン
Cloudantで検索結果をソートする場合、インデックスが必要になります。インデックスにはTEXTとJSON形式の２つの方法がありますので、２つのインデックスの作成パターンを提示します。

### インデックスのリストのパターン
作成済みのインデックスをリストします。

~~~
cdb.index(function(err, result) {
    if (err) {
      throw err;
    }
    console.log(JSON.stringify(result, null, 2));
});
~~~

ソースコード:[c11_list_indexs.js](https://github.com/takara9/bluemix-cloudant-coding-patterns/blob/master/c11_list_indexs.js)


### JSON形式のインデックスを設定するパターン
インデックスを設定するためのデザイン・ドキュメントです。 ddocはオプションでデザイン・ドキュメントの名前を指定するために設定します。省略した場合、Cloudantサーバー側で付与されます。

~~~
// JSON インデックス
var ddoc_name =  "index-json";
var key = "_design/" + ddoc_name;
var index = {
    type: "json",    // <-- デフォルトがJSON形式なので、省略可能です。
    name: "index-1", 
    ddoc: ddoc_name,
    index: {
	fields: ["count","age"]  // <-- json形式ではtypeを指摘できません。
    }
}
~~~

参考情報:[APIリファレンス Query](https://console.ng.bluemix.net/docs/services/Cloudant/api/cloudant_query.html#creating-an-index)

次のコードは、インデックスを作成するためのコードで、インデックス処理パターンで共通です。 create_index()は、インデックスが存在しない場合とする場合で、重複に同じコードを書かないためのものです。

~~~
// インデックス作成 (共通)
function create_index(index_name, callback) {
    cdb.index(index, function(err, response) {
	if (err) {
	    throw err;
	}
	console.log('Index creation result: %s', response.result);
	callback(err, response);
    });
}

// インデックスの更新
cdb.get(key, function(err,data) {
    if (err) {
        // 新規の場合
	create_index(index, function(err, response) {});
    } else {
    　　// 既に同じ _id のインデックスがある場合
	cdb.destroy(data._id, data._rev, function(err, body, header) {
	    if (err) {
		throw err;
	    }
	    console.log("deleted = ", key);
	    create_index(index, function(er, response) {});
	});
    }
});
~~~

ソースコード:[c12_create_index_json.js](https://github.com/takara9/bluemix-cloudant-coding-patterns/blob/master/c12_create_index_json.js)


### TEXT形式のインデックスを設定するパターン
JSON形式からの違いの部分だけを以下に提示します。

~~~
var ddoc_name =  "index-text";
var key = "_design/" + ddoc_name;
var index = {
    "type": "text",   // <-- ココがtextになります
    "name": "index-2", 
    "ddoc": ddoc_name,
    "index": {
	"fields": [
	    { "name": "count", "type": "number" },　// <-- TEXTインデックスの場合 typeを指定します。
	    { "name": "age",   "type": "number" }   //  
	]
    }
}
~~~

[c13_create_index_text.js](https://github.com/takara9/bluemix-cloudant-coding-patterns/blob/master/c13_create_index_text.js)


## データ挿入パターン

データを挿入する幾つかのパターンを提示します。

### コールバックでネストしながらデータを挿入パターン
以下のコードでは type を _id にセットするため、後の検索が高速になります。また、コールバックの中に次の挿入処理が入っているため、処理の順序が保証されます。

~~~
//        DATA
docs = [ { type: "rabbit", crazy: false, count: 10, age: 3, desc: "可愛い兎"},
 	 { type: "dog",    crazy: true,  count: 20, age: 3, desc: "大きな犬"},
	 { type: "mouse",  crazy: false, count: 30, age: 3, desc: "大きな鼠"},
	 { type: "cat",    crazy: true,  count: 30, age: 4, desc: "可愛い猫"} ]

// データのINSERT
cdb.insert( docs[0], docs[0].type, function(err, body, header) {
    if (err) {
	throw err;
    }
    console.log('You have inserted', body);
    cdb.insert( docs[1], docs[1].type, function(err, body, header) {
	if (err) {
	    throw err;
	}
	console.log('You have inserted', body);
	cdb.insert( docs[2], docs[2].type, function(err, body, header) {
	    if (err) {
		throw err;
	    }
	    console.log('You have inserted', body);
	    cdb.insert( docs[3], docs[3].type, function(err, body, header) {
		if (err) {
		    throw err;
		}
		console.log('You have inserted', body);
	    });
	});
    });
});
~~~

ソースコード:[c20_insert_data_nest.js](https://github.com/takara9/bluemix-cloudant-coding-patterns/blob/master/c20_insert_data_nest.js)

### ループでキーを指定してデータを挿入パターン
コールバックで処理せず、ノンブロッキングで実行します。これは、先行するcdb.insertの終了を待たずに、ループを回して、処理を開始させるためセッション数が膨大に増えるなどリスクがあるので注意が必要になります。

~~~
//        KEY       DATA
docs = { 'rabbit': { crazy: false, count: 10, age: 3, desc: "可愛い兎"},
 	 'dog':    { crazy: true,  count: 20, age: 3, desc: "大きな犬"},
	 'mouse':  { crazy: false, count: 30, age: 3, desc: "大きな鼠"},
	 'cat':    { crazy: true,  count: 30, age: 4, desc: "可愛い猫"}}

// データ挿入ループ
for(var key in docs) {
    console.log("key  = ",key);
    console.log("docs = ",docs[key]);
    cdb.insert(docs[key],key,function(err, body, header) {
	if (err) {
	    console.log("err : ", err);
	    throw err;
	}
	console.log('You have inserted', body);
    });
}
~~~

ソースコード:[c21_insert_data_key.js](https://github.com/takara9/bluemix-cloudant-coding-patterns/blob/master/c21_insert_data_key.js)


### ループでキーを指定せずデータを挿入パターン

ループでキーを指定せずデータを挿入します。キー(_id)は、Cloudant サーバー側で自動付与されるため、ログなどの保存に適しています。コールバックで処理せず、ノンブロッキングで実行するためスループットは向上しますが、セッション数が膨大に増えるなどリスクがあるので注意が必要必要です。

~~~
//        DATA
docs = [ { type: "rabbit", crazy: false, count: 10, age: 3, desc: "可愛い兎"},
 	 { type: "dog",    crazy: true,  count: 20, age: 3, desc: "大きな犬"},
	 { type: "mouse",  crazy: false, count: 30, age: 3, desc: "大きな鼠"},
	 { type: "cat",    crazy: true,  count: 30, age: 4, desc: "可愛い猫"} ]

// データ登録
for(var key in docs) {
    console.log("key=%d type=%s ",key, docs[key].type);
    cdb.insert(docs[key],function(err, body, header) {
	if (err) {
	    console.log("err : ", err);
	    throw err;
	}
	console.log('You have inserted', body);
    });
}
~~~

ソースコード:[c22_insert_data_uuid.js](https://github.com/takara9/bluemix-cloudant-coding-patterns/blob/master/c22_insert_data_uuid.js)

### CSVファイルを読み込んでデータを挿入パターン
CSVファイルを読み込んでデータを挿入します。ヘッダ行の列名を利用してJSON形式のデータを生成します。 cdb.insertをノンブロッキングでループを実行するため、スループットは良くなりますが、Cloudantとの接続数が大きくなり、問題が発生する可能性があります。

~~~
// CSVファイルの読み取り と データベースへの書き込み
var inputFile = "data1.csv"
var csv = require("fast-csv");
var csvstream = csv.fromPath(inputFile, { headers: true })
    .on("data", function (row) {
	//console.log("row ", row);
	row.count = Number(row.count);
	row.age = Number(row.age);
	row.crazy = (row.crazy == "true");

	// INSERT
	cdb.insert(row,row.type,function(err, body, header) {
	    if (err) {
		throw err;
	    }
	    console.log('You have inserted', body)
	});
    })
    .on("end", function () {
        console.log("終了")
    })
    .on("error", function (error) {
        console.log("error : ",error)
    });
~~~

ソースコード:[c23_insert_data_from_csv.js](https://github.com/takara9/bluemix-cloudant-coding-patterns/blob/master/c23_insert_data_from_csv.js)

### 配列を一度にロードするパターン
配列を一度にロードするので、大量のデータを高速でロードできます。キー(_id)はCloudantサーバーが自動で指定するので、データ固有のキー項目を利用する場合は、デザイン・ドキュメントを登録してインデックスを利用する必要があります。

~~~
//        DATA
data = [ { type: "rabbit", crazy: false, count: 10, age: 3, desc: "可愛い兎"},
 	 { type: "dog",    crazy: true,  count: 20, age: 3, desc: "大きな犬"},
	 { type: "mouse",  crazy: false, count: 30, age: 3, desc: "大きな鼠"},
	 { type: "cat",    crazy: true,  count: 30, age: 4, desc: "可愛い猫"} ]

cdb.bulk( {docs:data}, function(err) {
    if (err) {
	throw err;
    }
    console.log('Inserted all documents');
});
~~~

ソースコード:[c24_insert_data_bulk.js](https://github.com/takara9/bluemix-cloudant-coding-patterns/blob/master/c24_insert_data_bulk.js)

## データ取出しパターン

### キー指定でノンブロックで取得パターン
キーを指定してデータを取得する。ノンブロッキングで実行されるので、前のcdb.getが完了しない内に、次のcdb.getが実行されている、つまり平行してCloudant へ問い合わせが飛んでいるので、セッション数が上限を超えない様に注意が必要です。

~~~
// データ取り出し
var keys = ['rabbit','cat','mouse','dog'];
for (var i = 0; i < keys.length; i++) {
    cdb.get(keys[i], function(err,data) {
	console.log("data = ", data);
    });
}
~~~

ソースコード:[c30_get_non-block-mode.js](https://github.com/takara9/bluemix-cloudant-coding-patterns/blob/master/c30_get_non-block-mode.js)

### キー指定でコールバックで取得パターン
キーを指定してデータを取得する。コールバックの中で、ネストしてGETを実行するため、実行順序は保証されるが、スループットは良くないことを認識しておく必要がある。

~~~
// コールバック関数に入子にシーケンシャルにコールを行う
var keys = ['rabbit','cat','mouse','dog'];
cdb.get(keys[0], function(err,data) {
    if (err) {
	throw err
    }
    console.log("data = ", data);
    cdb.get(keys[1], function(err,data) {
	if (err) {
	    throw err
	}
	console.log("data = ", data);
	cdb.get(keys[2], function(err,data) {
	    if (err) {
		throw err
	    }
	    console.log("data = ", data);
	    cdb.get(keys[3], function(err,data) {
		if (err) {
		    throw err
		}
		console.log("data = ", data);
	    });
	});
    });
});	
~~~

ソースコード:[c31_get_callback.js](https://github.com/takara9/bluemix-cloudant-coding-patterns/blob/master/c31_get_callback.js)

### キー指定でasyncで順序指定で取得パターン
キーを指定してデータを取得する。asyncを利用して順番にcdb.getを実行する。前のcdb.get()処理が終了して、次のcdb.get()が実行するため順序性は保証されるが、スループットは遅いことを考慮に入れておく必要がある。

~~~
var async = require('async');
var keys = ['rabbit','cat','mouse','dog'];
async.series([
    function(callback) {
	cdb.get(keys[0], function(err,data) {
	    console.log("data = ", data);
	    callback(null);
	});
    },
    function(callback) {
	cdb.get(keys[1], function(err,data) {
	    console.log("data = ", data);
	    callback(null);
	});
    },
    function(callback) {
	cdb.get(keys[2], function(err,data) {
	    console.log("data = ", data);
	    callback(null);
	});
    },
    function(callback) {
	cdb.get(keys[3], function(err,data) {
	    console.log("data = ", data);
	    callback(null);
	});
    }],
    function(err) {
	console.log("end");
    }
);
~~~

ソースコード:[c32_get_async.js](https://github.com/takara9/bluemix-cloudant-coding-patterns/blob/master/c32_get_async.js)

# 更新パターン

## キーを指定してデータを更新パターン
キーを指定して更新するパターンです。 登録時にCloudantから自動でキーを生成するのではなく、アプリケーションのキーで登録しておくと、更新処理が高速におこなえる事になります。

~~~
var key = 'rabbit'
cdb.get(key, function(err,data) {
    console.log("Before update = ", data);
    data.count = data.count + 1;
    cdb.insert(data,key, function(err, body, header) {
	if (err) {
	    throw err;
	} 
	console.log("After update = ", body.ok);
    });
});
~~~

ソースコード:[c40_update_data.js](https://github.com/takara9/bluemix-cloudant-coding-patterns/blob/master/c40_update_data.js)

## リストパターン

### 全データのリストパターン
データベース内のドキュメントをリストします。

~~~
cdb.list(function(err, body) {
    if (err) {
	throw err;
    }
    body.rows.forEach(function(doc) {
	cdb.get(doc.key, function(err,data) {
	    if (err) {
		throw err;
	    }
	    console.log("key = ", doc.key);
	    console.log("get = ", data);
	});
    })
});
~~~

ソースコード:[c50_list_data.js](https://github.com/takara9/bluemix-cloudant-coding-patterns/blob/master/c50_list_data.js)


## 削除パターン

### キー指定でデータを削除するパターン
データを削除するためには、_id と _rev を二つ指定する必要があり、そのために key 指定で _id と _rev を取得して削除します。

~~~
var key = 'rabbit'
cdb.get(key, function(err,data) {
    console.log("data = ", data);
    cdb.destroy(key, data._rev, function(err, body, header) {
	if (err) {
	    throw err;
	}
	console.log("deleted = ", key);
    });
});
~~~

ソースコード:[c60_delete_data_by_id.js](https://github.com/takara9/bluemix-cloudant-coding-patterns/blob/master/c60_delete_data_by_id.js)

## FINDパターン

### 論理型の項目と一致するドキュメントをリストするパターン
FINDパターンで異なる部分は、検索式だけです。 検索実行のコードは同じものです。

~~~
// 検索式
query = {
    "selector": {
	"crazy": false   <-- 一致するデータにマッチします。
    },
    "fields": [
	"_id",
	"_rev",
	"type",
	"crazy"
    ]
}

// 検索実行
cdb.find(query,function(err, body) {
    if (err) {
	throw err;
    }
    console.log("Hits:",body.docs.length);
    for (var i = 0; i < body.docs.length; i++) {
	console.log(body.docs[i]);
    }
});
~~~

ソースコード:[c70_find_select_boolean.js](https://github.com/takara9/bluemix-cloudant-coding-patterns/blob/master/c70_find_select_boolean.js)


### 数値型の項目と一致するドキュメントをリストするパターン
数値の大小を比較する式は、[APIリファレンス 条件式](https://console.ng.bluemix.net/docs/services/Cloudant/api/cloudant_query.html#condition-operators) にあります。

~~~
query = {
    "selector": {
	"count": {
	    "$gt": 20  <-- 「APIリファレンス 条件式」に利用できるオペレータパターンがあります。
	}
    },
    "fields": [
	"_id",
	"_rev",
	"crazy",
	"count"
    ]
}
~~~

ソースコード:[c71_find_select_number.js](https://github.com/takara9/bluemix-cloudant-coding-patterns/blob/master/c71_find_select_number.js)

### 文字列型の項目と一致するドキュメントをリストするパターン
文字列に一致させる場合は、項目名と値を設定します。

~~~
// 検索式
query = {
    "selector": {
	"type": "dog"　<-- この条件にマッチするものが結果になります。
    },
    "fields": [
	"_id",
	"_rev",
	"crazy",
	"count"
    ]
}
~~~

ソースコード:[c72_find_select_string.js](https://github.com/takara9/bluemix-cloudant-coding-patterns/blob/master/c72_find_select_string.js)


### JSONインデックスでソートするパターン
この検索式を機能させるには、count, age に関するJSON形式のインデックスが作成されている必要があります。そして、selector の項目に、インデックスの項目を含むことで、ソートに利用できるインデックスが決定されます。 
JSON形式のインデックスを生成するコードは[c12_create_index_json.js](https://github.com/takara9/bluemix-cloudant-coding-patterns/blob/master/c12_create_index_json.js)です。

~~~
// 検索式
query = {
    "selector": {
	"count": { "$gt": 0 }  <-- これにより index が選択されます。
    },
    "fields": [
	"_id",
	"count",
	"age"
    ],
    "sort": [ { "count": "desc"}, 
	      { "age": "desc"}],
    "limit": 10
}
~~~

selectorにインデックス項目が指定されない場合は、_id のインデックスが採用され、期待通りのソートが実行されません。エラーも発生しないため、ソート結果が誤っている事に気づかない場合があり、注意が必要です。


ソースコード:[c73_find_sort_by_index_json.js](https://github.com/takara9/bluemix-cloudant-coding-patterns/blob/master/c73_find_sort_by_index_json.js)



### TEXTインデックスでソートするパターン
TEXTインデックスを利用する場合、項目の後に型を指定する必要があります。型は数値型 number、文字列型 string、論理型 boolean から指定できます。

~~~
query = {
    "selector": {
	"count": {
	    "$gt" : 0
	}
    },
    "fields": [
	"_id",
	"count",
	"age"
    ],
    "sort": [ { "count:number": "desc"}],  <-- 項目名の後に:number が必須
    "limit": 10,
    "use_index": "_design/index-text"
}
~~~

ソート項目に型が指定されない場合は次の様なエラーが発生します。

~~~
Error: Unknown Error: mango_idx :: {no_usable_index,missing_sort_index}
~~~

ソースコード:[c74_find_sort_by_use-index.js](https://github.com/takara9/bluemix-cloudant-coding-patterns/blob/master/c74_find_sort_by_use-index.js)

# SEARCHパターン

##  search用インデックスの登録パターン
search()で利用するインデックスを作成するためのデザイン・ドキュメントのパターンです。

~~~
// インデクサー
var indexer = function(doc) {
    index("type", doc.type);
    index("desc", doc.desc);
}

// デザイン・ドキュメント
var ddoc = {
    _id: '_design/index-search',
    indexes: {
	pets: {
	    analyzer: { name: 'standard'},
	    index   : indexer
	}	    
    }
};

// 登録
cdb.insert(ddoc, function (err, result) {
    if (err) {
	throw err;
    }
    console.log('Created design document', result);
});
~~~

ソースコード:[c80_search_create_index.js](https://github.com/takara9/bluemix-cloudant-coding-patterns/blob/master/c80_search_create_index.js)


### searchを使って日本語の検索パターン
前述のパターンで作成したインデックスを利用して検索するパターンです。

~~~
// 検索条件
ddoc_name = 'index-search';
index_name = 'pets';
query = {
    q:'desc:可愛い'
};

// SEARCH実行
cdb.search(ddoc_name, index_name, query, function(err, result) {
    if (err) {
	throw err;
    }
    console.log("Hits:",result.rows.length);
    for (var i = 0; i < result.rows.length; i++) {
	// GET
	cdb.get(result.rows[i].id, function(err,data) {
	    console.log("data = ", data);
	});
    }
});
~~~

ソースコード:[c81_search_by_index.js](https://github.com/takara9/bluemix-cloudant-coding-patterns/blob/master/c81_search_by_index.js)

