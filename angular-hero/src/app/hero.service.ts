/*
  パッケージ @angular/core
    Angular のコア機能、低レベルのサービス、およびユーティリティを実装
      https://angular.io/api/core
  クラス Injector
    インターフェースを実装
      https://angular.io/api/core/Injector
*/ 
import { Injectable } from '@angular/core';

/*
  パッケージ @angular/common
     基本的な Angular フレームワーク機能を実装
  
  エントリポイント @angular/common/http
     Angular アプリ用の HTTP クライアント API を実装
       https://angular.io/api/common/http

  クラス HttpClient
     HTTPリクエストを処理するクラス
       https://angular.io/api/common/http/HttpClient

  クラス HttpHeaders
     HTTP 要求のヘッダー構成オプションを表わす
       https://angular.io/api/common/http/HttpHeaders
*/
import { HttpClient, HttpHeaders } from '@angular/common/http';


/*
  RxJS (Reactive Extensions for JavaScript) は、リアクティブ プログラミング用のライブラリ
  非同期またはコールバック ベースのコードの作成を容易する。
  ・非同期操作の既存のコードをオブザーバブルに変換する
  ・ストリーム内の値を反復処理する
  ・異なる型への値のマッピング
  ・ストリームのフィルタリング
  ・複数のストリームを構成する
  https://angular.io/guide/rx-library
  https://rxjs.dev/
  https://github.com/ReactiveX/rxjs
*/
import { Observable, of } from 'rxjs';


/*
  RxJSオペレーター
    オペレーターは機能であり２種類ある。
    Pipeableオペレーター　
    Creationオペレーター
    
    https://rxjs.dev/guide/operators
*/
import { catchError, map, tap } from 'rxjs/operators';


import { Hero } from './hero';
//import { HEROES } from './mock-heroes'; // ローカルにテストデータを置くケースに使用
import { MessageService } from './message.service';



////////////////////////////////////
/*
クラスを「@Injectable」でマークすると、クラスが注入されたときにクラスの依存関係を作成するために必要なメタデータがコンパイラによって生成されます。
*/

@Injectable({
  providedIn: 'root'
})

/*
   @Injectable と @Componentの違い

   @Component: クラスを Angular コンポーネントとしてマークし、実行時にコンポーネントを処理、インスタンス化、および使用する方法を決定する構成メタデータを提供するデコレーター
     https://angular.io/api/core/Component

   @Injectable: 依存関係として提供および注入できるようにクラスをマークするデコレーター。
     https://angular.io/api/core/Injectable
*/

////////////////////////////////////
export class HeroService {

  // プロパティ変数
  private heroesUrl = 'api/heroes';  // URL to web api
  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  // コンストラクター
  constructor(
    private http: HttpClient,              // HTTPでサーバーからデータを読み書きするクライアント
    private messageService: MessageService // エラーメッセージなどを画面表示する
  ) { }


  /*
   *  GET heroes でサーバーからデータを取得
   */
  getHeroes(): Observable<Hero[]> {
    /*
     * モックアップのデータを利用するケースに使用
     * const heroes = of(HEROES);
     * this.messageService.add('HeroService: fetched heroes');
     * return heroes;
     */

    /*
     *  サーバーからデータを取得するケースに使用 
     */
    return this.http.get<Hero[]>(this.heroesUrl)
      .pipe(
        tap(_ => this.log('fetched heroes')),
        catchError(this.handleError<Hero[]>('getHeroes', []))
      );
  }      
 
  /*
   *  GET IDでheroを取得 見つからない時に undefinedを返す
   */
  getHeroNo404<Data>(id: number): Observable<Hero> {
    const url = `${this.heroesUrl}/?id=${id}`;
    return this.http.get<Hero[]>(url)
      .pipe(
        map(heroes => heroes[0]), // returns a {0|1} element array
        tap(h => {
          const outcome = h ? 'fetched' : 'did not find';
          this.log(`${outcome} hero id=${id}`);
        }),
        catchError(this.handleError<Hero>(`getHero id=${id}`))
      );
  }

  /*
   *  URIのIDからHero(オブジェクト)を返す
   */
  getHero(id: number): Observable<Hero> {
    // For now, assume that a hero with the specified `id` always exists.
    // Error handling will be added in the next step of the tutorial.
    /*
       const hero = HEROES.find(h => h.id === id)!;
       this.messageService.add(`HeroService: fetched hero id=${id}`);
       return of(hero);
    */
    const url = `${this.heroesUrl}/${id}`;
    return this.http.get<Hero>(url).pipe(
      tap(_ => this.log(`fetched hero id=${id}`)),
      catchError(this.handleError<Hero>(`getHero id=${id}`))
    );
  }


  /*
   *  GET heroes 引数にマッチした配列を返す
   */
  searchHeroes(term: string): Observable<Hero[]> {
    if (!term.trim()) {
      // if not search term, return empty hero array.
      return of([]);
    }
    return this.http.get<Hero[]>(`${this.heroesUrl}/?name=${term}`).pipe(
      tap(x => x.length ?
         this.log(`found heroes matching "${term}"`) :
         this.log(`no heroes matching "${term}"`)),
      catchError(this.handleError<Hero[]>('searchHeroes', []))
    );
  }


  /*
   *  POST 新ヒーローをサーバーに追加する
   */
  addHero(hero: Hero): Observable<Hero> {
    return this.http.post<Hero>(this.heroesUrl, hero, this.httpOptions).pipe(
      tap((newHero: Hero) => this.log(`added hero w/ id=${newHero.id}`)),
      catchError(this.handleError<Hero>('addHero'))
    );
  }


  /*
   *  DELETE ヒーローをサーバーから削除
   */
  deleteHero(id: number): Observable<Hero> {
    const url = `${this.heroesUrl}/${id}`;
    return this.http.delete<Hero>(url, this.httpOptions).pipe(
      tap(_ => this.log(`deleted hero id=${id}`)),
      catchError(this.handleError<Hero>('deleteHero'))
    );
  }

  /*
   *  PUT ヒーローを更新する
   */
  updateHero(hero: Hero): Observable<any> {
    return this.http.put(this.heroesUrl, hero, this.httpOptions).pipe(
      tap(_ => this.log(`updated hero id=${hero.id}`)),
      catchError(this.handleError<any>('updateHero'))
    );
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   *
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  /** Log a HeroService message with the MessageService */
  private log(message: string) {
    this.messageService.add(`HeroService: ${message}`);
  }

}



