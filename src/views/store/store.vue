<template>
  <div class="" id="store">
    <!-- Note that row-key is necessary to get a correct row order. -->
    <div class="title"><i class="el-icon-menu"></i> 门店管理</div>
    <div class="operations">
      <el-input
        placeholder=""
        v-model="search"
        prefix-icon="el-icon-search"
        clearable>
      </el-input>
      <el-button icon="el-icon-search" @click="handleSearch">搜索</el-button>
      <router-link to="/index/addStore">
        <el-button icon="el-icon-edit">添加</el-button>
      </router-link>
      <el-button type="primary" :loading="loading.refresh" icon="el-icon-refresh" @click="handleRefresh"></el-button>
    </div>
    <el-table :data="list" row-key="id" border fit element-loading-text="给我一点时间"
              v-loading="loading.load"
              :default-sort="{prop: 'createTime', order: 'descending'}">
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="table-expand">
            <el-form-item label="门店 ID">
              <span>{{ props.row.stono }}</span>
            </el-form-item>
            <el-form-item label="门店名称">
              <span>{{ props.row.stoname }}</span>
            </el-form-item>
            <el-form-item label="门店类型">
              <span>{{ props.row.isdirect |statusIsDirect}}</span>
            </el-form-item>
            <el-form-item label="所在地区">
              <span>{{ props.row.province}}-{{ props.row.city}}-{{ props.row.county}}</span>
            </el-form-item>
            <el-form-item label="门店地址">
              <span>{{ props.row.address }}</span>
            </el-form-item>
            <el-form-item label="门店描述">
              <span>{{ props.row.description }}</span>
            </el-form-item>
            <el-form-item label="创建时间">
              <span>{{ props.row.createTime }}</span>
            </el-form-item>
            <el-form-item label="更新时间">
              <span>{{ props.row.modifyTime }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="id" label="#" width="50" type="index">
      </el-table-column>
      <el-table-column align="center" width="170" label="编号">
        <template slot-scope="scope">
          <span>{{scope.row.stono}}</span>
        </template>
      </el-table-column>
      <el-table-column width="200" align="left" label="[类型]   名称">
        <template slot-scope="scope">
          <el-tag :type="scope.row.isdirect |statusFilter">{{scope.row.isdirect |statusIsDirect}}</el-tag>
          <span @click="handleBrowse(scope.row)" style="color: rgb(40,170,250)">{{ scope.row.stoname }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" width="170" label="省份">
        <template slot-scope="scope">
          <span>{{scope.row.province}}</span>
        </template>
      </el-table-column>
      <el-table-column width="300" align="center" label="详细地址">
        <template slot-scope="scope">
          <span>{{scope.row.address}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="账户余额">
        <template slot-scope="scope">
          <span>{{scope.row.moeny}}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" width="80" align="center" label="状态">
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
          <router-link :to="{ path: 'editStore', query: { stoId: scope.row.stoId }}">
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
    <el-dialog :title="browse.stoname+'-所有设备'" :visible.sync="browse.Visible" :before-close="handleClose">
      <el-table
        :data="browse.data"
        style="width: 100%"
        max-height="250">
        <el-table-column
          fixed
          type="index"
          label="#"
          width="150">
        </el-table-column>
        <el-table-column
          prop="equno"
          label="设备编号">
        </el-table-column>
        <el-table-column
          prop="name"
          label="设备类型"
          width="120">
        </el-table-column>
        <el-table-column
          prop="state"
          label="设备状态"
          width="120">
          <template slot-scope="scope">
            <el-tag :type="scope.row.state | statusFilter">{{ scope.row.state | statusForEqp }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="120">
          <template slot-scope="scope">
            <el-button
              @click.native.prevent="deleteEqp(scope.$index, browse.data)"
              type="text"
              size="small">
              移除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="table-pagination">
        <el-pagination
          small
          layout="prev, pager, next"
          @current-change="handleCurrentChange4Table"
          :current-page.sync="browse.page.currentPage"
          :page-size="browse.page.pageSize"
          :total="browse.page.total">
        </el-pagination>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import { storeList, delStore, uppStore } from '../../api/store/index'
  import { eqpList, delEqp } from '../../api/store/equipment'

  export default {
    name: 'store',
    data () {
      return {
        list: [],
        permission: [],
        loading: {
          load: true,
          refresh: false,
          browse: true
        },
        params: {
          page: 1,
          limit: 10,
          stoname: '',
          stono: '',
          search: '',
          state: ''
        },
        page: {
          total: 0,
          currentPage: 0,
          pageSize: 0
        },
        browse: {
          Visible: false,
          stoname: '',
          data: [],
          params: {
            page: 1,
            limit: 2,
            stoId: ''
          },
          page: {
            total: 1,
            currentPage: 1,
            pageSize: 0
          }
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
          //  0删除状态1草稿状态2发布状态
          0: '注销',
          1: '启用'
        }
        return statusMap[status]
      },
      statusIsDirect (status) {
        const statusMap = {
          0: '直营',
          1: '加盟'
        }
        return statusMap[status]
      },
      statusForEqp (status) {
        const statusMap = {
          0: '正常',
          1: '异常'
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
        storeList(this.params).then(response => {
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
       * 获取门店设备数据
       */
      getEqpList () {
        eqpList(this.browse.params)
          .then(
            r => {
              if (r.value) {
                this.browse.page = {
                  total: r.data.data.total,
                  pageSize: Number(r.data.data.per_page),
                  currentPage: r.data.data.current_page
                }
                this.browse.data = r.data.data.data

                console.log(this.browse.data)
              } else {
                this.$notify.error({
                  title: '错误',
                  message: r.data.message
                })
              }
            })
          .catch(
            e => {
              throw new Error('获取门店设备->' + e)
            }
          )
      },
      /**
       * 搜索
       */
      handleSearch () {
        this.params.search = this.search
        this.getList()
      },
      /**
       * 刷新
       */
      handleRefresh () {
        this.params.search = ''
        this.params.state = ''
        this.params.stoname = ''
        this.params.stono = ''
        this.params.state = ''
        this.getList(true)
      },
      /**
       * 注销 / 启用
       */
      handleDisable (row) {
        row.state = Number(!row.state)
        uppStore({stoId: row.stoId, state: row.state}).then(
          r => {
            if (r.data.value) {
              this.$notify({
                title: '成功',
                message: r.data.data.message,
                type: 'success'
              })
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
       * 浏览
       * @param row
       */
      handleBrowse (row) {
        this.browse.Visible = true
        this.browse.params.stoId = row.stoId
        this.browse.stoname = row.stoname
        this.getEqpList()
      },
      /**
       * 删除店铺
       * @param row
       */
      handleDelete (row) {
        this.$confirm('此操作将永久删除该门店, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          delStore({del: row.stoId}).then(r => {
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
            throw new Error('门店删除=>' + e)
          })
        }).catch(() => {
          this.$notify({
            title: '系统通知',
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
      handleCurrentChange4Table (val) {
        this.browse.params.limit = this.browse.page.pageSize
        this.browse.params.page = val
        this.getEqpList()
      },
      deleteEqp (index, table) {
        delEqp({del: index}).then(r => {
          if (r.data.value) {
            this.$notify({
              title: '成功',
              message: r.data.data.message,
              type: 'success'
            })
            this.getEqpList()
            // 删除动作
            this.browse.data.splice(index, 1)
          } else {
            this.$notify.error({
              title: '错误',
              message: r.data.data.message
            })
          }
        }).catch(e => {
          throw new Error('删除门店设备=>' + e)
        })
      },
      handleClose (done) {
        done()
      }
    }
  }
</script>

<style lang="scss">
  #store {
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
      .table-expand {
        font-size: 0;
        label {
          width: 90px;
          color: #99a9bf;
        }
        .el-form-item {
          margin-right: 0;
          margin-bottom: 0;
          width: 30%;
        }
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
    .el-transfer {
      margin: 0;
      width: calc(100% - 200px);
      padding: 0 100px;
      display: flex;
      flex-direction: row;
      justify-content: space-around;
      align-items: flex-start;
    }
  }

</style>
