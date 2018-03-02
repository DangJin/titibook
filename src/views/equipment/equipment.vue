<template>
  <div class="" id="eqp">
    <!-- Note that row-key is necessary to get a correct row order. -->
    <div class="title"><i class="el-icon-menu"></i> 设备管理</div>
    <div class="operations">
      <el-input
        placeholder="请输入设备类型"
        v-model="search"
        prefix-icon="el-icon-search"
        clearable>
      </el-input>
      <el-button icon="el-icon-search" @click="handleSearch">搜索</el-button>
      <router-link to="/index/addEqo">
        <el-button icon="el-icon-edit">添加</el-button>
      </router-link>
      <el-button type="primary" :loading="loading.refresh" icon="el-icon-refresh" @click="handleRefresh"></el-button>
    </div>
    <el-table :data="list" row-key="id" border fit element-loading-text="给我一点时间"
              v-loading="loading.load"
              :default-sort="{prop: 'createTime', order: 'descending'}">
      <el-table-column align="center" prop="id" class-name="drag-handle" label="#" width="50" type="index">
      </el-table-column>
      <el-table-column align="center" label="名称">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column width="200" align="center" label="创建时间">
        <template slot-scope="scope">
          <span>{{scope.row.createTime}}</span>
        </template>
      </el-table-column>
      <el-table-column width="200" align="center" label="修改时间">
        <template slot-scope="scope">
          <span>{{scope.row.modifyTime}}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" align="center" width="200" label="状态">
        <template slot-scope="scope">
          <el-tag :type="scope.row.state | statusFilter">{{ scope.row.state | statusContent }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="350" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button v-if="scope.row.state == 1" @click='handleDisable(scope.row)' size="mini"
                     icon="el-icon-edit">注销
          </el-button>
          <el-button v-else-if="scope.row.state == 1 || scope.row.state == 0" @click='handleDisable(scope.row)'
                     size="mini" icon="el-icon-edit">启用
          </el-button>
          <router-link :to="{ path: 'editEqp', query: { id: scope.row.id }}">
            <el-button v-if="scope.row.state === 0" type="success" size="mini"
                       icon="el-icon-circle-check-outline">编辑
            </el-button>
          </router-link>
          <el-button v-if="scope.row.state === 0" type="danger" @click='handleDelete(scope.row)' size="mini"
                     icon="el-icon-edit">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination">
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page.sync="page.currentPage"
        :page-size="page.pageSize"
        layout="prev, pager, next, jumper"
        :total="page.total">
      </el-pagination>
    </div>
  </div>
</template>
<script>
  import { eTypeList, uppeType, deleType } from '../../api/store/equipment-type'

  export default {
    name: 'admin',
    data () {
      return {
        list: [],
        loading: {
          load: true,
          refresh: false
        },
        params: {
          page: 1,
          limit: 10,
          name: '',
          search: '',
          state: ''
        },
        page: {
          total: 0,
          currentPage: 0,
          pageSize: 0
        },
        search: '',
        modifyVisible: false,
        dialogStatus: '',
        textMap: {
          update: '编辑',
          create: '添加'
        },
        confirmEditRow: {}

      }
    },
    filters: {
      statusFilter (status) {
        const statusMap = {
          0: 'danger',
          1: 'success'
        }
        return statusMap[status]
      },
      statusContent (status) {
        const statusMap = {
//          0删除状态1草稿状态2发布状态
          0: '注销',
          1: '启用'
        }
        return statusMap[status]
      }
    },
    created () {
      this.getList()
    },
    methods: {
      /**
       * 获取数据
       * @param refresh
       */
      getList (refresh) {
        eTypeList(this.params).then(response => {
          if (response.value) {
            this.page = {
              total: response.data.data.total,
              pageSize: Number(response.data.data.per_page),
              currentPage: response.data.data.current_page
            }
            if (refresh) {
              this.loading.refresh = false
            }
            this.list = response.data.data.data
            this.loading.load = false
          } else {
            this.$notify.error({
              title: '错误',
              message: response.data.message
            })
          }
        }).catch(error => {
          this.$notify.error({
            title: '错误',
            message: error.msg
          })
        })
      },
      /**
       * 搜索
       */
      handleSearch () {
        this.params.name = this.search
        this.getList()
      },
      /**
       * 刷新
       */
      handleRefresh () {
        this.params.state = ''
        this.params.search = ''
        this.search = ''
        this.getList(true)
      },
      /**
       * 编辑
       */
      confirmEdit (row) {
        this.dialogStatus = 'update'
        this.modifyVisible = true
      },
      /**
       * 启用/注销
       * @param row
       */
      handleDisable (row) {
        uppeType({id: row.id, state: Number(!row.state)}).then(
          r => {
            if (r.data.value) {
              this.$notify({
                title: '成功',
                message: r.data.data.message,
                type: 'success'
              })
              row.state = Number(!row.state)
              this.getList()
            } else {
              this.$notify.error({
                title: '错误',
                message: r.data.data.message
              })
            }
          }
        ).catch(
          e => {
            throw new Error('修改状态' + e)
          })
      },
      /**
       * 删除角色
       * @param row
       */
      handleDelete (row) {
        this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          deleType({del: row.id}).then(r => {
            if (r.data.value) {
              this.$notify({
                title: '成功',
                message: r.data.data.message,
                type: 'success'
              })
              this.getList()
              // 删除动作
              const index = this.list.indexOf(row)
              this.list.splice(index, 1)
            } else {
              this.$notify.error({
                title: '错误',
                message: r.data.data.message
              })
            }
          }).catch(e => {
            throw new Error('删除设备类型->' + e)
          })
        }).catch(() => {
          this.$notify({
            title: '通知',
            message: '取消删除',
            type: 'info'
          })
        })
      },
      /**
       * 翻页
       * @param val
       */
      handleCurrentChange (val) {
        this.params.limit = this.page.pageSize
        this.params.page = val
        this.getList()
      },
      /**
       * 关闭弹窗
       */
      handleClose (done) {
        done()
      }
    }
  }
</script>

<style lang="scss">
  #eqp {
    float: left;
    height: auto;
    padding: 0 15px;
    background-color: rgb(248, 248, 248);
    .title {
      float: left;
      font-size: 18px;
      line-height: 45px;
      font-family: "Microsoft YaHei";
    }
    .operations {
      float: left;
      width: 100%;
      margin: 5px 0;
      .el-input {
        height: 20px;
        line-height: 20px;
        width: 200px;
      }
      .el-button {
      }
    }
    .el-table {
      .el-table-column {

      }
    }
    .pagination {
      float: left;
      .el-pagination {
        padding: 0;
        margin-top: 10px;
        margin-bottom: 10px;
        float: left;
      }
    }
  }

</style>
