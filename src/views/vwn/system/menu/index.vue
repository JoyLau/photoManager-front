<template>
  <div class="app-container calendar-list-container">
    <el-row>
      <el-col :span="6">
        <el-card class="box-card" style="margin-right: 10px;">
          <div slot="header" class="clearfix">
            <span>菜单树</span>
          </div>
          <div class="nui-scroll">
            <ul id="menuTree" class="ztree"></ul>
          </div>
        </el-card>
      </el-col>
      <el-col :span="18">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>菜单{{menuText}}详情</span>
            <el-button style="float: right; padding: 3px 0" type="text" icon="el-icon-plus" @click="openDialog('add',0)" v-if="buttons.btnCreate">新增</el-button>
          </div>
          <div class="nui-scroll">
            <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="正在加载中，请稍等" border fit
                    highlight-current-row
                    style="width: 100%">
            <el-table-column width="50px" label="序号">
              <template slot-scope="scope">
                <span>{{scope.$index+1}}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="菜单名">
              <template slot-scope="scope">
                <span>{{scope.row.menuName}}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="子级">
              <template slot-scope="scope">
                <span>{{scope.row.isLeaf==0?'无':'有'}}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="地址">
              <template slot-scope="scope">
                <span>{{scope.row.url}}</span>
              </template>
            </el-table-column>
              <el-table-column align="center" label="菜单类型">
                <template slot-scope="scope">
                  <span>{{scope.row.menuType==1?'菜单':'按钮'}}</span>
                </template>
              </el-table-column>
            <el-table-column align="center" label="创建时间">
              <template slot-scope="scope">
                <span>{{scope.row.gmtCreate}}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="操作" width="150px" min-width="150"
                             class-name="small-padding fixed-width">
              <template slot-scope="scope">
                <el-button @click="openDialog('edit',scope.$index)" type="text" size="medium" v-if="buttons.btnEdit">编辑</el-button>
                <el-button @click="del(scope.$index)" type="text" size="medium" style="color: red" v-if="buttons.btnDelete">删除</el-button>
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

          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-dialog :title="dialogTitle" :visible.sync="isDialog" width="43%" :before-close="cancel">
      <el-form label-width="110px" :model="dialogData" ref="dialogData" :rules="rules">
        <el-row>
          <el-col :span="16" :offset="4">
            <el-form-item label="菜单名：" prop="menuName">
              <el-input v-model="dialogData.menuName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="16" :offset="4">
            <el-form-item label="是否有下级：">
              <el-radio v-model="isLeaf" label="1">有</el-radio>
              <el-radio v-model="isLeaf" label="0">无</el-radio>
            </el-form-item>
          </el-col>
          <el-col :span="16" :offset="4">
            <el-form-item label="菜单类型：">
              <el-radio v-model="menuType" label="1">菜单</el-radio>
              <el-radio v-model="menuType" label="2">按钮</el-radio>
            </el-form-item>
          </el-col>
          <el-col :span="16" :offset="4">
            <el-form-item label="地址：" prop="url">
              <el-input v-model="dialogData.url"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10" :offset="9">
            <el-button @click="confirmAdd" type="primary">确定</el-button>
            <el-button @click="cancel" type="primary">取消</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-dialog>

  </div>
