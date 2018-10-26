<template>
  <section class="app-main" style="min-height: 100%;background-color: #e3e3e3;padding-top: 74px;">
    <transition name="fade" mode="out-in">
      <keep-alive :include="cachedViews">
        <router-view></router-view>
      </keep-alive>
    </transition>
    <section>
      <el-dialog :title="dialogTitle" :visible.sync="isUserInfoDialog" width="60%" :before-close="cancel" desc="用户信息">
        <el-form label-width="110px" :model="userInfo" ref="userInfo" :rules = "rules">
          <el-row>
            <el-col :span="13" :offset="4">
              <el-form-item label="用户名：" prop="username" >
                <span>{{userInfo.username}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="13" :offset="4">
              <el-form-item label="姓名：" prop="chineseName">
                <span>{{userInfo.chineseName}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="13" :offset="4">
              <el-form-item label="email：" prop="email">
                <el-input v-model="userInfo.email" ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="13" :offset="4">
              <el-form-item label="手机号：" prop="mobilePhone">
                <el-input v-model="userInfo.mobilePhone" ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="13" :offset="4">
              <el-form-item label="住址：" prop="address">
                <el-input v-model="userInfo.address" type="textarea"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="10" :offset="9">
              <el-button @click="confirmAdd" type="primary">确定</el-button>
              <el-button @click="cancel">取消</el-button>
            </el-col>
          </el-row>
        </el-form>
      </el-dialog>
      <el-dialog title="修改密码" :visible.sync="isUserPWDialog" width="60%" :before-close="cancelUpdatePW" desc="修改密码">
        <el-form label-width="110px" :model="userPW" ref="userPW" :rules="upRules">
          <el-row>
            <el-col :span="13" :offset="4">
              <el-form-item label="原密码：" prop="oldPassword" >
                <el-input v-model="userPW.oldPassword" type="password"></el-input>
              </el-form-item>
            </el-col>
           <!--password oldPassword isPassword-->
            <el-col :span="13" :offset="4">
              <el-form-item label="新密码：" prop="password" >
                <el-input v-model="userPW.password" type="password"></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="13" :offset="4">
              <el-form-item label="确认密码：" prop="isPassword" >
                <el-input v-model="userPW.isPassword" type="password"></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="10" :offset="9">
              <el-button @click="updatePW" type="primary">确定</el-button>
              <el-button @click="cancelUpdatePW">取消</el-button>
            </el-col>
          </el-row>
        </el-form>
      </el-dialog>
    </section>
  </section>
</template>

<script>
  import { getToken } from '@/utils/auth'
  import { getUserInfo } from '@/api/login/login'
  import { updatePassword,updateUser } from '@/api/navbar'
  import {Message} from 'element-ui'
export default {
  name: 'AppMain',
  data(){
    var validatePass = (rule, value, callback) =>{
      if(value != this.userPW.password){
        callback(new Error('与新密码不一致'));
      }else{
        callback();
      }
    };
    return {
      rules:{
        officeAddress:[
          {required:'true',message:'住址不能为空',trigger:'blur'},
          {max:30,message:'办公地点不超过30个字符',trigger:'change'},
        ],
        email:[
          {required:'true',message:'邮箱不能为空',trigger:'blur'},
          {max:30,message:'邮箱不超过30个字段',trigger:'change'},
          {pattern: /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/, message:'邮箱格式错误',trigger:'blur'}
        ],
        mobilePhone:[
          {required:'true',message:'手机号不能为空',trigger:'blur'},
          {max:12,message:'手机号不超过12位',trigger:'change'},
          {pattern: /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/, message: '手机号码格式有误',trigger:'blur'}
        ]
      },
      upRules:{
        oldPassword:[
          {required:'true',message:'请输入原密码',trigger:'blur'},
          {pattern:/^[0-9A-Za-z.]{0,}$/,message:'密码格式错误',trigger:'blur'},
        ],
        password:[
          {min:6,max:16,message:'密码长度应在6到16位之间',trigger:'blur'},
          {pattern:/^[0-9A-Za-z.]{0,}$/,message:'密码格式错误',trigger:'blur'},
        ],
        isPassword:[
          {validator:validatePass,trigger:'blur'}
        ]
      },
      userInfo:{},
      userPW:{},
      isUserInfoDialog:false,
      isUserPWDialog:false,
      dialogTitle:'',
      id:null,
    }
  },
  computed: {
    cachedViews() {
      return this.$store.state.tagsView.cachedViews
    },
    ISDIALOG(){
      return this.$store.state.dialog.ISDIALOG
    },
    ISUSERPWDIALOG(){
      return this.$store.state.dialog.ISUSERPWDIALOG
    }
    // key() {
    //   return this.$route.name !== undefined ? this.$route.name + +new Date() : this.$route + +new Date()
    // }
  },
  methods:{
    lookUserInfo(){
      let vm = this;
      let token = getToken();
      getUserInfo(token).then(resp => {
        let result = resp.data;
        vm.userInfo = result.data;
        vm.cleanValidate();
        vm.isUserInfoDialog = true;
      }).catch(err => {})
    },
    confirmAdd(){
      let vm = this;
      this.$refs['userInfo'].validate((valid) => {
        if(valid){
          vm.send();
        }
      })
    },
    send(){
      let vm = this;
      let dataMap = {};
      dataMap['id'] = this.userInfo.id;
      dataMap['address']  = this.userInfo.address;//email mobilePhone
      dataMap['email']  = this.userInfo.email;
      dataMap['mobilePhone']  = this.userInfo.mobilePhone;
      updateUser(dataMap).then(resp => {
        let result = resp.data;
        Message.success(result.message);
        vm.cancel();
      }).catch();
    },
    updatePassword(){
      this.cleanUpValidate();
      this.isUserPWDialog = true;
    },
    updatePW(){
      let vm = this;
      this.$refs["userPW"].validate((valid) => {
        if(valid){
          vm.update();
        }
      });
    },
    update(){
      let vm = this;
      let dataMap= {};
      dataMap['oldPassword'] = this.userPW.oldPassword;
      dataMap['password'] = this.userPW.password;
      updatePassword(dataMap.oldPassword,dataMap.password).then(resp => {
        let result = resp.data;
        Message.success(result.message);
        if(result.code == 200){
            setTimeout(function () {
              this.$store.dispatch('LogOut').then(() => {
                location.reload();
              })
            },1000);
        }
        vm.cancelUpdatePW();
      }).catch();
    },
    cancelUpdatePW(){
      this.$store.state.dialog.ISUSERPWDIALOG = false;
      this.isUserPWDialog = false;
    },
    cancel(){
      this.$store.state.dialog.ISDIALOG = false;
      this.isUserInfoDialog = false;
    },
    cleanValidate(){
      if(this.$refs["userInfo"]!==undefined){
        this.$refs['userInfo'].resetFields();
      }
    },
    cleanUpValidate(){
      if(this.$refs["userPW"]!==undefined){
        this.$refs["userPW"].resetFields();
      }
    }
  },
  watch:{
    ISDIALOG:function(){
      if(this.ISDIALOG){
        this.lookUserInfo();
      }
    },
    ISUSERPWDIALOG:function(){
      if(this.ISUSERPWDIALOG){
        this.updatePassword();
      }
    }
  }
}
</script>
