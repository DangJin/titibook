<template>
  <div id="app">
    <keep-alive>
      <router-view/>
    </keep-alive>
  </div>
</template>

<script>
  export default {
    name: 'app'
  }
</script>
<style lang="scss">
  a{
    text-decoration: none;
  }
  li{
    list-style: none;
  }
</style>
