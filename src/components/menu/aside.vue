<template>
  <div class="aside">
    <el-row class="tac">
      <el-col :span="24">
        <el-menu
          class="el-menu-vertical-demo"
          @open="handleOpen"
          @close="handleClose"
          @select="handleSelect"
          :router="true"
          :unique-opened="true"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b">
          <!--循环导航-->
          <div v-for="(nav,a) in navigation">
            <el-submenu :index="spliceIndex(a)">
              <template slot="title">
                <i :class="nav.icon"></i>
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
                      <el-menu-item :index="menu.url">{{menu.name}}</el-menu-item>
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
  import $ from 'jquery'

  export default {
    name: 'Aside',
    data () {
      return {
        navigation: [
          {
            name: '系统管理',
            icon: 'el-icon-setting',
            group: [
              {
                name: '权限管理',
                url: '/index/role'
              },
              {
                name: '管理员管理',
                url: '/index/admin'
              }
              // {
              //   name: '分组',
              //   group: [
              //     {
              //       name: '选项4-1',
              //       url: 'xxxxx'
              //     }
              //   ]
              // }
            ]
          },
          {
            name: '门店维护',
            icon: 'el-icon-location-outline',
            group: [
              {
                name: '门店基本配置',
                url: '/index/sto-config'
              },
              {
                name: '门店管理',
                url: '/index/store'
              }
            ]
          },
          {
            name: '运营管理',
            icon: 'el-icon-location-outline',
            group: [
              {
                name: '设备管理',
                url: '/index/eqp'
              },
              {
                name: '会员卡基本设置',
                url: '/index/card-config'
              },
              {
                name: '会员卡管理',
                url: '/index/card'
              },
              {
                name: '优惠券管理',
                url: '/index/coup'
              },
              {
                name: '积分规则管理',
                url: '/index/prules'
              }
            ]
          },
          {
            name: '财务管理',
            icon: 'el-icon-location-outline',
            group: [

              {
                name: '押金管理',
                url: '/index/store'
              },
              {
                name: '充值管理',
                url: '/index/store'
              }
            ]
          },
          {
            name: '平台管理',
            icon: 'el-icon-location-outline',
            group: [

              {
                name: '设备管理',
                url: '/index/store'
              }
            ]
          },
          {
            name: '微信管理',
            icon: 'el-icon-location-outline',
            group: [
              {
                name: '微信菜单配置',
                url: '/index/store'
              },
              {
                name: '微信素材管理',
                url: '/index/store'
              }
            ]
          },
          {
            name: '操作日志',
            icon: 'el-icon-location-outline',
            group: [
              {
                name: '设备管理',
                url: '/index/store'
              }
            ]
          },
          {
            name: '基础设置',
            icon: 'el-icon-location-outline',
            group: [
              {
                name: '通用设置',
                url: '/index/config'
              }
            ]
          }
        ]
      }
    },
    methods: {
      handleOpen (key, keyPath) {
        // console.log(key, keyPath)
      },
      handleClose (key, keyPath) {
        // console.log(key, keyPath)
      },
      handleSelect (key, keyPath) {
        // console.log(key, keyPath)
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
    },
    mounted: function () {
      $('.el-menu-vertical-demo').css('minHeight', document.documentElement.clientHeight - 60)
    }

  }
</script>

<style scoped>

</style>
