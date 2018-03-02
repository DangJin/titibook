<template>
  <div id="config" ref="config">
    <el-tabs v-model="activeName" @tab-click="handleClick" tab-position="top">
      <el-tab-pane label="创建会员卡" name="index">
        <card-index></card-index>
      </el-tab-pane>
      <el-tab-pane label="领卡记录" name="obtain">
        <card-obtain></card-obtain>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import cardIndex from '../../components/card/card-index'
  import cardObtain from '../../components/card/card-obtain'

  export default {
    components: {cardIndex, cardObtain},
    name: 'config',
    comments: {
      cardIndex
    },
    mounted () {
      console.log(this.$refs.config.getBoundingClientRect().height)
    },
    data () {
      return {
        activeName: 'index'
      }
    },
    methods: {
      handleClick (tab, event) {
        console.log(tab, event)
      }
    }
  }
</script>

<style lang="scss">
  #config {
    .el-tabs {
      .el-tabs__header {
        background-color: white;
      }
      .el-tab-pane {
        min-height: 700px;
      }
    }
  }
</style>
