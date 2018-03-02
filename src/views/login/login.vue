<template>
  <div id="login">
    <el-container>
      <el-header>
        <el-row>
          <el-col :span="20">
            <div class="grid-content bg-purple-dark">
              <h4>码上快跑</h4>
            </div>
          </el-col>
          <el-col :span="4">
            <div class="grid-content bg-purple-dark">
              <a href="">注册</a>
            </div>
          </el-col>
        </el-row>
      </el-header>
      <el-main>
        <el-card class="box-card">
          <h1>码上快跑-后台登录</h1>
          <el-form :model="loginForm" status-icon :rules="rules" ref="loginForm" label-width="100px" class="loginForm">
            <el-form-item label="账号" prop="account">
              <el-input type="tel" v-model="loginForm.account"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="pass">
              <el-input type="password" v-model="loginForm.pass" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item>
              <el-checkbox v-model="remember">记住密码</el-checkbox>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitForm('loginForm')">登录</el-button>
              <el-button @click="resetForm('loginForm')">重置</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-main>
    </el-container>
  </div>
</template>
<script>
  import { Base64 } from 'js-base64'

  export default {
    name: 'login',
    mounted () {
      if (localStorage.getItem('user')) {
        let user = JSON.parse(localStorage.getItem('user'))
        this.loginForm.account = user.account
        this.loginForm.pass = Base64.decode(user.pass)
      }
    },
    data () {
      let validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'))
        } else {
          callback()
        }
      }
      let validateAccount = (rule, value, callback) => {
        let reg = /^1[0-9]{10}$/
        if (value === '') {
          callback(new Error('请输入账号'))
        } else if (!reg.test(value)) {
          callback(new Error('请输入合法手机号码'))
        } else {
          callback()
        }
      }
      return {
        loginForm: {
          account: '',
          pass: ''
        },
        remember: true,
        rules: {
          pass: [
            {validator: validatePass, trigger: 'blur'}
          ],
          account: [
            {validator: validateAccount, trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      submitForm (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let user = {
              account: this.loginForm.account,
              pass: this.loginForm.pass
            }
            user.pass = Base64.encode(user.pass)
            if (this.remember) {
              localStorage.setItem('user', JSON.stringify(user))
            } else {
              localStorage.removeItem('user')
            }
            this.$store.dispatch('login', user).then((res) => {
              if (res.status) {
                this.$notify({
                  title: '成功',
                  message: res.msg,
                  type: 'success'
                })
                this.$router.push({path: '/index'})
              } else {
                this.$notify.error({
                  title: '失败',
                  message: res.msg
                })
              }
            }).catch(errors => {
              this.$notify.error({
                title: '错误',
                message: errors
              })
            })
          } else {
            this.$message.error('错了哦，这是一条错误消息')
            return false
          }
        })
      },
      resetForm (formName) {
        this.$refs[formName].resetFields()
      }
    }
  }
</script>

<style lang="scss">
  #login {
    .el-container {
      min-height: 100vh;
      .el-header {
        height: 100%;
        background-color: #409EFF;
        h4 {
          color: white;
        }
        a {
          float: right;
          color: white;
          line-height: 60px;
          text-decoration: none;
        }
      }
      .el-main {
        margin-top: 200px;
        height: 100%;
        .box-card {
          height: 100%;
          width: 450px;
          margin: 0 auto;
          top: 300px;
          h1 {
            font-family: 'Hiragino Sans GB';
            text-align: center;
          }
        }
      }
    }
  }

</style>
