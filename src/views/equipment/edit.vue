<template>
  <div id="edit-eqp">
    <div class="title"><i class="el-icon-arrow-left"></i> 添加设备</div>
    <div class="content">
      <el-form label-position="right" label-width="100px" :model="addData" :rules="rules">
        <el-form-item label="设备名称" prop="name">
          <el-input v-model="addData.name"></el-input>
        </el-form-item>
        <el-form-item label="设备说明" prop="name">
          <quill-editor ref="myTextEditor"
                        v-model="addData.Instructions"
                        :config="eidtor.editorOption">
          </quill-editor>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSave">立即保存</el-button>
          <el-button>取消</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
  import { eTypeList, uppeType } from '../../api/store/equipment-type'
  import VueQuillEditor from 'vue-quill-editor'

  export default {
    name: 'add-eqp',
    comments: {
      VueQuillEditor
    },
    data () {
      return {
        rules: {
          name: [
            {required: true, message: '请输入设备类型', trigger: 'blur'}
          ]
        },
        addData: {
          name: '',
          Instructions: 'Compose an epic...',
          state: 0
        },
        eidtor: {
          editorOption: {
            modules: {
              toolbar: [
                [{'size': ['small', false, 'large']}],
                ['bold', 'italic'],
                [{'list': 'ordered'}, {'list': 'bullet'}],
                ['link', 'image']
              ],
              history: {
                delay: 1000,
                maxStack: 50,
                userOnly: false
              },
              imageDrop: true,
              imageResize: {
                displayStyles: {
                  backgroundColor: 'black',
                  border: 'none',
                  color: 'white'
                },
                modules: ['Resize', 'DisplaySize', 'Toolbar']
              }
            }
          }
        }
      }
    },
    created () {
      // 获取url 参数
      let id = this.$route.query.id
      eTypeList({id: id}).then(response => {
        if (response.value) {
          let orgData = response.data.data.data[0]
          this.addData = {
            id: orgData.id,
            name: orgData.name,
            Instructions: orgData.name,
            state: orgData.name
          }
          console.log(orgData)
        } else {
          this.$notify.error({
            title: '错误',
            message: response.data.message
          })
          this.button.back.show = true
        }
      }).catch(error => {
        this.$notify.error({
          title: '错误',
          message: error.msg
        })
      })
    },
    methods: {
      onSave () {
        uppeType(this.addData).then(
          r => {
            if (r.data.value) {
              this.$notify({
                title: '成功',
                message: r.data.data.message,
                type: 'success'
              })
              setTimeout(_ => {
                this.$router.push({path: '/index/eqp'})
              }, 3000)
            } else {
              this.$notify.error({
                title: '错误',
                message: r.data.data.message
              })
              this.button.back.show = true
            }
          }
        ).catch(
          e => {
            this.$notify.error({
              title: '网络错误',
              message: '设备类型添加=>' + e
            })
            throw new Error('设备类型添加=>' + e)
          }
        )
      }
    }
  }
</script>
<style lang="scss">
  #edit-eqp {
    float: left;
    height: auto;
    padding: 0 15px;
    width: calc(100% - 30px);
    background-color: white;
    .title {
      width: 100%;
      float: left;
      font-size: 18px;
      line-height: 45px;
      font-family: "Microsoft YaHei";
    }
    .content {
      float: left;
      width: 50%;
      height: auto;
      .quill-editor {
        min-height: 400px;
        .ql-container {
          min-height: 400px;
        }
      }
    }
  }
</style>
