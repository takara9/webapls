// 1. コンポーネントの定義（別ファイル）
import Compo1     from './components/Compo1.vue'
import Compo2     from './components/Compo2.vue'
import Compo3     from './components/Compo3.vue'
import Compo4     from './components/Compo4.vue'


// 2. ルートの定義
// 　　パスとコンポーネントのマップを定義する。
//     認証が必要なコンポーネントもこの部分で定義する
//     
const routes = [
    {
	path: '/',
	component: Compo1
    },
    {
	path: '/compo1',
	component: Compo1
    },
    {
	path: '/compo2',
	component: Compo2,
	props: {
            msg : "このページはVue.js v3 のルーターとコンポーネントで作っています。",
	}
    },
    {
	path: '/compo3',
	component: Compo3,
	meta: { requiresAuth: true }
    },
    {
	path: '/compo4',
	component: Compo4,
	props: {
            msg : "ようこそ、こんにちは!",
	},
	meta: { requiresAuth: true }
    },
]

// 3. ルーターインスタンスの作成
// 4. 履歴モードを設定する。ハッシュとHTML5モードから選択できる
// 
const router = VueRouter.createRouter({
    history: VueRouter.createWebHistory(),
    routes, 
})

// コンポーネントに遷移する前に、認証（トークン）の有無をチェックして
// トークンが無い場合は認証サーバーの画面へ飛ばす。
// 事前に認証サーバーに登録されていないと認証画面は表示されない
router.beforeEach((to, from, next) => {
    var access_token = localStorage.getItem('access_token');
    if (to.matched.some(record => record.meta.requiresAuth) && access_token == null) {
	// URLに付与するパラメーター文字列にして認証サーバーの認証画面へリダイレクト
	//var params = createAuthnReq(to.path)
	var params = createAuthnReq("/")
	console.log("params = " + params)
	// 認証画面へリダイレクト	
	window.location = authServer.authorizationEndpoint + "?" + params
    } else {
	// コンポーネントの画面へ
	next()
    }
});



// 5. Vueアプリケーションの生成
const app = Vue.createApp({});
// ルーターの設定
app.use(router);
// <div id="app"> の範囲にレンダリングされる
app.mount('#app');