</template>
<script>
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
      return {
        obj:{},//实例对象
        rules: {
          menuName: [{required:true,message:'请输入菜单名',trigger: 'blur'},{pattern: /^[\u4E00-\u9FA5]+$/, message: '菜单名只能为中文',trigger:'blur'},{max:16,message:'菜单名不能超过16位',trigger:'blur'}],
          url:[{required:true,message:'请输入url',trigger: 'blur'}]
        },
        tableKey: 0,
        list: null,//菜单列表
        total: null,
        listLoading: true,
        listQuery: {
          currentPage: 1,
          pageSize: 10,
          id:0
        },
        isDialog: false,
        dialogTitle: "",
        dialogData: {},
        menuText:'',//菜单名称
        isLeaf:"0",
        menuType:"1",
        menuTree:[],//菜单树
        setting:{
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
          },
          callback: {
            onClick: this.menuTreeClick
          }
        },//菜单树设置
        buttons:{//按钮权限控制
          btnEdit:false,//编辑
          btnDelete:false,//删除
          btnCreate:false,//新增
        },
      }
    },
    created() {
      //初始化
      this.init();
      this.getMenuTree();
      this.getList();
    },
    methods: {
      init(){
        this.obj.menu = new Menu();
        //控制按钮级别的权限
        this.buttons.btnEdit = urlFilter('menu/update');
        this.buttons.btnDelete = urlFilter('menu/delete');
        this.buttons.btnCreate = urlFilter('menu/create');
      },
      //初始化树
      getMenuTree(){
        this.obj.menu.getMenuTree(1).then(response => {
          var data = response.data;
          this.menuTree = data.data;
          //加载树
          var treeObj = $.fn.zTree.init($("#menuTree"), this.setting, this.menuTree);
          //列表
          if(this.menuTree.length>0){
            //自动展开第一层
            var nodes = treeObj.getNodes();
            if (nodes.length>0) {
              for(var i=0;i<nodes.length;i++){
                treeObj.expandNode(nodes[i], true, false, false);
              }
            }
          }
        });
      },
      getList() {
        this.listLoading = true;
        this.obj.menu.getList(this.obj.menu.queryApi,this.listQuery).then(response => {
          this.listLoading = false
          var data = response.data;
          this.list = data.data.records;
          this.total = data.data.total;
        });
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
      //点击菜单树
      menuTreeClick(event, treeId, treeNode){
        this.menuText = "【"+treeNode.menuName+"】";
        this.listQuery.id = treeNode.id;
        this.getList();
      },
      //添加
      confirmAdd(){
        this.dialogData.isLeaf = this.isLeaf;
        this.dialogData.menuType = this.menuType;
        if (this.dialogData.id) {
          //修改
          this.$refs["dialogData"].validate((valid) => {
            if (valid) {
              this.obj.menu.updateItem(this.obj.menu.updateApi,this.dialogData).then(response => {
                var data = response.data;
                Message.success("修改成功");
                this.isDialog = false;
                this.getList();
                this.getMenuTree();
              });
            }
          });
        } else {
          //添加
          this.$refs["dialogData"].validate((valid) => {
            if (valid) {
              this.obj.menu.createItem(this.obj.menu.createApi,this.dialogData).then(response => {
                var data = response.data;
                Message.success("新增成功");
                this.isDialog = false;
                this.getList();
                this.getMenuTree();
              });
            }
          });
        }
      },
      //删除
      del(row){
        let data = this.list[row];
        if(data.isLeaf == 1){
          Message.warning("该菜单下有子菜单，不能删除");
        }else{
          MessageBox.confirm('是否确定删除该菜单吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.obj.menu.deleteItem(this.obj.menu.deleteApi,data.id).then(response => {
              var data = response.data;
              this.getList();
            });
          });
        }
      },
      //取消
      cancel(){
        //清理缓存
        this.closeDialog();
      },
      //打开弹框
      openDialog(val, row){
        this.cleanValidate();
        if (val == 'add') {
          this.dialogTitle = "新增菜单";
          this.dialogData = {};//清空数据
          this.dialogData.edit = false;
          this.isLeaf = "0";
          this.menuType = "1";
          this.dialogData.parentId = this.listQuery.id;
          this.isDialog = true;
        } else if (val == 'edit') {
          let data = this.list[row];
          this.dialogTitle = "编辑菜单";
          this.dialogData = JSON.parse(JSON.stringify(data));//解决赋值引用问题;
          this.dialogData.edit = true;
          this.isLeaf = data.isLeaf+"";
          this.menuType = data.menuType+"";
          this.isDialog = true;
        }
      },
      //关闭弹框
      closeDialog(){
        this.isDialog = false;
      },
      //清除验证
      cleanValidate(){
        if(this.$refs["dialogData"]!==undefined){
          this.$refs['dialogData'].resetFields();
        }
      }
    }
  }
</script>
<style scope>
  .nui-scroll{
    width: 100%;
    height: 100%;
    overflow: auto;
    max-height: 500px;
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
