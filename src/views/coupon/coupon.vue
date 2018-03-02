<template>
  <div class="" id="coupon">
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
              :default-sort="{prop: 'state', order: 'ascending'}">
      <el-table-column align="center" prop="id" class-name="drag-handle" label="#" width="50" type="index">
      </el-table-column>
      <el-table-column width="300" align="center" label="名称">
        <template slot-scope="scope">
          <span>{{ scope.row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="使用门槛">
        <template slot-scope="scope">
          <span>满 {{scope.row.condition}} 可用</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="优惠金额">
        <template slot-scope="scope">
          <span> ￥{{scope.row.discount}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="剩余量/发行量(张)">
        <template slot-scope="scope">
          <span>{{scope.row.num-scope.row.send}}/{{scope.row.num}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="使用期限">
        <template slot-scope="scope">
          <span>{{scope.row.startDate.substring(0,10)}} 至 {{scope.row.endDate.substring(0,10)}}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" align="center" label="状态" prop="state"
                       :filters="[{ text: '已结束', value: '0' }, { text: '进行中', value: '1' },{ text: '进行中', value: '2' }]"
                       :filter-method="filterTag" filter-placement="bottom-end">
        <template slot-scope="scope">
          <el-tag :type="scope.row.state | statusFilter">{{ scope.row.state | statusContent }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="350" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <!--界面逻辑，如果"进行中"，显示"使失效";如果"未开始",显示"编辑，使失效-->
          <el-button v-if="scope.row.state === 0" type="success" @click="confirmEdit(scope.row)" size="mini"
                     icon="el-icon-circle-check-outline">编辑
          </el-button>
          <el-button v-if="scope.row.state !== 4" type="danger" @click='handleDelete(scope.row)' size="mini"
                     icon="el-icon-edit">使失效
          </el-button>
          <el-tag size="medium" v-if="scope.row.state ===4">已失效</el-tag>
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
      <el-form ref="dataForm" :model="addData" label-position="left" label-width="100px" :rules="rules"
               style='width:600px; margin-left:50px;'>
        <el-form-item label="名称" prop="title">
          <el-input v-model="addData.title"></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="">
          <el-input v-model="addData.content"></el-input>
        </el-form-item>
        <el-form-item label="使用门槛" prop="condition">
          <el-input v-model="addData.condition" type="number" min="1"></el-input>
        </el-form-item>
        <el-form-item label="优惠金额" prop="discount">
          <el-input v-model="addData.discount" type="number" min="0.01"></el-input>
        </el-form-item>
        <el-form-item label="发行量" prop="num">
          <el-input v-model="addData.num" type="number" min="1"></el-input>
        </el-form-item>
        <el-form-item label="使用期限" prop="">
          <el-date-picker type="date" placeholder="选择起始时间" v-model="addData.startDate"></el-date-picker>
          <el-date-picker type="date" placeholder="选择结束时间" v-model="addData.endDate"></el-date-picker>
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
  import { coupList, uppCoup, addCoup, delCoup } from '../../api/store/coupon'

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
          stoId: 0,
          del: 1,
          search: '',
          state: ''
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
          startDate: '',
          endDate: '',
          state: 0,
          condition: '',
          stoId: 0,
          num: '',
          discount: '',
          title: '',
          content: ''
        },
        search: '',
        modifyVisible: false,
        dialogStatus: '',
        textMap: {
          update: '编辑',
          create: '添加'
        },
        confirmEditRow: {},
        rules: {
          title: [
            {required: true, message: '优惠券名称必须在 1-10 个字内', trigger: 'blur'}
          ],
          condition: [
            {required: true, message: '请谨慎设置使用门槛，避免资金损失', trigger: 'blur'}
          ],
          discount: [
            {required: true, message: '优惠券面值必须大于等于 0.01 元', trigger: 'blur'}
          ],
          num: [
            {required: true, message: '发放总量必须是一个整数', trigger: 'blur'}
          ]
        }
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
          0: '未开始',
          1: '进行中',
          2: '已结束',
          4: '已失效'
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
        coupList(this.params).then(response => {
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
        this.addData.startDate = row.startDate
        this.addData.endDate = row.endDate
        this.addData.num = row.num
        this.addData.discount = row.discount
        this.addData.condition = row.condition
        this.addData.content = row.content
        this.addData.title = row.title
        this.addData.state = row.state.toString()
        this.addData.couId = row.couId
      },
      /**
       * 启用/注销
       * @param row
       */
      // handleDisable (row) {
      //   uppCoup({couId: row.couId, state: Number(!row.state), stoId: row.stoId}).then(
      //     r => {
      //       if (r.data.value) {
      //         this.$notify({
      //           title: '成功',
      //           message: r.data.data.message,
      //           type: 'success'
      //         })
      //         row.state = Number(!row.state)
      //         this.getList()
      //       } else {
      //         this.$notify.error({
      //           title: '错误',
      //           message: r.data.data.message
      //         })
      //       }
      //     }
      //   ).catch(
      //     e => {
      //       throw new Error('修改状态' + e)
      //     })
      // },
      /**
       * 删除角色
       * @param row
       */
      handleDelete (row) {
        this.$confirm('此操作将永久删除该优惠券, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          delCoup({del: row.couId}).then(r => {
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
          startDate: '',
          endDate: '',
          state: '',
          condition: '',
          stoId: 0,
          num: '',
          discount: '',
          title: '',
          content: ''
        }
      },
      /**
       * 添加角色
       */
      handleAdd (dataForm) {
        this.$refs[dataForm].validate((valid) => {
          if (valid) {
            let params = this.addData
            this.$store.dispatch('getCsrf').then(() => {
              addCoup(params).then(
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
                e => { throw new Error('添加优惠券=>' + e) }
              )
            }).catch(error => {
              throw new Error('令牌获取=>' + error)
            })
            console.log(valid)
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
        uppCoup(params).then(r => {
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
      filterTag (value, row) {
        return Number(row.state) === Number(value)
      }
    }
  }
</script>

<style lang="scss">
  #coupon {
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
