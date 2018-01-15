<template>
  <div class="app-container calendar-list-container">
    <!-- Note that row-key is necessary to get a correct row order. -->
    <div class="operations">
      <el-button type="primary" icon="document">导出excel
      </el-button>
    </div>
    <el-table :data="list" row-key="id" border fit highlight-current-row style="width: 100%"
              :default-sort="{prop: 'date', order: 'descending'}">
      <el-table-column align="center" prop="id" class-name="drag-handle" sortable label="序号" width="65">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column width="180px" align="center" label="日期">
        <template slot-scope="scope">
          <!--<span>{{scope.row.date | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>-->
        </template>
      </el-table-column>

      <el-table-column width="110px" align="center" label="姓名">
        <template slot-scope="scope">
          <span>{{scope.row.name}}</span>
        </template>
      </el-table-column>

      <el-table-column min-width="300px" align="center" label="地址">
        <template slot-scope="scope">
          <template v-if="scope.row.edit">
            <el-input class="edit-input" size="small" v-model="scope.row.address"></el-input>
            <el-button class='cancel-btn' size="small" icon="el-icon-refresh" type="warning"
                       @click="cancelEdit(scope.row)">取消
            </el-button>
          </template>
          <span v-else @click="handleLook(scope.row)">{{ scope.row.address }}</span>
        </template>
      </el-table-column>

      <el-table-column class-name="status-col" align="center" label="状态" width="100px">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status | statusFilter">{{ scope.row.status | statusContent }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="360px" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button v-if="scope.row.edit" type="success" @click="confirmEdit(scope.row)" size="mini"
                     icon="el-icon-circle-check-outline">保存
          </el-button>
          <el-button v-else type="primary" @click='handleUpdate(scope.row)' size="mini"
          icon="el-icon-edit">编辑
          </el-button>
          <el-button v-if="scope.row.status == 1" type="success" @click='scope.row.status = 2' size="mini"
                     icon="el-icon-edit">发布
          </el-button>
          <el-button v-else-if="scope.row.status == 2 || scope.row.status == 0"
                     @click='handleDraft(scope.row)'
                     size="mini" icon="el-icon-edit">草稿
          </el-button>
          <el-button v-if="scope.row.status == 0" @click='handleDraft(scope.row)' size="mini"
                     icon="el-icon-edit">回收
          </el-button>
          <el-button v-else type="danger" @click='handleDelete(scope.row)' size="mini" icon="el-icon-edit">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 修改弹窗 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :model="temp" label-position="left" label-width="70px"
               style='width: 400px; margin-left:50px;'>
        <el-form-item label="姓名" prop="">
          <el-input v-model="temp.name"></el-input>
        </el-form-item>
        <el-form-item label="日期" prop="date">
          <el-date-picker v-model="temp.date" type="datetime"
                          placeholder="Please pick a date"></el-date-picker>
        </el-form-item>
        <el-form-item label="地址" prop="">
          <el-input v-model="temp.address"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">添加</el-button>
        <el-button v-else type="primary" @click="confirmEdit">保存</el-button>
      </div>
    </el-dialog>
<!--查看-->
    <el-dialog title="查看" :visible.sync="dialogTableVisible">
      <el-table :data="handleLookData">
        <el-table-column property="name" label="姓名" width="150"></el-table-column>
        <el-table-column property="date" label="日期" width="200"></el-table-column>
        <el-table-column property="address" label="地址"></el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>


<script>
  import Sortable from 'sortablejs'

  export default {
    name: 'dragTable',
    data () {
      return {
        list: [
          {
            id: '1',
            date: '2016-05-03',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1518 弄',
            status: '0'
          },
          {
            id: '2',
            date: '2016-05-02',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1518 弄',
            status: '1'
          },
          {
            id: '3',
            date: '2016-05-04',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1518 弄',
            status: '1'
          },
          {
            id: '4',
            date: '2016-05-01',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1518 弄',
            status: '2'
          },
          {
            id: '5',
            date: '2016-05-08',
            name: '王大虎',
            address: '上海市普陀区金沙江路 1518 弄',
            status: '1'
          },
          {
            id: '6',
            date: '2016-05-06',
            name: '王打虎',
            address: '上海市普陀区金沙江路 1518 弄',
            status: '1'
          },
          {
            id: '7',
            date: '2016-05-07',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1518 弄',
            status: '0'
          }
        ],
        total: null,
        listQuery: {
          page: 1,
          limit: 10
        },
        sortable: null,
        oldList: [],
        newList: [],
        temp: [],
        dialogFormVisible: false,
        dialogTableVisible: false,
        handleLookData: [],
        dialogStatus: '',
        textMap: {
          update: '编辑',
          create: '创建'
        },
        confirmEditRow: {}

      }
    },
    filters: {
      statusFilter (status) {
        const statusMap = {
          0: 'danger',
          1: 'info',
          2: 'success'
        }
        return statusMap[status]
      },
      statusContent (status) {
        const statusMap = {
//          0删除状态1草稿状态2发布状态
          0: '删除',
          1: '草稿',
          2: '发布'
        }
        return statusMap[status]
      }
    },
    created () {
      this.getList()
    },
    methods: {
      getList () {
//         fetchList(this.listQuery).then(response => {
//           this.list = response.data.items
//           this.total = response.data.total
//           this.listLoading = false
//           this.oldList = this.list.map(v => v.id)
//           this.newList = this.oldList.slice()
//           this.$nextTick(() => {
//             this.setSort()
//           })
//         })
        this.list = this.list.map(v => {
          this.$set(v, 'edit', false)  // 可编辑属性
          v.originalAddress = v.address    // 编辑字段的备份
          return v
        })

        this.$nextTick(() => {  // 延迟回调获取更新后的 DOM
          this.setSort()
        })
      },
      // 拖拽
      setSort () {
        const el = document.querySelectorAll(
          '.el-table__body-wrapper > table > tbody'
        )[0]

        this.sortable = Sortable.create(el, {
          ghostClass: 'sortable-ghost', // Class name for the drop placeholder,
          handle: '.drag-handle', // 列表拖动选择器
          onEnd: evt => {
            const targetRow = this.list.splice(evt.oldIndex, 1)[0]
            this.list.splice(evt.newIndex, 0, targetRow)
            // for show the changes, you can delete in you code
            const tempIndex = this.newList.splice(evt.oldIndex, 1)[0]
            this.newList.splice(evt.newIndex, 0, tempIndex)
          }
        })
      },
      // 编辑取消
      cancelEdit (row) {
        row.address = row.originalAddress  // 数据还原
        row.edit = false
        this.$message({
          message: 'The title has been restored to the original value',
          type: 'warning'
        })
      },
      // 编辑保存
      confirmEdit () {
        let row = this.confirmEditRow
        this.dialogFormVisible = false
        row.originalAddress = row.address  // 原数据更新
        row.edit = false
        this.$message({
          message: 'The title has been edited',
          type: 'success'
        })
      },
      // 发布
      updateData () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            const tempData = Object.assign({}, this.temp)
            tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
//            updateArticle(tempData).then(() => {
//              for (const v of this.list) {
//                if (v.id === this.temp.id) {
//                  const index = this.list.indexOf(v)
//                  this.list.splice(index, 1, this.temp)
//                  break
//                }
//              }
//              this.dialogFormVisible = false
//              this.$notify({
//                title: '成功',
//                message: '更新成功',
//                type: 'success',
//                duration: 2000
//              })
//            })
          }
        })
      },
      // 草稿
      handleDraft (row) {
        row.status = 1
        this.$notify({
          title: '成功',
          message: '更改成功',
          type: 'success',
          duration: 2000
        })
      },
      // 发布
      handlePublish (row) {
        row.status = 2
        // 在此做发布操作
        this.$notify({
          title: '成功',
          message: '发布成功',
          type: 'success',
          duration: 2000
        })
      },
      // 编辑
      handleUpdate (row) {
        this.dialogFormVisible = true
        this.confirmEditRow = row
        this.temp = Object.assign({}, row) // copy obj
        this.dialogStatus = 'update'
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      // 查看
      handleLook (row) {
        let lookData = {
          name: row.name,
          date: row.date,
          address: row.address
        }
        console.log(row)
        this.dialogTableVisible = true
        this.handleLookData = []
        this.handleLookData.push(lookData)
      },
//      删除
      handleDelete (row) {
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          row.status = 0
          this.$notify({
            title: 'success',
            message: '删除成功!',
            type: 'success'
          })
          // 删除动作
          const index = this.list.indexOf(row)
          this.list.splice(index, 1)
        }).catch(() => {
          this.$notify({
            title: 'info',
            message: '已取消删除!',
            type: 'error'
          })
        })
      }
    }
  }
</script>

<style scoped>
  .operations{
    float: left;
    width: 100%;
    margin-bottom: 15px;
  }
  .operations button{
    width: 80px;
    height: 34px;
    padding: 0;
    line-height: 34px;
    text-align: center;
  }
  .sortable-ghost {
    opacity: 0.8;
    color: #fff !important;
    background: #42b983 !important;
  }
  .icon-star {
    margin-right: 2px;
  }

  .drag-handler {
    width: 20px;
    height: 20px;
    cursor: pointer;
  }

  .show-d {
    margin-top: 15px;
  }

  .edit-input {
    padding-right: 100px;
  }

  .cancel-btn {
    position: absolute;
    right: 15px;
    top: 10px;
  }
</style>
