<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <div class="filter-item-right">
        <el-button @click="openDialog('add',0)" style="margin-left: 10px;" type="primary"
                   icon="el-icon-plus" v-if="buttons.btnCreate">新增
        </el-button>
      </div>
    </div>
    <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="正在加载中，请稍等" border fit
              highlight-current-row
              style="width: 100%">
      <el-table-column width="50px" align="center" label="序号">
        <template slot-scope="scope">
          <span>{{(scope.$index+1)+(listQuery.currentPage - 1)*listQuery.pageSize}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="角色名">
        <template slot-scope="scope">
          <span>{{scope.row.roleName}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="创建人">
        <template slot-scope="scope">
          <span>{{scope.row.creator}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="创建时间">
        <template slot-scope="scope">
          <span>{{scope.row.gmtCreate}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="修改人">
        <template slot-scope="scope">
          <span>{{scope.row.modifiedBy}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="修改时间">
        <template slot-scope="scope">
          <span>{{scope.row.gmtModified}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width = "200px" min-width="150" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button @click="allot(scope.$index)" type="text" size="medium" v-show="scope.row.id!=1"  v-if="buttons.btnAllot">分配</el-button>
          <el-button @click="openDialog('edit',scope.$index)" type="text" size="medium"  v-if="buttons.btnEdit">编辑</el-button>
          <el-button @click="del(scope.$index)" type="text" size="medium"  v-show="scope.row.id!=1" style="color: red"  v-if="buttons.btnDelete">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container" desc="分页工具">
      <el-pagination background
                     @current-change="handleCurrentChange"
                     :current-page="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit"
                     layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <el-dialog :title="dialogTitle" :visible.sync="isDialog" width="43%" :before-close="cancel" desc="角色编辑框">
      <el-form label-width="110px" :model="dialogData" ref="dialogData" :rules="rules">
            <el-row>
              <el-col :span="13" :offset="4">
                <el-form-item label="角色名" prop="roleName">
                  <el-input v-model="dialogData.roleName" auto-complete="off"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="10" :offset="9" >
                 <el-button @click="confirmAdd" type="primary">确定</el-button>
                 <el-button @click="cancel">取消</el-button>
              </el-col>
            </el-row>
      </el-form>
    </el-dialog>

    <el-dialog :title="dialogTitle" :visible.sync="isRoleDialog" width="43%" :before-close="cancelRole" desc="权限分配框">
      <el-form label-width="110px" :model="dialogDataRole">
        <el-row>
          <el-col :span="18" :offset="4" id="roleMenuTree" style="margin-bottom: 20px;">
            <ul id="menuTree" class="ztree"></ul>
          </el-col>
          <el-col :span="10" :offset="9">
            <el-button @click="confirmOk" type="primary">确定</el-button>
            <el-button @click="cancelRole">取消</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-dialog>

  </div>
</template>

<script>
  import { Role } from '@/api/system/role'
  import { Menu } from '@/api/system/menu'
  import waves from '@/components/waves' // 水波纹指令
  import { urlFilter } from '@/utils/urlFilter' // 按钮级权限过滤
  import { Message ,MessageBox} from 'element-ui'
  export default {
    name: 'role',
    directives: {
      waves
    },
    data() {
      //验证
      var validateRoleName = (rule, value, callback) => {
        if (value === undefined || value === '') {
          callback(new Error('请输入角色'));
        } else {
          callback();
        };
      }
      return {
        obj:{},//实例对象
        rules: {
          roleName:[ { validator:validateRoleName, trigger: 'blur' },
                {max:10,message:'角色名应小于10位',trigger: 'blur'}],
        },
        tableKey: 0,
        list: null,
        total: null,
        listLoading: true,
        listQuery: {
          currentPage: 1,//当前页码
          pageSize: 10,//当前页面显示条数
        },
        isDialog:false,
        isRoleDialog:false,
        dialogTitle:"",
        dialogData:{},
        dialogDataRole:{},
        menuTree: [],//权限菜单树
        setting:{
          check: {
            enable: true
          },
          data:{
            key: {
              name: "menuName",
              url: "xUrl"
            },
            simpleData:{
              enable: true,
              idKey: "id",
              pIdKey: "parentId",
            }
          }
        },//菜单树设置
        buttons:{//按钮权限控制
          btnAllot:false, //分配
          btnEdit:false,  //编辑
          btnDelete:false,//删除
          btnCreate:false,//新增
        },
      }
    },
    created() {
      //初始化
      this.init();
      this.getList();
      this.getMenuTree();
    },
    methods: {
      init(){
          this.obj.menu = new Menu();
          this.obj.role = new Role();
          //控制按钮级别的权限
          this.buttons.btnAllot = urlFilter('role/allot');
          this.buttons.btnEdit = urlFilter('role/update');
          this.buttons.btnDelete = urlFilter('role/delete');
          this.buttons.btnCreate = urlFilter('role/create');
      },
      getList() {
        this.listLoading = true;
        this.obj.role.getList(this.obj.role.queryApi,this.listQuery).then(response => {
          this.listLoading = false
          var data = response.data;
          this.list = data.data.records;
          this.total = data.data.total;
        });
      },
      getMenuTree(){
        this.obj.menu.getMenuTree(-1).then(response => {
          var data = response.data;
          this.menuTree = data.data;
        });
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
      //添加
      confirmAdd(){
        if(this.dialogData.id){
          //修改
          this.$refs["dialogData"].validate((valid) => {
            if (valid) {
              this.obj.role.updateItem(this.obj.role.updateApi,this.dialogData).then(response => {
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
              this.obj.role.createItem(this.obj.role.createApi,this.dialogData).then(response => {
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
        MessageBox.confirm('是否确定删除该角色吗？', '提示',{
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.obj.role.deleteItem(this.obj.role.deleteApi,data.id).then(response => {
              var data = response.data;
              Message.success("删除成功");
              this.getList();
            });
        });
      },
      //取消
      cancel(){
        //清理缓存
        this.closeDialog();
      },
      //打开弹框
      openDialog(val,row){
        this.cleanValidate();
        if(val == 'add'){
          this.dialogTitle = "添加角色";
          this.dialogData = {};//清空数据
          this.dialogData.edit = false;
          this.isDialog = true;
        }else if(val == 'edit'){
          let data = this.list[row];
          this.dialogTitle = "编辑角色";
          this.dialogData = JSON.parse(JSON.stringify(data));//解决赋值引用问题;
          this.dialogData.edit = true;
          this.isDialog = true;
        }
      },
      //关闭弹框
      closeDialog(){
        this.isDialog = false;
      },
      //分配
      allot(row){
        let that = this;
        let data = this.list[row];
        this.dialogDataRole = data;
        this.dialogTitle = "权限分配";
        this.isRoleDialog = true;
        setTimeout(function () {
          //加载树
          var treeObj = $.fn.zTree.init($("#menuTree"), that.setting, that.menuTree);
          //展开所有
          treeObj.expandAll(true);
          that.obj.menu.getMenuByRole(data.id).then(response => {
            var data = response.data;
            for(var i=0;i<data.data.length;i++){
              var node = treeObj.getNodeByParam("id", data.data[i], null);
              treeObj.checkNode(node,true,false);
            }
          });
        },500);
      },
      //分配权限确定按钮
      confirmOk(){
        var menuIds = [];
        var zTree = $.fn.zTree.getZTreeObj("menuTree");
        var orgIdNodes = zTree.getCheckedNodes(true);
        for(var i=0;i<orgIdNodes.length;i++){
          var treeNode = orgIdNodes[i];
  //          var halfCheck = treeNode.getCheckStatus();
  //          if(!halfCheck.half){//取消半勾选的
          menuIds.push(treeNode.id);
  //          }
        }
        var data = {};
        data.menuIds = menuIds.join(",");
        data.roleId = this.dialogDataRole.id;
        this.obj.role.allotRoleMenu(data).then                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         (response => {
          var data = response.data;
          this.isRoleDialog = false;
          Message.success("分配成功");
        });
      },
      //关闭权限框
      cancelRole(){
        this.isRoleDialog = false;
      },
      cleanValidate(){
        if(this.$refs["dialogData"]!==undefined){
          this.$refs['dialogData'].resetFields();
        }
      }
    }
  }
</script>
<style>
  #roleMenuTree .el-tree-node{
    float: left;
  }
</style>
