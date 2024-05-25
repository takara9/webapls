// Angular のモジュール
import { NgModule }         from '@angular/core';
import { BrowserModule }    from '@angular/platform-browser';
import { FormsModule }      from '@angular/forms'; // <-- NgModel lives here
import { HttpClientModule } from '@angular/common/http';

// トップ画面、メニュー遷移、メッセージを制御するモジュール
import { AppComponent }        from './app.component';
import { DashboardComponent }  from './dashboard/dashboard.component';
import { AppRoutingModule }    from './app-routing.module';
import { MessagesComponent }   from './messages/messages.component';

// 個々の画面表示、インプットを処理
import { HeroesComponent }     from './heroes/heroes.component';
import { HeroDetailComponent } from './hero-detail/hero-detail.component';
import { HeroSearchComponent } from './hero-search/hero-search.component';

// RESTサーバーのシュミレート用
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { InMemoryDataService } from './in-memory-data.service';

/*
  ここに設定されたクラスによって、HTMLでカスタムなタグが利用できる
*/
@NgModule({
  // このモジュールに属するコンポーネント
  declarations: [
    AppComponent,
    DashboardComponent,
    MessagesComponent,
    HeroesComponent,
    HeroDetailComponent,
    HeroSearchComponent    
  ],
  // テンプレートを利用するコンポーネント
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    // The HttpClientInMemoryWebApiModule module intercepts HTTP requests
    // and returns simulated server responses.
    // Remove it when a real server is ready to receive requests.
    HttpClientInMemoryWebApiModule.forRoot(
      InMemoryDataService, { dataEncapsulation: false }
    )    
  ],
  //providers: [],
  // 最初に呼び出されるコンポーネント
  bootstrap: [ AppComponent ]
})

/*
 AppModuleは、../main.ts から呼び出される
*/
export class AppModule { }
