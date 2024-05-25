<template>
  <div class="container">
    <h2>コンポーネント４</h2>
    <p>{{ msg }}</p>
    この画面は、認証を通過した場合、このコンテンツが見えるはずです。    
    <button @click="count++">カウンタ {{ count }}</button>
  </div>
</template>

<script>
export default {
  name: 'Compo4',
  props: {
    msg: String
  },
  data() {
    return {
      count: 0,
    }
  },
  mounted() {
    // ログインチェック
    checkExpair();
  },
}
</script>