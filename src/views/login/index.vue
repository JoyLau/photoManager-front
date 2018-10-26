<template>
  <div class="login-container">

    <el-form class="login-form" autoComplete="on" :model="loginForm" :rules="loginRules" ref="loginForm"
             label-position="left">
      <div class="title-container">
        <img src="@/assets/login/logo.png" class="logo-big">
      </div>
      <el-row>
        <el-col :span="24">
          <el-form-item prop="username">
            <span class="svg-container">
              <svg-icon icon-class="yh"/>
            </span>
            <el-input name="username" type="text" @keyup.enter.native="handleLogin"
                      v-model="loginForm.username"
                      autoComplete="on" placeholder="请输入账号" />
            <span class="show-pwd" @click="clearUserName">
              <i class="el-icon-circle-close" v-show="showClear"></i>
            </span>
          </el-form-item>
        </el-col>

        <el-col :span="24">
          <el-form-item prop="password">
            <span class="svg-container">
              <svg-icon icon-class="mima"/>
            </span>
            <el-input name="password" :type="passwordType" @keyup.enter.native="handleLogin"
                      v-model="loginForm.password"
                      autoComplete="on" placeholder="请输入密码" />
            <span class="show-pwd" @click="clearPwd" style="right: 35px;">
              <i class="el-icon-circle-close" v-show="showPwdClear"></i>
            </span>
            <span class="show-pwd" @click="showPwd">
              <svg-icon icon-class="by" v-show="!showEye" />
              <svg-icon icon-class="zy"  v-show="showEye" />
            </span>
          </el-form-item>
        </el-col>

        <el-col :span="24">
          <el-form-item style="width: 60%;float: left" prop="verificationCode">
            <span class="svg-container">
              <svg-icon icon-class="yzm"/>
            </span>
            <el-input name="verificationCode" type="text" @keyup.enter.native="handleLogin"
                      v-model="loginForm.verificationCode"
                      autoComplete="on" placeholder="请输入验证码"/>
            <span class="show-pwd" @click="clearCode">
              <i class="el-icon-circle-close" v-show="showCodeClear"></i>
            </span>
          </el-form-item>
          <span style="float: left;display: inline-block" >
            <img :src="verificationCodeUrl" style="width:120px;height:48px;margin-left: 10px;margin-top: 0px;cursor: pointer;font-size: 8px" @click="getVerificationCode" title="换一张？" alt="验证码" />
          </span>
        </el-col>

      </el-row>
      <el-button type="primary" class="login-btn" :loading="loading"
                 @click.native.prevent="handleLogin">登录
      </el-button>
    </el-form>
    <div style="position: fixed;bottom: 0;height: 50px;text-align: center;color: #fff;width: 100%;">推荐使用Chrome、火狐、360（极速模式）等浏览器，不建议使用IE或IE兼容模式浏览器</div>
  </div>
</template>

