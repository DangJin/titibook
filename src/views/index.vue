<template>
  <div class="index">
    <el-container>
      <el-header>
        <Header></Header>
      </el-header>
      <el-container>
        <el-aside>
          <Aside>
          </Aside>
        </el-aside>
        <el-main>
          <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: bre.path }" v-for="(bre,index) in routerList" :key="index">{{bre.name}}
            </el-breadcrumb-item>
          </el-breadcrumb>
          <router-view/>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
  import Header from '../components/menu/header'
  import Aside from '../components/menu/aside'
  import { mapState } from 'vuex'

  export default {
    name: 'index',
    components: {Header, Aside},
    created () {
      this.getCurrentRoute()
    },
    computed: {
      ...mapState(
        {
          routerList: 'routerList'
        }
      )
    },
    watch: {
      $route () {
        this.getCurrentRoute()
      }
    },
    data () {
      return {}
    },
    methods: {
      getCurrentRoute () {
        this.routerList.length = 0
        let matched = this.$route.matched
        for (let i = 0; i < matched.length; i++) {
          let c = {
            path: matched[i].path,
            name: matched[i].name
          }
          this.routerList.push(c)
        }
        this.$store.commit('UPP_ROUTE', this.routerList)
      }
    }
  }
</script>

<style lang="scss">
  .index {
    .el-container {
      .el-header {
        padding: 0;
        width: 100%;
        Header {
          height: 100%;
          width: 100%;
        }
      }
      .el-container {
        .el-aside {
          width: 20%;
          height: 100%;
        }
        .el-main {
          width: 80%;
          padding: 10px 15px;
          .el-breadcrumb {
            height: 34px;
            line-height: 34px;
            margin-bottom: 10px;
            padding-left: 15px;
            background-color: #eee;
          }
        }
      }
    }
  }
</style>
