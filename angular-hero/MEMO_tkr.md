# Angular についてのメモ


* コンポーネント https://angular.jp/guide/component-overview
* テンプレート   https://angular.jp/guide/template-overview
* ディレクティブ https://angular.jp/guide/built-in-directives


## コンポーネント

コンポーネントは Angular アプリケーションの主な構成要素です。
各コンポーネントは次のように構成されています。

* ページに表示するものを宣言する HTML テンプレート
* 振る舞いを定義する Typescript クラス
* テンプレート内でコンポーネントがどのように使用されるかを定義する CSS セレクター
* オプションで、テンプレートに適用される CSS スタイル


一つのコンポーネントは、３つのファイルで成り立っている。

~~~
app.component.css
app.component.html
app.component.ts
~~~

app.component.ts のように TypeScriptの拡張子 ts をもったファイルは、以下の構造をしている。

* インポート import 
* コンポーネント @Component
* エクスポートクラス export class HeroDetailComponent implements OnInit {}


## インポート import 

Angluarのライブラリ、アプリのコンポーネント、データ、サービスなどを、利用するために指定する。

import { <クラス名> } from 'クラスが格納されたファイルのパス'



## コンポーネント @Component

本コンポーネントのタグ、テンプレートのURLとスタイルシートを指定する

~~~
@Component({
  selector:    HTMLの中から引用するタグ
  templateUrl: HTMLのパスとファイル名
  styleUrls:   スタイルシートのファイル名
})
~~~

## エクスポートクラス

クラスのコンストラクター、プロパティ、メソッドなどを記述する。





## テンプレート

Angular では、テンプレートはユーザー インターフェイス (UI) のフラグメントの青写真です。テンプレートは HTML で記述され、特別な構文をテンプレート内で使用して、Angular の多くの機能を構築できます。


## ディレクティブ

ディレクティブは、Angular アプリケーションの要素に追加の動作を追加するクラスです。Angular の組み込みディレクティブを使用して、フォーム、リスト、スタイル、およびユーザーに表示されるものを管理します。

RouterModuleやなどの多くの NgModuleFormsModuleは、独自の属性ディレクティブを定義します。最も一般的な属性ディレクティブは次のとおりです。







