<template>
  <div class="container">
    <h2>コンポーネント３</h2>
    <p>認証を必要とする保護コンテンツです</p>
    <button v-on:click="count++">
       You clicked me {{ count }} times.
    </button>
    <p>
    SPAクライアント内でVue.js のルーターで認証を要求するサンプルで、
    認証を通過した場合、このコンテンツが表示されているはずです。
    </p>
  </div>
</template>

<script>
export default {
  name: 'Compo3',
  data() {
    return {
      count: 0,
    }
  },
  mounted() {
    // ログインの期間切れチェック
    checkExpair();
  },
}
</script>