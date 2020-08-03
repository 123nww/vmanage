<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像区 -->
      <div class="avatar_box">
        <img src="../../assets/logo.png" alt />
      </div>
      <!-- 表单 -->
      <el-form label-width="0" ref="loginFormRef" class="login_form" :model="form" :rules="rules">
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input prefix-icon="iconfont icon-user" v-model="form.username"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input prefix-icon="iconfont icon-3702mima" v-model="form.password" type="password"></el-input>
        </el-form-item>
        <!-- 登录 , 重置 -->
        <el-form-item class="login_but">
          <el-button type="primary" @click="loginClick">登录</el-button>
          <el-button type="info" @click="resetClick">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { pwdLogin } from 'network/index.js'
import { setLocalStore } from 'config/global.js'
export default {
  name: 'Login',
  data() {
    return {
      //表单数据
      form: {
        username: 'admin',
        password: '123456',
      },
      //定义规则
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 2, max: 5, message: '长度在 2 到 5 个字符', trigger: 'blur' },
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 1, max: 6, message: '长度在 1 到 6 个字符', trigger: 'blur' },
        ],
      },
    }
  },
  methods: {
    //重置表单
    resetClick() {
      //console.log(this);
      this.$refs.loginFormRef.resetFields()
    },
    //登录
    loginClick() {
      this.$refs.loginFormRef.validate((valid) => {
        if (!valid) {
          return
        }
        pwdLogin(this.form)
          .then((response) => {
            if (response.meta.status === 200) {
              this.$message({
                message: '登录成功',
                type: 'success',
                showClose: true,
              })
              const token = response.data.token
              setLocalStore('token', token)
              this.$router.push('/home')
            } else {
              this.$message.error('登录失败')
            }
          })
          .catch((err) => {
            this.$message.error(err)
          })
      })
    },
  },
}
</script>

<style lang='less' scoped>
.login_container {
  background-color: #2b4b6b;
  height: 100%;
}
.login_box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  .avatar_box {
    width: 130px;
    height: 130px;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 10px #ddd;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #eee;
    }
  }
}
.login_form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}

.login_but {
  display: flex;
  flex-direction: row-reverse;
}
</style>
