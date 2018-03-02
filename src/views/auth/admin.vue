<template>
  <div class="" id="admin">
    <!-- Note that row-key is necessary to get a correct row order. -->
    <div class="title"><i class="el-icon-menu"></i> 管理员管理</div>
    <div class="operations">
      <el-input
        placeholder="请输入名称 | 账号"
        v-model="search"
        prefix-icon="el-icon-search"
        clearable>
      </el-input>
      <el-button icon="el-icon-search" @click="handleSearch">搜索</el-button>
      <el-button icon="el-icon-edit" @click="handleModify">添加</el-button>
      <el-button type="primary" :loading="loading.refresh" icon="el-icon-refresh" @click="handleRefresh"></el-button>
    </div>
    <el-table :data="list" row-key="id" border fit element-loading-text="给我一点时间"
              v-loading="loading.load"
              :default-sort="{prop: 'createTime', order: 'descending'}">
      <el-table-column align="center" prop="id" class-name="drag-handle" label="#" width="50" type="index">
      </el-table-column>
      <el-table-column width="300" align="center" label="名称">
        <template slot-scope="scope">
          <span @click="handleBrowse(scope.row)" style="color: rgb(40,170,250)">{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column width="300" align="center" label="账号">
        <template slot-scope="scope">
          <span>{{scope.row.account}}</span>
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
      <el-table-column class-name="status-col" align="center" label="状态">
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
          <el-button v-if="scope.row.state === 0" type="success" @click="confirmEdit(scope.row)" size="mini"
                     icon="el-icon-circle-check-outline">编辑
          </el-button>
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
    <!-- 修改弹窗 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="modifyVisible">
      <el-form ref="dataForm" :model="addData" label-position="left" label-width="100px"
               style='width: 500px; margin-left:50px;'>
        <el-form-item label="名称" prop="">
          <el-input v-model="addData.name"></el-input>
        </el-form-item>
        <el-form-item label="账号" prop="">
          <el-input v-model="addData.account"></el-input>
          <el-button size="mini" @click="resetPwd">重置密码</el-button>
          <span style="font-size: 6px;color: red;"> * 重置后密码为账号后六位</span>
        </el-form-item>
        <el-form-item label="管理员类型" prop="">
          <el-radio v-model="addData.type" label="0">加盟店</el-radio>
          <el-radio v-model="addData.type" label="1">直营店</el-radio>
        </el-form-item>
        <el-form-item label="状态" prop="">
          <el-radio v-model="addData.state" label="1">启用</el-radio>
          <el-radio v-model="addData.state" label="0">注销</el-radio>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="modifyVisible = false">取消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="handleAdd">添加</el-button>
        <el-button v-else type="primary" @click="handleSave">保存</el-button>
      </div>
    </el-dialog>
    <el-dialog :title="browse.name+'-所有角色'" :visible.sync="browse.Visible" :before-close="handleClose">
      <el-transfer
        v-loading="loading.transfer"
        filterable
        v-model="browse.has"
        :data="browse.data"
        :titles="['所有权限', '已有权限']"
        :button-texts="['移除', '添加']"
        @change="handlerTransfer">
      </el-transfer>
    </el-dialog>
  </div>
</template>
<script>
  import {
    adminList,
    addAdmin,
    uppAdmin,
    delAdmin,
    getperRoles,
    uppRole2Admin,
    getPerAdminRole
  } from '../../api/auth/admin'

  export default {
    name: 'admin',
    data () {
      return {
        list: [],
        role: [],
        loading: {
          load: true,
          refresh: false,
          browse: true,
          transfer: true
        },
        params: {
          page: 1,
          limit: 10,
          account: '',
          search: '',
          state: ''
        },
        page: {
          total: 0,
          currentPage: 0,
          pageSize: 0
        },
        browse: {
          sId: 0,
          name: '',
          data: [],
          has: [],
          Visible: false
        },
        addData: {
          sId: '',
          name: '',
          gender: '',
          type: '',
          password: '',
          state: ''
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
      getperRoles({all: 1, state: 1}).then(r => {
        if (r.value) {
          for (let i = 0; i < r.data.data.data.length; i++) {
            this.role.push({
              key: r.data.data.data[i].sId,
              label: r.data.data.data[i].name,
              disable: true
            })
          }
        }
      }).catch(e => {
        throw new Error('获取系统所有角色=>' + e)
      })
    },
    methods: {
      /**
       * 获取数据
       * @param refresh
       */
      getList (refresh) {
        adminList(this.params).then(response => {
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
        this.params.search = this.search
        this.getList()
      },
      /**
       * 刷新
       */
      handleRefresh () {
        this.params.account = ''
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
        this.addData.state = row.state.toString()
        this.addData.type = row.type.toString()
        this.addData.name = row.name
        this.addData.gender = row.gender
        this.addData.sId = row.sId
        this.addData.account = row.account
      },
      /**
       * 启用/注销
       * @param row
       */
      handleDisable (row) {
        uppAdmin({sId: row.sId, state: Number(!row.state)}).then(
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
       * 浏览
       * @param row
       */
      handleBrowse (row) {
        this.browse.Visible = true
        this.browse.data = this.role
        this.browse.has.length = 0
        this.browse.sId = row.sId
        this.browse.name = row.name
        getPerAdminRole({aId: row.sId})
          .then(
            response => {
              if (response.value) {
                this.loading.browse = false
                let has = []
                for (let i = 0; i < response.data.data.length; i++) {
                  has.push(response.data.data[i].sId)
                }
                this.browse.has = has
                this.loading.transfer = false
              }
            }
          )
          .catch(error => {
            throw new Error('查找角色=>' + error)
          })
      },
      /**
       * 添加/删除权限
       * @param value
       * @param direction
       * @param moveKeys
       */
      handlerTransfer (value, direction, moveKeys) {
        this.$store.dispatch('getCsrf').then(() => {
          uppRole2Admin({aId: this.browse.sId, roles: value.toString()})
            .then(
              r => {
                console.log(r)
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
            e => { throw new Error('添加角色=>' + e) }
          )
        }).catch(error => {
          throw new Error('令牌获取=>' + error)
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
          delAdmin({del: row.sId}).then(r => {
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
          sId: '',
          name: '',
          birthday: '',
          gender: '',
          type: '',
          password: '',
          state: ''
        }
      },
      /**
       * 添加角色
       */
      handleAdd () {
        let params = this.addData
        // 生成密码
        params.password = params.account.substring(6)
        this.$store.dispatch('getCsrf').then(() => {
          addAdmin(params).then(
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
            e => { throw new Error('添加管理=>' + e) }
          )
        }).catch(error => {
          throw new Error('令牌获取=>' + error)
        })
      },
      /**
       * 保存修改
       */
      handleSave () {
        let params = this.addData
        uppAdmin(params).then(r => {
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
      },
      resetPwd () {
        let params =
          {
            sId: this.addData.sId,
            password: this.addData.account.substring(6)
          }
        // 更新密码至最新
        this.addData.password = this.params.password
        uppAdmin(params).then(r => {
          if (r.data.value) {
            this.$notify({
              title: '成功',
              message: r.data.data.message,
              type: 'success'
            })
          } else {
            this.$notify.error({
              title: '错误',
              message: r.data.data.message
            })
          }
        }).catch(e => {
          throw new Error('重置密码=>' + e)
        })
      }
    }
  }
</script>

<style lang="scss">
  #admin {
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