<script>
  import {isvalidUsername} from '@/utils/validate'
  import {getUrl} from '@/utils/request'

  export default {
    name: 'login',
    data() {
      const validateUsername = (rule, value, callback) => {
        if (value.length === '') {
          callback(new Error('请输入账号'))
        } else {
          callback()
        }
      }
      const validatePassword = (rule, value, callback) => {
        if(value.length  == '' || value.length == 0){
          callback(new Error('请输入密码'))
        }
        else if (value.length < 6) {
          callback(new Error('密码不能少于6位数'))
        } else if(value.length >16){
          callback(new Error('密码不能大于16位数'))
        }else{
          callback();
        }
      }
      return {
        loginForm: {
          username: '',
          password: '',
          verificationCode:'',
          key:''
        },
        verificationCodeUrl:'',
        uuId:'',
        loginRules: {
          username: [{required: true, trigger: 'blur', message:'请输入账号'}],
          password: [{required: true, trigger: 'blur', validator: validatePassword}],
          verificationCode: [{required: true, trigger: 'blur', message:'请输入验证码'}]
        },
        passwordType: 'password',
        loading: false,
        showDialog: false,
        showEye:false,
        showClear:false,
        showPwdClear:false,
        showCodeClear: false
      }
    },
    computed:{
      username:function () {
        return this.loginForm.username;
      },
      password:function () {
        return this.loginForm.password;
      },
      verificationCode:function () {
        return this.loginForm.verificationCode;
      }
    },
    watch: {
      username:function (val) {
        if(val!=""){
            this.showClear = true;
        }else{
          this.showClear = false;
        }
      },
      password:function (val) {
        if(val!=""){
          this.showPwdClear = true;
        }else{
          this.showPwdClear = false;
        }
      },
      verificationCode:function (val) {
        if(val!=""){
          this.showCodeClear = true;
        }else{
          this.showCodeClear = false;
        }
      }
    },
    methods: {
      loadData() {
        this.getVerificationCode();
      },
      getVerificationCode(){
        if(this.uuId == ''){
          this.uuId = this.getUuid();
        }
        //verificationCode
        this.verificationCodeUrl = getUrl() + '/api/getImageIdendifingCode?loginChannel=web&key=' + this.uuId+'&timetamp='+new Date().getTime();
      },
      getUuid() {
        function S4() {
          return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
        }
        return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
      },
      //显示和隐藏密码
      showPwd() {
        if (this.passwordType === 'password') {
          this.passwordType = ''
          this.showEye = true;
        } else {
          this.passwordType = 'password'
          this.showEye = false;
        }
      },
      //执行登录
      handleLogin() {
        let vm = this;
        this.loginForm.key = this.uuId;
        this.$refs.loginForm.validate(valid => {
          if (valid) {
            this.loading = true;
            this.$store.dispatch("LoginByUsername", this.loginForm)
              .then(r => {
                this.loading = false;
                this.$router.push({ path: "/" });
              }).catch(() => {
                this.loading = false;
                console.log("登录失败233");
                vm.getVerificationCode();
              });
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      //清空账号
      clearUserName(){
          this.loginForm.username = "";
      },
      //清空密码
      clearPwd(){
          this.loginForm.password= "";
      },
      //清空验证码
      clearCode(){
        this.loginForm.verificationCode="";
      }
    },
    created() {
      //实例创建时执行入口
      this.loadData();
    },
    destroyed() {
      //实例销毁时执行
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss">
  $bg: #2d3a4b;
  $light_gray: #fff;

  .login-container .logo-big{
    margin-top: 33px;
    margin-bottom: 70px;
  }
  .login-btn{
    width: 100%;
    margin-bottom: 30px;
    font-size: 20px;
    padding: 15px 20px;
    border-radius: 0px;
    margin-top: 10px;
  }
  /* reset element-ui css */
  .login-container {
    .el-input {
      display: inline-block;
      height: 47px;
      width: 100%;
      input {
        background: transparent;
        border: 0px;
        -webkit-appearance: none;
        border-radius: 0px;
        padding: 12px 5px 12px 15px;
        color: #232a30;
        height: 47px;
        &:-webkit-autofill {
          -webkit-box-shadow: 0 0 0px 1000px #fff inset !important;
        }
      }
    }
    .el-form-item {
      border: 1px solid #e3e3e3;
      background: #fff;
      border-radius: 0px;
      color: #232a30;
    }
  }
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
  $bg: #2d3a4b;
  $dark_gray: #889aa4;
  $light_gray: #eee;

  .login-container {
    position: fixed;
    height: 100%;
    width: 100%;
    background-image: url("../../assets/login/login-bg.png");
    .login-form {
      position: absolute;
      left: 0;
      right: 0;
      width: 528px;
      height: 554px;
      padding: 30px 35px 15px 35px;
      background-color: #fff;
      margin: 120px auto;
      .el-input {
        display: inline-block;
        height: 47px;
        width: 70%;
        input {
          background: transparent;
          border: 0px;
          -webkit-appearance: none;
          border-radius: 0px;
          padding: 12px 5px 12px 15px;
          color: #232a30;
          height: 47px;
          &:-webkit-autofill {
            -webkit-box-shadow: 0 0 0px 1000px #fff inset !important;
          }
        }
      }
      .el-form-item {
        border: 1px solid #e3e3e3;
        background: #fff;
        border-radius: 0px;
        color: #232a30;
      }
    }
    .tips {
      font-size: 14px;
      color: #fff;
      margin-bottom: 10px;
      span {
        &:first-of-type {
          margin-right: 16px;
        }
      }
    }
    .svg-container {
      padding: 6px 5px 6px 15px;
      color: $dark_gray;
      vertical-align: middle;
      width: 30px;
      display: inline-block;
      &_login {
        font-size: 20px;
      }
    }
    .title-container {
      position: relative;
      .title {
        font-size: 26px;
        color: $light_gray;
        margin: 0px auto 40px auto;
        text-align: center;
        font-weight: bold;
      }
      .set-language {
        color: #fff;
        position: absolute;
        top: 5px;
        right: 0px;
      }
    }
    .show-pwd {
      position: absolute;
      right: 10px;
      top: 7px;
      font-size: 16px;
      color: $dark_gray;
      cursor: pointer;
      user-select: none;
    }
    .thirdparty-button {
      position: absolute;
      right: 35px;
      bottom: 28px;
    }
  }

  .login-container .login-form[data-v-211ec51b] {
    opacity: 0.8;
  }

  @media screen and (max-height: 768px) {
    .login-container .login-form{
      width: 428px;
      height: 414px;
    }
    .login-container .logo-big{
      margin-top: 0px;
      margin-bottom: 18px;
      width: 360px;
    }
    .login-btn{
      font-size: 18px;
      padding: 12px 20px;
    }
  }
</style>
