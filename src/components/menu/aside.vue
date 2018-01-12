<template>
  <div class="aside">
    <el-row class="tac">
      <el-col :span="24">
        <el-menu
          default-active="2"
          class="el-menu-vertical-demo"
          @open="handleOpen"
          @close="handleClose"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b">
          <!--循环导航-->
          <div v-for="(nav,a) in navigation">
            <el-submenu :index="spliceIndex(a)">
              <template slot="title">
                <i class="el-icon-location"></i>
                <span>{{nav.name}}</span>
              </template>
              <!--循环一级菜单-->
              <div v-if="nav.group">
                <div v-for="(menu,b) in nav.group">
                  <div v-if="menu.group">
                    <el-submenu :index="spliceIndex(a,b)" v-for="(submenu,c) in menu.group" :key="c">
                      <template slot="title">{{menu.name}}</template>
                      <el-menu-item :index="spliceIndex(a,b,c)">{{submenu.name}}</el-menu-item>
                    </el-submenu>
                  </div>
                  <div v-else>
                    <el-menu-item-group>
                      <el-menu-item :index="spliceIndex(a,b)">{{menu.name}}</el-menu-item>
                    </el-menu-item-group>
                  </div>
                </div>
              </div>
            </el-submenu>
          </div>
        </el-menu>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  export default {
    name: 'Aside',
    data () {
      return {
        navigation: [
          {
            name: '导航一',
            group: [
              {
                name: '选项3',
                url: 'xxxxx'
              },
              {
                name: '选项5',
                url: 'xxxxx'
              },
              {
                name: '选项4',
                group: [
                  {
                    name: '选项4-1',
                    url: 'xxxxx'
                  }
                ]
              }
            ]
          }
        ]
      }
    },
    methods: {
      handleOpen (key, keyPath) {
        console.log(key, keyPath)
      },
      handleClose (key, keyPath) {
        console.log(key, keyPath)
      },
      spliceIndex (a, b, c) {
        if (arguments.length === 1) {
          return a.toString()
        } else if (arguments.length === 2) {
          return a + '-' + b
        } else {
          return a + '-' + b + '-' + c
        }
      }
    }
  }
</script>

<style scoped>

</style>
