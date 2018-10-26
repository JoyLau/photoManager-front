<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" style="width: 150px;" class="filter-item"
                placeholder="用户名" v-model="listQuery.username">
      </el-input>
      <el-input @keyup.enter.native="handleFilter" style="width: 150px;" class="filter-item"
                placeholder="姓名" v-model="listQuery.chineseName">
      </el-input>
      <el-input @keyup.enter.native="handleFilter" style="width: 150px;" class="filter-item"
                placeholder="手机号" v-model="listQuery.mobilePhone">
      </el-input>
      <el-button class="filter-item" type="primary" v-waves icon="el-icon-search" @click="handleFilter">
        查询
      </el-button>
      <div class="filter-item-right">
        <el-button style="margin-left: 10px;" type="primary" @click="openDialog('add',0)"
                   icon="el-icon-plus" v-if="buttons.btnCreate">新增
        </el-button>
      </div>
    </div>

    <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="正在加载中，请稍等" border fit
              highlight-current-row
              style="width: 100%">
      <el-table-column width="50px" align="center" label="序号">
        <template slot-scope="scope">
          <span>{{(scope.$index+1)+(listQuery.currentPage-1)*listQuery.pageSize}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="用户名">
        <template slot-scope="scope">
          <a href="javascript:;" @click="showDialog(scope.$index)">{{scope.row.username}}</a>
        </template>
      </el-table-column>
      <el-table-column align="center" label="姓名">
        <template slot-scope="scope">
          <span>{{scope.row.chineseName}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="手机号">
        <template slot-scope="scope">
          <span>{{scope.row.mobilePhone}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="角色">
        <template slot-scope="scope">
          <span v-for="role in scope.row.roles">{{role.roleName}} </span>
        </template>
      </el-table-column>
       <el-table-column align="center" label="用户状态">
        <template slot-scope="scope">
          <template v-if = "scope.row.status == '1'">
            <span style="color:red">禁用</span>
          </template>
          <template v-if = "scope.row.status == '0'">
            <span style="color:green">启用</span>
          </template>
        </template>
      </el-table-column>
      <!--<el-table-column align="center" label="用户类型">
        <template slot-scope="scope">
          <template v-if = "scope.row.userType == 1">
            平台
          </template>
          <template v-if = "scope.row.userType == 2">
            终端
          </template>
        </template>
      </el-table-column>-->
      <el-table-column align="center" label="修改时间">
        <template slot-scope="scope">
          <span>{{scope.row.gmtModified}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="200px" min-width="150" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <template v-if="scope.row.username!=userName">
            <el-button @click="chongzhi(scope.$index)" type="text" size="medium" v-if="buttons.btnResetPassword">重置</el-button>
            <el-button @click="openDialog('edit',scope.$index)" type="text" size="medium" v-if="buttons.btnEdit">编辑</el-button>
            <el-button @click="del(scope.$index)" type="text" size="medium" style="color: red" v-if="buttons.btnDelete">删除</el-button>
          </template>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container" desc="分页工具">
      <el-pagination background
                     @current-change="handleCurrentChange"
                     :current-page="listQuery.currentPage" :page-sizes="[10,20,30, 50]" :page-size="listQuery.pageSize"
                     layout="total, sizes, prev, pager, next, jumper" :total="total" @size-change = "handlePageChange">
      </el-pagination>
    </div>

    <el-dialog :title="dialogTitle" :visible.sync="isDialog" width="60%" :before-close="cancel" desc="新增或编辑框">
      <el-form label-width="110px" :model="dialogData" ref="dialogData" :rules="rules">
            <el-row>
              <el-col :span="13" :offset="4">
                <el-form-item label="用户名：" prop="username" >
                  <el-input v-model="dialogData.username" auto-complete="off" :disabled="dialogData.edit"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="13" :offset="4">
                <el-form-item label="姓名：" prop="chineseName">
                  <el-input v-model="dialogData.chineseName"></el-input>
                </el-form-item>
              </el-col>

              <el-col :span="13" :offset="4">
                <el-form-item label="角色：" prop="roleIds">
                  <el-select v-model="roleIds" multiple placeholder="请选择"  style="width:100%;">
                    <el-option v-for="role in roles" :key="role.id" :label="role.roleName" :value="role.id"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="13" :offset="4">
                <el-form-item label="手机号：" prop="mobilePhone">
                  <el-input v-model="dialogData.mobilePhone"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="13" :offset="4">
                <el-form-item label="通讯地址：" prop="address">
                  <el-input v-model="dialogData.address"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="20" :offset="4">
                <el-form-item label="状态：" prop="status">
                    <el-radio v-model="status" label="0">启用</el-radio>
                    <el-radio v-model="status" label="1">禁用</el-radio>
                </el-form-item>
              </el-col>
              <!--<el-col :span="20" :offset="4">
                <el-form-item label="用户类型：" prop="userType">
                  <template>
                    <el-radio v-model="userType" label="1">平台</el-radio>
                    <el-radio v-model="userType" label="2">终端</el-radio>
                  </template>
                </el-form-item>
              </el-col>-->
               <el-col :span="10" :offset="9">
                  <el-button @click="confirmAdd()" type="primary">确定</el-button>
                 <el-button @click="cancel">取消</el-button>
               </el-col>
            </el-row>
      </el-form>
    </el-dialog>

    <el-dialog title="查看用户" :visible.sync="isLookDialog" width="43%" :before-close="closeLookDialog">
      <el-form label-width="110px" >
        <el-row>
          <el-col :span="13" :offset="4">
            <el-form-item label="姓名：">
              <span>{{dialogData.chineseName}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="13" :offset="4">
            <el-form-item label="角色：">
              <span v-for="role in dialogData.roles">{{role.roleName}} </span>
            </el-form-item>
          </el-col>
          <el-col :span="13" :offset="4">
            <el-form-item label="手机号：">
              <span>{{dialogData.mobilePhone}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="13" :offset="4">
            <el-form-item label="电子邮箱：">
              <span>{{dialogData.email}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="13" :offset="4">
            <el-form-item label="通讯地址：">
              <span>{{dialogData.address}}</span>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-dialog>

    <!--<el-dialog title="数据权限分配" :visible.sync="isRoleDialog" width="43%" :before-close="cancelRole" desc="数据权限分配">
      <el-form label-width="110px" :model="dialogDataRole">
        <el-row>
          <el-col :span="10" :offset="9">
            <el-button @click="confirmOk" type="primary">确定</el-button>
            <el-button @click="cancelRole">取消</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-dialog>-->

  </div>

</template>

<script>
  import { User } from '@/api/system/user'
  import { Role } from '@/api/system/role'
  import waves from '@/components/waves' // 水波纹指令
  import { urlFilter } from '@/utils/urlFilter' // 按钮级权限过滤
  import { mapGetters } from 'vuex'
  import { Message ,MessageBox} from 'element-ui'
  let sha256 = require("js-sha256").sha256;    //引入sha256库

  export default {
    name: 'user',
    directives: {
      waves
    },
    data() {
        //验证
       var validateUsername = (rule, value, callback) => {
         if (value === undefined || value === '') {
           callback(new Error('请输入用户名'));
         } else {
           callback();
         }
       };
      return {
        obj:{},//实例对象
        rules: {
            username:[{required: true,validator:validateUsername,trigger: 'blur' },
              {pattern:/^[a-zA-Z0-9]+$/,message:'用户名为大小写字母和数字的组合',trigger: 'blur'},
              {max:20,message:'用户名不能超过20位',trigger: 'change'}],

            chineseName:[{required: true, trigger: 'blur',message:'请输入姓名'},
              {max:20,message:'姓名不能超过20位',trigger: 'blur'},
              {pattern: /^([\u4E00-\u9FA5]+)|([\u4E00-\u9FA5]{0,}·[\u4E00-\u9FA5]{0,})$/, message: '姓名应为中文或中文·的格式',trigger: 'blur'}],
            mobilePhone:[
              {pattern: /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/, message: '手机号码格式有误',trigger:'blur'}],
            officeAddress:[{max:40,message:'通讯地址不能超过40位',trigger: 'change'},
              ],
            roleIds:[{required: true, trigger: 'blur',message:'请选择角色'}]
        },
        tableKey: 0,
        list: null,
        total: null,
        listLoading: true,
        listQuery: {
          currentPage: 1,
          pageSize: 10,
          username:'',
          chineseName:"",
          mobilePhone:""
        },
        passwordInput:'password',
        roles:[],//全部角色
        roleIds:[],//选中的角色
        checkAll: false,
        isIndeterminate: true,
        dialogData:{},
        dialogTitle:'',
        isDialog:false,
        isLookDialog:false,//查看消息框
        showDep:false,//是否显示部门框
        isRoleDialog:false,//数据权限分配
        dialogDataRole:{},
        status:"0",
        //userType:"1",
        buttons:{//按钮权限控制
          btnAllot:false,//分配
          btnResetPassword:false,//重置
          btnEdit:false,//编辑
          btnDelete:false,//删除
          btnCreate:false,//新增
        },
      }
    },
    computed: {
      ...mapGetters([
        'userName'
      ])
    },
    created() {
      this.init();
      //初始化
      this.getList();
      //初始化角色
      this.getRoles();
    },
    filters: {
    },
    methods: {
      init(){
        this.obj.user = new User();
        this.obj.role = new Role();
        //控制按钮级别的权限
        this.buttons.btnAllot = urlFilter('user/saveUserDataRange');
        this.buttons.btnResetPassword = urlFilter('user/resetPassword');
        this.buttons.btnEdit = urlFilter('user/update');
        this.buttons.btnDelete = urlFilter('user/delete');
        this.buttons.btnCreate = urlFilter('user/create');
      },
      //获取用户列表
      getList() {
        this.listLoading = true;
        this.obj.user.getList(this.obj.user.queryApi,this.listQuery).then(response => {
          this.listLoading = false
          var data = response.data;
          this.list = data.data.records;
          this.total = data.data.total;
        });
      },
      //获取角色列表
      getRoles(){
        this.obj.role.getList(this.obj.role.queryApi,{}).then(response => {
          var data = response.data;
          this.roles = data.data.records;
        });
      },
      //激活部门选择框
      orgNameClick(){
        this.showDep = true;
      },
      //晒选数据
      handleFilter() {
        this.listQuery.currentPage = 1;
        this.getList()
      },
      //翻页
      handleCurrentChange(val) {
        this.listQuery.currentPage = val;
        this.getList()
      },
      handlePageChange(val){
        this.listQuery.pageSize = val;
        this.getList()
      },
      //添加，编辑
      confirmAdd(){
        this.dialogData.status = this.status;
        //this.dialogData.userType = this.userType;
        this.dialogData.roleIds = this.roleIds.join(",");
        delete this.dialogData["roles"];
        if(this.dialogData.id){
          //修改
          this.$refs["dialogData"].validate((valid) => {
            if (valid) {
              this.obj.user.updateItem(this.obj.user.updateApi,this.dialogData).then(response => {
                var data = response.data;
                this.isDialog = false;
                this.getList();
              });
            }
          });
        }else{
          //添加
          this.$refs["dialogData"].validate((valid) => {
            if (valid) {
              this.obj.user.createItem(this.obj.user.createApi,this.dialogData).then(response => {
                var data = response.data;
                this.isDialog = false;
                this.getList();
              });
            }
          });
        }
      },
      //删除
      del(row){
        let data = this.list[row];
        MessageBox.confirm('是否确定删除该用户吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.obj.user.deleteItem(this.obj.user.deleteApi,data.id).then(response => {
            var data = response.data;
            Message.success('删除成功');
            this.getList();
          });
        });
      },
      //打开弹框
      openDialog(val,row){
        let that = this;
        this.cleanValidate();
        this.getRoles();
        if(val == 'add'){
          this.dialogTitle = "添加用户";
          this.dialogData = {};//清空数据
          this.dialogData.edit = false;
          this.roleIds = [];
          this.status = "0";
          //this.userType = "1";
          this.isDialog = true;
        }else if(val == 'edit'){
          let data = this.list[row];
          this.dialogTitle = "编辑用户";
          this.dialogData = JSON.parse(JSON.stringify(data));//解决赋值引用问题
          this.dialogData.edit = true;
          this.roleIds = [];
          for(var i=0;i<data.roles.length;i++){
              this.roleIds.push(data.roles[i].id);
          }
          this.status = data.status+"";
          //this.userType = data.userType+"";
          this.isDialog = true;
        }
      },
      //查看用户信息
      showDialog(row){
        let data = this.list[row];
        this.dialogTitle = "编辑用户";
        this.dialogData = JSON.parse(JSON.stringify(data));//解决赋值引用问题
        this.isLookDialog = true;
      },
      //取消
      cancel(){
        this.closeDialog();
      },
      //关闭弹框
      closeDialog(){
        this.isDialog = false;
      },
      //关闭查看框
      closeLookDialog(){
          this.isLookDialog = false;
      },
      //隐藏或显示密码
      showPwd(){
        if(this.passwordInput  == 'password'){
          this.passwordInput = '';
        }else{
          this.passwordInput = 'password';
        }
      },
      //关闭权限框
      cancelRole(){
        this.isRoleDialog = false;
      },
      cleanValidate(){
        if(this.$refs["dialogData"]!==undefined){
          this.$refs['dialogData'].resetFields();
        }
      },
      //重置
      chongzhi(row){
        let data = this.list[row];
        this.$confirm('是否确定重置该用户的密码为初始密码？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.obj.user.resetPassword(data.id).then(response => {
            var data = response.data;
            Message.success('重置成功');
            this.getList();
          });
        });
      }
    }
  }
</script>

<style scoped>
  a,
  a:focus,
  a:hover {
    color: #409EFF;
    cursor: pointer;
    text-decoration: underline;
  }
   .show-pwd {
      position: absolute;
      right: 10px;
      top: 3px;
      font-size: 16px;
      cursor: pointer;
      user-select: none;
    }
   .el-checkbox{margin-right: 20px;margin-left: 0px;}
   .nui-scroll{
     width: 100%;
     min-height: 40px;
     overflow: auto;
     max-height: 200px;
   }

   .nui-scroll::-webkit-scrollbar {
     width: 8px;
     height: 8px;
   }
   /*正常情况下滑块的样式*/
   .nui-scroll::-webkit-scrollbar-thumb {
     background-color: rgba(0,0,0,.05);
     border-radius: 10px;
     -webkit-box-shadow: inset 1px 1px 0 rgba(0,0,0,.1);
   }
   /*鼠标悬浮在该类指向的控件上时滑块的样式*/
   .nui-scroll:hover::-webkit-scrollbar-thumb {
     background-color: rgba(0,0,0,.2);
     border-radius: 10px;
     -webkit-box-shadow: inset 1px 1px 0 rgba(0,0,0,.1);
   }
   /*鼠标悬浮在滑块上时滑块的样式*/
   .nui-scroll::-webkit-scrollbar-thumb:hover {
     background-color: rgba(0,0,0,.4);
     -webkit-box-shadow: inset 1px 1px 0 rgba(0,0,0,.1);
   }
   /*正常时候的主干部分*/
   .nui-scroll::-webkit-scrollbar-track {
     border-radius: 10px;
     -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0);
     background-color: white;
   }
   /*鼠标悬浮在滚动条上的主干部分*/
   .nui-scroll::-webkit-scrollbar-track:hover {
     -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.4);
     background-color: rgba(0,0,0,.01);
   }
</style>

