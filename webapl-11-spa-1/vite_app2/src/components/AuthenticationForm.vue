<!--
Todo 
  ・GitHubに登録する
  ・ログインの成功と失敗を表示する
  ・コンテンツを取得したら表示する
  ・コンテナ化して、K8sへデプロイする
-->

<template>
  <h2>{{ title }}</h2>
  <div id="app" class="container">
    <div class="form-group-1">
      <table>
        <tr>
          <th>アイテム</th>
          <th>I/Oエリア</th>
        </tr>
        <tr>
          <td width=100><label>ユーザーID</label></td>
          <td><input class="form-control" type="text" v-model="userid" placeholder="IDを入力"></td>
        </tr>
        <tr>
          <td><label >パスワード</label></td>
          <td><input class="form-control" type="password" v-model="passwd" placeholder="パスワード"></td>
        </tr>
        <tr>
          <td>メッセージ</td>
          <td align="left">{{ message }}</td>
        </tr>
        <tr>
          <td colspan=2 align=center><button class="login"  v-on:click="doAction">ログイン</button> 
          <button class="logout" v-on:click="doLogout">ログアウト</button></td>
        </tr>
      </table>
    </div>
    <div class="form-group-2">
      <button class="access"  v-on:click="doAccess">保護コンテンツ取得</button>
      <textarea class="form-control" readonly type="text" v-model="contents" cols=200></textarea>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
var message;
//var contents; 

function reset() {
  localStorage.removeItem('userid');
  localStorage.removeItem('passwd');
  localStorage.removeItem('authorization');
  localStorage.removeItem('contents');
  return;
}

// OAUTHサーバーからJWT取得
async function authorization(p_userid, p_passwd) {
  const config = {
    method: 'post',
    baseURL: 'http://oauth.labo.local:5100/',
    url: '/login',
    data: {
      userid: p_userid,
      passwd: p_passwd,
      message: [],
      contents: [],
    },
    headers: {
      'Content-Type': 'application/json'
    }
  }
  // OAuthサーバーをアクセス
  return await axios(config);
}

//　保護コンテンツの取得
async function getData() {
  const config = {
    method: 'get',
    baseURL: 'http://svc1.labo.local',
    url: '/json',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': localStorage.getItem('authorization')
    }
  }
  return await axios(config);
}

// Vue.js フレームワークの処理
export default {
  name: 'AuthenticationForm',
  props: {
    title: String
  },
  data() {
    return {
      message: '',
      userid: '',
      passwd: '',
      contents: ''
    }
  },  
  created() {
    let userid = localStorage.getItem('userid');
    if (userid != null){ this.userid = userid };
    let passwd = localStorage.getItem('passwd');
    if (passwd != null){ this.passwd = passwd };
    this.contents = null;
    this.message = null;
  },
  methods: {
    // ログイン
    doAction() {
      var test_token = 1;
      console.log('test0 ');
      authorization(this.userid, this.passwd)
      .then(response => {
        this.message = "ログインに成功しました。保護コンテンツにアクセスできます。";
        localStorage.setItem('authorization', response.headers['authorization']);
        localStorage.setItem('userid', this.userid);
        localStorage.setItem('passwd', this.passwd);
      })
      .catch(error => {
        this.message = "ログインに失敗しました。ユーザーIDとパスワードを確認してください。";
        reset();
      });
      // ここにコードを書くと、以下がaxiosの応答が帰る前に実行される
      console.log('test3 ');
    },
    // ログアウトとしてローカルストレージを消去する
    doLogout() {
      reset();
      this.message = "ログアウトしました";
      this.userid = null;
      this.passwd = null;
      this.contents = null;
    },
    // コンテンツの取得
    doAccess() {
        console.log("Do Access");
        getData().then(response => {
          console.log(response.data['slideshow']['title']);
          this.contents = response.data['slideshow']['title'];
        });

    }
  }
}
</script>

<style>
table {
  font-family: Arial, Helvetica, sans-serif;
  border-collapse: collapse;
  width: 100%;
}
td {
  border: 1px solid #ddd;
  padding: 8px;
}

th {
  padding-top: 12px;
  padding-bottom: 12px;
  text-align: left;
  background-color: #4CAF50;
  color: white;
  padding: 8px;
  text-align: center;
}
</style>