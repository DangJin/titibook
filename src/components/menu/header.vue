<template>
  <div class="header">
    <el-menu
      :default-active="activeIndex"
      @select="handleSelect"
      mode="horizontal"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b">
      <div v-for="(menu,f) in menus" :key="f">
        <el-submenu :index="f.toString()" v-if="menu.submenu">
          <template slot="title">{{menu.name}}</template>
          <el-menu-item :index="spliceIndex(f,s)" v-for="(sub,s) in menu.submenu" :key="s"> {{sub.name}}</el-menu-item>
        </el-submenu>
        <el-menu-item :index="f.toString()" v-else>{{menu.name}}</el-menu-item>
      </div>
    </el-menu>
  </div>
</template>
<script>
  export default {
    name: 'Header',
    data () {
      return {
        activeIndex: '0',
        menus: [
          {
            name: '工单1',
            url: 'http://www.baidu.com'
          },
          {
            name: '备案1',
            submenu: [
              {
                name: '工单2',
                url: 'http://www.baidu.com'
              },
              {
                name: '工单2',
                url: 'http://www.baidu.com'
              }
            ]
          }
        ]
      }
    },
    computed: {},
    methods: {
      handleSelect (key, keyPath) {
        console.log(key, keyPath)
      },
      /**
       * 拼接索引
       * @param f
       * @param s
       * @returns {string}
       */
      spliceIndex (f, s) {
        return (f + '-' + s)
      }
    }
  }
</script>

<style lang="scss">
  .header {
    color: white;
    .el-menu {
      .el-menu-item, .el-submenu {
        float: right;
      }
    }
    .el-menu--horizontal{
      .el-submenu{
        .el-menu{
          left: unset;
          right: 0;
        }
      }
    }
  }
</style>
