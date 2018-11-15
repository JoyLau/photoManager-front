<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-button @click="openDialog('add',0)" style="margin-left: 10px;" type="primary"
                 icon="el-icon-plus" v-if="buttons.btnCreate">新增相册
      </el-button>
      <el-button @click="openDialog('add',0)" style="margin-left: 10px;" type="primary"
                 icon="el-icon-sort" v-if="buttons.btnCreate">排序
      </el-button>
    </div>

    <div>

      <el-row :span="5" v-for="(o, index1) in 1" :key="o" >
        <el-col :span="5" v-for="(o, index) in total" :key="o" >
          <el-card :body-style="{ padding: '0px' }" style="width: 88%;" shadow="hover">
            <el-carousel :interval="3000" height="300px">
              <el-carousel-item v-if="list[index].carouselList.length !== 0" v-for="item in list[index].carouselList" :key="item.key">
                <img :src="item.src" style="width: 100%;height: 100%" >
              </el-carousel-item>
              <el-carousel-item v-if="list[index].carouselList.length === 0" v-for="item in defaultlList" :key="item.key">
                <img :src="item.src" style="width: 100%;height: 100%" >
              </el-carousel-item>
            </el-carousel>
            <el-button @click="openLookPhoto(list[index])" style="width: 100%;" type="primary" title="查看相册">{{list[index].photoName}}
            </el-button>
            <div style="text-align: center; color: pink;margin-top: 2%">{{list[index].gmtCreate}}</div>
            <div style="text-align: center; color: pink;margin-top: 2%">{{list[index].photoDesc}}</div>
          </el-card>
        </el-col>
      </el-row>

    </div>

    <div class="pagination-container" desc="分页工具">
      <el-pagination background
                     @current-change="handleCurrentChange"
                     :current-page="listQuery.currentPage"
                     layout="total, prev, pager, next, jumper" :total="total" >
      </el-pagination>
    </div>

    <el-dialog title="查看相册" :visible.sync="isLook" width="60%" :before-close="cancelLook" desc="查看相册框">
        <el-row>
          <el-col :span="6" v-for="(o, photo) in photoList.length">
            <div style="color: gray;size: letter;width: 100%;">
              <span>删除</span>
            </div>
            <el-card :body-style="{ padding: '0px' }" style="width: 90%;" shadow="hover" :key="photoList[photo].id">
              <img :src="photoList[photo].imageUrl" style="width: 100%;height: 250px;" >
            </el-card>
          </el-col>
          <el-col :span="10" :offset="10">
            <el-button @click="cancelLook" width="100%" type="primary">退出</el-button>
          </el-col>
        </el-row>
    </el-dialog>

    <el-dialog :title="dialogTitle" :visible.sync="isDialog" width="60%" :before-close="cancel" desc="新增或编辑框">
      <el-form label-width="110px" :model="dialogData" ref="dialogData" :rules="rules">
        <el-row>
          <el-col :span="13" :offset="4">
            <el-form-item label="相册名：" prop="photoName" >
              <el-input v-model="dialogData.photoName" auto-complete="off" :disabled="dialogData.edit"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="13" :offset="4">
            <el-form-item label="相册描述：" prop="photoDesc">
              <el-input v-model="dialogData.photoDesc"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="13" :offset="4">
            <el-form-item label="相册类型：" prop="photoType">
              <el-select v-model="dialogData.photoType" placeholder="请选择相册类型"  style="width:100%;">
                <el-option v-for="type in types" :key="type.id" :label="type.name" :value="type.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="20" :offset="4">
            <el-form-item label="仅自己可见：" prop="photoStatus">
              <el-radio v-model="dialogData.photoStatus" label="0">否</el-radio>
              <el-radio v-model="dialogData.photoStatus" label="1">是</el-radio>
            </el-form-item>
          </el-col>
          <el-col :span="10" :offset="9">
            <el-button @click="confirmAdd()" type="primary">确定</el-button>
            <el-button @click="cancel">取消</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-dialog>

  </div>
</template>

