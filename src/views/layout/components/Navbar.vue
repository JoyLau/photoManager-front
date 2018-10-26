<template>
  <div class="tags-view-container">
      <div class="logo" v-show="sidebar.opened">
        <img src="@/assets/home/logo.png" style="width: 192px;vertical-align: middle;" />

      </div>
      <div class="logo logo-small" v-show="!sidebar.opened">
        <img src="@/assets/home/logo-small.png" style="width: 26px;vertical-align: middle;" />
      </div>
      <hamburger class="hamburger-container" :toggleClick="toggleSideBar" :isActive="sidebar.opened" style="float: left;padding-left: 32px;padding-top: 8px;"></hamburger>

      <el-menu class="navbar" >
        <div class="right-menu">
          <span style="color: #343d44;font-size: 16px;">{{userName}}
            <span style="color:#e3e3e3;padding: 0 12px;">|</span>
            <el-dropdown>
              <span class="el-dropdown-link" style="cursor: pointer;color: #343d44;font-size: 16px;">{{name}}</span>
               <el-dropdown-menu slot="dropdown">
                 <el-dropdown-item><span @click="lookUserInfo">个人信息</span></el-dropdown-item>
                  <el-dropdown-item><span @click="updatePassword">修改密码</span></el-dropdown-item>
               </el-dropdown-menu>
            </el-dropdown>
            <span style="color:#e3e3e3;padding: 0 12px;">|</span>  <el-button type="text" @click="logout" style="font-size: 16px;color: red;">退出</el-button></span>
          <!--<error-log class="errLog-container right-menu-item"></error-log>-->

          <!--<el-dropdown class="avatar-container right-menu-item" trigger="click">-->
            <!--<div class="avatar-wrapper">-->
              <!--<img class="user-avatar" :src="avatar" style="vertical-align:middle;margin-top: -5px;width: 36px;border-radius: 50%;">-->
              <!--<span>{{name}} | {{orgName}}</span>-->
              <!--<i class="el-icon-caret-bottom" style="top: 18px"></i>-->
            <!--</div>-->
            <!--<el-dropdown-menu slot="dropdown">-->
              <!--<router-link to="/">-->
                <!--<el-dropdown-item>-->
                  <!--首页-->
                <!--</el-dropdown-item>-->
              <!--</router-link>-->

              <!--<el-dropdown-item divided>-->
                <!--<span @click="logout" style="display:block;">退出登录</span>-->
              <!--</el-dropdown-item>-->
            <!--</el-dropdown-menu>-->
          <!--</el-dropdown>-->
        </div>
      </el-menu>

  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import Breadcrumb from '@/components/Breadcrumb'
  import Hamburger from '@/components/Hamburger'
  import ErrorLog from '@/components/ErrorLog'
  import Screenfull from '@/components/Screenfull'
  import ThemePicker from '@/components/ThemePicker'

export default {
    data(){
      return {
        userInfo:{},
        isUserInfoDialog:false,
        dialogTitle:'',
      }
    },
  components: {
    Breadcrumb,
    Hamburger,
    ErrorLog,
    Screenfull,
    ThemePicker,
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'name',
      'userName',
      'avatar'
    ])
  },
  methods: {
    logout() {
      this.$confirm('是否确定退出？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$store.dispatch('LogOut').then(() => {
          location.reload();
        })
      });
    },
    toggleSideBar() {
      this.$store.dispatch('toggleSideBar')
    },
    lookUserInfo(){
      this.$store.state.dialog.ISDIALOG = true;
    },
    updatePassword(){
      this.$store.state.dialog.ISUSERPWDIALOG = true;
    }
  }
}
</script>
<style>
  .navbar {
    height: 74px;
    line-height: 74px;
    border-radius: 0px !important;
    z-index: 1001;
    color: white;
    float: right;
    margin-right: 32px;
    border-right: none;
  }
  .logo{
    height: 74px;
    width: 262px;
    line-height: 74px;
    background-color: #FF7FD6;
    float: left;
    text-align: center;
  }
  .logo-small{
    width: 36px;
  }
</style>
