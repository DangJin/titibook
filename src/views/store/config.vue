<template>
  <div class="" id="store-config">
    <!-- Note that row-key is necessary to get a correct row order. -->
    <div class="title"><i class="el-icon-menu"></i> 会员卡类型管理</div>
    <div class="operations">
      <el-button icon="el-icon-edit" @click="handleModify">添加</el-button>
      <el-button type="primary" :loading="loading.refresh" icon="el-icon-refresh" @click="handleRefresh"></el-button>
    </div>
    <el-table :data="list" row-key="id" border fit element-loading-text="给我一点时间"
              v-loading="loading.load"
              :default-sort="{prop: 'state', order: 'ascending'}">
      <el-table-column align="center" prop="id" class-name="drag-handle" label="#" width="50" type="index">
      </el-table-column>
      <el-table-column align="left" label="等级名称">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column align="left" label="创建时间" width="250">
        <template slot-scope="scope">
          <span>{{scope.row.modifyTime}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="350" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="success" @click="confirmEdit(scope.row)" size="mini"
                     icon="el-icon-circle-check-outline">编辑
          </el-button>
          <el-button type="danger" @click='handleDelete(scope.row)' size="mini"
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
    <!-- 修改弹窗 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="modifyVisible">
      <el-form ref="dataForm" :model="addData" label-position="left" label-width="100px"
               style='width:600px; margin-left:50px;'>
        <el-form-item label="等级名称" prop="name">
          <el-input v-model="addData.name"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="modifyVisible = false">取消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="handleAdd('dataForm')">添加</el-button>
        <el-button v-else type="primary" @click="handleSave">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import { stolevelList, addStolevel, uppStolevel, delStolevel } from '../../api/store/config'

  export default {
    name: 'store-config',
    data () {
      return {
        list: [],
        role: [],
        loading: {
          load: true,
          refresh: false,
          browse: true
        },
        params: {
          page: 1,
          limit: 10
        },
        page: {
          total: 0,
          currentPage: 0,
          pageSize: 0
        },
        browse: {
          Visible: false
        },
        addData: {
          id: '',
          name: ''
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
          1: 'success',
          2: 'info',
          4: 'danger'
        }
        return statusMap[status]
      },
      statusContent (status) {
        const statusMap = {
//          0删除状态1草稿状态2发布状态
          0: '禁用',
          1: '正常'
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
        stolevelList(this.params).then(response => {
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
        this.params.name = ''
        this.search = ''
        this.getList(true)
      },
      /**
       * 编辑
       */
      confirmEdit (row) {
        this.dialogStatus = 'update'
        this.modifyVisible = true
        this.addData.id = row.id
        this.addData.name = row.name
      },
      /**
       * 删除
       * @param row
       */
      handleDelete (row) {
        this.$confirm('此操作将永久删除该等级, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          delStolevel({del: row.id}).then(r => {
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
            console.log(e)
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
      },
      /**
       * 添加/修改
       */
      handleModify () {
        this.dialogStatus = 'create'
        this.modifyVisible = true
        this.addData = {
          name: ''
        }
      },
      /**
       * 添加
       */
      handleAdd (dataForm) {
        this.$refs[dataForm].validate((valid) => {
          if (valid) {
            let params = this.addData
            this.$store.dispatch('getCsrf').then(() => {
              addStolevel(params).then(
                r => {
                  if (r.data.value) {
                    this.$notify({
                      title: '成功',
                      message: r.data.data.message,
                      type: 'success'
                    })
                    this.handleRefresh()
                    this.modifyVisible = false
                  } else {
                    this.$notify.error({
                      title: '错误',
                      message: r.data.data.message
                    })
                  }
                }
              ).catch(
                e => { throw new Error('添加门店等级=>' + e) }
              )
            }).catch(error => {
              throw new Error('令牌获取=>' + error)
            })
          } else {
            return false
          }
        })
      },
      /**
       * 保存修改
       */
      handleSave () {
        let params = this.addData
        uppStolevel(params).then(r => {
          if (r.data.value) {
            this.$notify({
              title: '成功',
              message: r.data.data.message,
              type: 'success'
            })
            this.getList()
            this.modifyVisible = false
          } else {
            this.$notify.error({
              title: '错误',
              message: r.data.data.message
            })
          }
        }).catch(e => {
          throw new Error('修改角色=>' + e)
        })
      }
    }
  }
</script>

<style lang="scss">
  #store-config {
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