<script>
  import { Photo } from '@/api/photo/photo'
  import { getUrl } from '@/utils/request'
  import waves from '@/components/waves' // 水波纹指令

  import { Role } from '@/api/system/role'
  import { Menu } from '@/api/system/menu'
  import {urlFilter} from '@/utils/urlFilter' // 按钮级权限过滤

  import {mapGetters} from 'vuex';
  import {Message, MessageBox,Loading} from 'element-ui';

  export default {
    name: 'photo',
    directives: {
      waves
    },
    data() {
      return {
        buttons: {                //按钮权限控制
          btnEdit: false,         //编辑
          btnDelete: false,       //删除
          btnCreate: false,       //新增
        },
        obj:{},                   //实例对象
        list: null,
        total: null,
        listLoading: true,
        listQuery: {
          currentPage: 1,         //当前页码
          pageSize: 9,           //当前页面显示条数
        },
        types:[
          {id:1,name:"普通"},
          {id:2,name:"旅游"},
          {id:3,name:"亲子"}
        ],
        isDialog:false,
        isLook:false,
        photoList:[],
        dialogImageUrl: '',
        dialogVisible: false,
        isRoleDialog:false,
        imageList:[],
        images:[],//上传的图片集合
        dialogTitle:"",
        dialogData:{},
        currentPhoto:{},//当前查看的相册
        dialogDataRole:{},
        menuTree: [], //权限菜单树
        carouseRowSize: null,
        carouseColSize: null,
        rules: {
          photoName:[{required: true,message:'请输入相册名',trigger: 'blur' },
            {max:30,message:'相册名长度不能超过30',trigger: 'change'}],
          photoType:[{required: true, trigger: 'blur',message:'请选择相册类型'}],
          photoStatus:[{required: true, trigger: 'blur',message:'请选择相册是否可见'}]
        },
        listQuery: {
          currentPage: 1,
          pageSize: 10,
          photoName:''
        },
        defaultlList: [
          {id:'default',src:'/static/default.png',desc:'default'}
        ]
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
        this.obj.photo = new Photo();
        //控制按钮级别的权限
        this.buttons.btnEdit = urlFilter('photo/update');
        this.buttons.btnDelete = urlFilter('photo/delete');
        this.buttons.btnCreate = urlFilter('photo/add');
      },
      getList() {
        this.listLoading = true;
        console.log(this.obj.photo);
        this.obj.photo.getList(this.obj.photo.queryApi,this.listQuery).then(response => {
          this.listLoading = false;
          var data = response.data;
          this.list = data.data.photoList;
          console.log(this.list[0].carouselList);
          this.carouseColSize = data.data.carouseColSize;
          this.carouseRowSize = data.data.carouseRowSize;

          this.total = this.list.length;
        });
      },
      //关闭查看框
      cancelLook(){
        this.isLook = false;
        this.currentPhoto = {};
      },
      //打开查看相册框
      openLookPhoto(photo){
        this.listLoading = true;
        // 发送请求获取相册中的照片
        this.obj.photo.getPhotoListById(photo.id).then(response => {
          this.listLoading = false;
          this.currentPhoto = photo;
          var data = response.data;
          this.photoList = data.data.imageList;
          console.log(this.photoList);
        });
        this.isLook = true;
        console.log(photo);
      },
      //照片上传成功触发事件
      handleSuccess(res,image,imageList){
        if(res.code===200){
          let result = res.data;
          // "packageName"
          // "version"
          this.images = imageList;

          Message.success('上传成功！');
        }else {
          Message.error(res.msg);
        }
      },
      // 确认上传
      confirmUpload(){
        var photoId = this.currentPhoto.id;
        this.obj.photo.get
      },
      //上传路径
      uploadImgUrl:function () {
        return getUrl() + "/api/uploadFile?X-Token=" + this.token;
      },
      handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        console.log(dialogImageUrl+"111");
        this.dialogVisible = true;
      },
      getMenuTree(){
        this.obj.menu.getMenuTree(-1).then(response => {
          var data = response.data;
          this.menuTree = data.data;
        });
      },
      //打开弹框
      openDialog(val,row){
        this.cleanValidate();
        if(val == 'add'){
          this.dialogTitle = "新增相册";
          this.dialogData = {};//清空数据

          this.dialogData.photoStatus = "0";
          this.dialogData.photoType = 1;

          this.dialogData.edit = false;
          this.isDialog = true;
        }else if(val == 'edit'){
          let data = this.list[row];
          this.dialogTitle = "编辑角色";
          this.dialogData = JSON.parse(JSON.stringify(data));//解决赋值引用问题;

          this.dialogData.photoName = data.photoName;
          this.dialogData.photoDesc = data.photoDesc;
          this.dialogData.photoStatus = data.photoStatus;
          this.dialogData.photoType = data.photoType;

          this.dialogData.edit = true;
          this.isDialog = true;
        }
      },
      cleanValidate(){
        if(this.$refs["dialogData"]!==undefined){
          this.$refs['dialogData'].resetFields();
        }
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
      //添加，编辑
      confirmAdd(){
        if(this.dialogData.id){
          //修改
          this.$refs["dialogData"].validate((valid) => {
            if (valid) {
              this.obj.photo.updateItem(this.obj.photo.updateApi,this.dialogData).then(response => {
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
              this.obj.photo.createItem(this.obj.photo.createApi,this.dialogData).then(response => {
                var data = response.data;
                this.isDialog = false;
                this.getList();
              });
            }
          });
        }
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
      }
    }
  }

</script>
