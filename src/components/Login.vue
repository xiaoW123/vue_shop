<template>
<!-- 开始 -->
  <div class="login_container">
    <div class="login_box">
      <!-- 头像 -->
      <div class="assets_box">
        <img src="../assets/logo.png" alt="" />
      </div>
      <!-- 登录表单 -->
      <el-form label-width="0px" class="login_form" :model="loginForm" :rules="loginFormRules" ref="loginRormRef">
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" prefix-icon="iconfont icon-user"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input v-model="loginForm.password" prefix-icon="iconfont icon-3702mima" type="password"></el-input>
        </el-form-item>
        <el-form-item class="form_button">
          <!-- 登录按钮 -->
          <el-button type="primary" @click="login">登录</el-button>
          <!-- 重置按钮 -->
          <el-button type="info" @click="btns">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import {request} from '../network/request'

export default {
  name: "Login",
  data() {
    return {
      /* 表单数据绑定 */
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      /* 表单规则验证 */
      loginFormRules: {
        username: [
            { required: true, message: '请输入登录名称', trigger: 'blur' },
            { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password: [
            { required: true, message: '请输入登录密码', trigger: 'blur' },
            { min: 5, max: 15, message: '长度在 5 到 15 个字符', trigger: 'blur' }
        ],
      }
    }
  },
  methods:{
    /* 点击重置 */
    btns() {
      this.$refs.loginRormRef.resetFields()
    },
    /* 表单校验 */
    login() {
      this.$refs.loginRormRef.validate( boolean => {
        if(!boolean) return;
        request({
          method: 'post',
          url: 'login',
          //配置登录的对象
          data: {...this.loginForm} 
        }).then((result) => {
          //对象的解构 把result的data解构出 res
          const {data:res} = result 
          // if(res.meta.status !== 200) return this.$message.error('登录失败~');
          this.$message.success('登录成功哦~');
          
          /* 把请求到的token 保存到 sessionStorage */
          window.sessionStorage.setItem('token', res.data.token)
          this.$router.push('/home')
        }).catch(error => {
          this.$message.error('登录失败哦~');
        })
      })
    },
  }
  
};
</script>

<style lang="less" scoped>
.login_container {
  background-color: #2b4b6b;
  width: 100%;
  height: 100%;
}

.login_box {
  background-color: #fff;
  width: 450px;
  height: 300px;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);

  .assets_box {
    height: 130px;
    width: 130px;
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
      border: 1px solid #eee;
      background-color: #eee;
    }
  }
}

.form_button {
  display: flex;
  justify-content: flex-end;
}

.login_form {
  box-sizing: border-box;
  position: absolute;
  width: 100%;
  bottom: 0;
  padding: 0 20px;
}
</style>

