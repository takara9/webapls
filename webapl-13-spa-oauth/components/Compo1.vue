<template>
  <div class="container">
  <section>
    <h1>コンポーネント１</h1>
  </section>	
  </div>
</template>

<script>
export default {
  name: 'Compo1',
  props: {
    msg: String
  },
  data() {
    return {
      count: 0,
    }
  }
}
</script>

<style>
section {
  margin: 100px;
  padding: 20px;
  width: 544px;
  border-radius: 10px;
  border: 3px
  solid gray;
  background-color: palegreen;
}

</style>
