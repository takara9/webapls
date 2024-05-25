///////////////////////////////////////////////
import { Component, OnInit } from '@angular/core';

/*
アウトレットにロードされたコンポーネントに関連付けられたルートに関する情報へのアクセスを提供します。
https://angular.io/api/router/ActivatedRoute
*/
import { ActivatedRoute }    from '@angular/router';



// https://angular.io/api/common/Location

import { Location }          from '@angular/common';

///////////////////////////////////////////////
import { Hero } from '../hero';                 // インタフェース
import { HeroService } from '../hero.service';  // 


///////////////////////////////////////////////
@Component({
  selector: 'app-hero-detail',
  templateUrl: './hero-detail.component.html',
  styleUrls: ['./hero-detail.component.css']
})


///////////////////////////////////////////////
export class HeroDetailComponent implements OnInit {

  // データ
  hero: Hero | undefined;


  // コンストラクター
  //   ここで引数に指定したインスタンスのメソッドが利用できるようになる。
  constructor(
    private route: ActivatedRoute,
    private heroService: HeroService,
    private location: Location
  ) {}


  // コンポーネンツを初期化する
  //   https://angular.io/guide/lifecycle-hooks#lifecycle-event-sequence
  ngOnInit(): void {
    this.getHero();
  }


  // URLのパスのIDから、該当するIDのデータを取り出す
  // 
  getHero(): void {
    /* 
       https://angular.io/api/router/ActivatedRoute#snapshot
       https://angular.io/api/router/ActivatedRouteSnapshot#paramMap
    */
    
    //const id = Number(this.route.snapshot.paramMap.get('id'));
    const id = parseInt(this.route.snapshot.paramMap.get('id')!, 10);

    // 
    this.heroService.getHero(id).subscribe(hero => this.hero = hero);
  }


  // 前のページへ戻る
  goBack(): void {
  
    // https://angular.io/api/common/Location#back
    this.location.back();
  }


  // データを更新する
  save(): void {
    if (this.hero) {
      this.heroService.updateHero(this.hero).subscribe(() => this.goBack());
    }
  }


}
