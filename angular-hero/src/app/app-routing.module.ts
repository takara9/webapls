import { NgModule }     from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

// コンポーネントのクラスとパスを指定
import { DashboardComponent }  from './dashboard/dashboard.component';
import { HeroesComponent }     from './heroes/heroes.component';
import { HeroDetailComponent } from './hero-detail/hero-detail.component';

// リンクのパスとコンポーネントを対応づける（ルーティングする）
const routes: Routes = [
  { path: '',           redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard',  component: DashboardComponent },
  { path: 'detail/:id', component: HeroDetailComponent },
  { path: 'heroes',     component: HeroesComponent }
];

// 画面を作るための部品
@NgModule({

  // テンプレートを利用するモジュールのセット
  imports: [
    CommonModule,
    RouterModule.forRoot(routes)
  ],
  
  // routerLink や router-outlet などのタグをHTMLで利用できるようにする。
  exports: [RouterModule]
})

/*
   他のモジュールで、インポートできるようにするための宣言
*/
export class AppRoutingModule { }
