<template>
  <div class="container">
  <h2>コンポーネント２</h2>
    <p>{{ msg }}</p>
    <button @click="count++">count is: {{ count }}</button>
    <p>カウンターをクリックするとカウントアップします。</p>
  </div>
</template>

<script>
var id_token = localStorage.getItem('id_token_payload');
console.log("id_token == " + id_token);
console.log("id_token == ============");

var access_token = localStorage.getItem('access_token');
console.log("access_token == " + access_token);
console.log("access_token == ============");

export default {
  name: 'Compo2',
  props: {
    msg: String
  },
  data() {
    return {
      count: 0,
    }
  },
  updated() {
  	    var id_token = localStorage.getItem('id_token_payload');
	    console.log("id_token == " + id_token);
  }
}
</script>