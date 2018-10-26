<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" style="width: 150px;" class="filter-item"
                placeholder="操作人" v-model="listQuery.creator">
      </el-input>
      <el-select v-model="listQuery.logType" style="width: 150px;" placeholder="请选择日志来源" class="filter-item">
        <el-option v-for="item in logTypeOption" :key="item.key" :label="item.display_name"
                   :value="item.key">
        </el-option>
      </el-select>
      <el-date-picker class="filter-item"
                      v-model="listQuery.dateBegin"
                      type="date"
                      placeholder="开始日期" style="width: 140px;">
      </el-date-picker>
      <span style="font-size:14px">至</span>
      <el-date-picker class="filter-item"
                      v-model="listQuery.dateEnd"
                      type="date"
                      placeholder="结束日期"  style="width: 140px;">
      </el-date-picker>

      <el-button class="filter-item" type="primary" v-waves icon="el-icon-search" @click="handleFilter">
        查询
      </el-button>
      <div class="filter-item-right">

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
      <el-table-column align="center" width="100px" label="操作人">
        <template slot-scope="scope">
          <span>{{scope.row.creator}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" width="100px" label="日志来源">
        <template slot-scope="scope">
          <template v-if="scope.row.logType == 1">
            web
          </template>
          <template v-if="scope.row.logType == 2">
            app
          </template>
        </template>
      </el-table-column>
      <el-table-column align="center" label="接口地址">
        <template slot-scope="scope">
          <span>{{scope.row.uri}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="IP地址">
        <template slot-scope="scope">
          <span>{{scope.row.ip}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作描述">
        <template slot-scope="scope">
          <span>{{scope.row.description}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center"  width="170px" label="记录时间">
        <template slot-scope="scope">
          <span>{{scope.row.gmtCreate}}</span>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination background
                     @current-change="handleCurrentChange"
                     :current-page="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit"
                     layout="total, sizes, prev, pager, next, jumper" :total="total" @size-change = "handlePageChange">
      </el-pagination>
    </div>

  </div>
</template>

<script>
  import {Log} from '@/api/system/log'
  import {formatDate} from '@/utils/formatTime'
  import waves from '@/components/waves' // 水波纹指令
  export default {
    name: 'user',
    directives: {
      waves
    },
    data() {
      return {
        obj:{},//实例对象
        tableKey: 0,
        list: null,
        total: null,
        listLoading: true,
        listQuery: {
          currentPage: 1,
          pageSize: 10,
          dateBegin: '',
          dateEnd: '',
          creator:'',
          logType:-1,//日志来源
        },
        logTypeOption:[{"display_name": "全部", "key": -1},{"display_name": "web", "key": 1},{"display_name": "app", "key": 2}]
      }
    },
    created() {
      this.init();
      //初始化
      this.getList();
    },
    methods: {
      init(){
         this.obj.log = new Log();
      },
      getList() {
        this.listLoading = true;
        this.obj.log.getList(this.obj.log.queryApi,this.listQuery).then(response => {
          this.listLoading = false
          var data = response.data;
          this.list = data.data.records;
          this.total = data.data.total;
        });
      },
      //晒选数据
      handleFilter() {
          var flag = false;
        if(this.listQuery.dateBegin!=null && this.listQuery.dateBegin!='' && this.listQuery.dateEnd!=null && this.listQuery.dateEnd!=''){
          this.listQuery.dateBegin = formatDate(new Date(this.listQuery.dateBegin), 'yyyy-MM-dd');
          this.listQuery.dateEnd = formatDate(new Date(this.listQuery.dateEnd), 'yyyy-MM-dd');
        }
          if(this.listQuery.dateBegin!=null && this.listQuery.dateBegin!=''){
            //当开始时间选择以后
            if(this.listQuery.dateEnd!=null && this.listQuery.dateEnd!=''){
                if(new Date(this.listQuery.dateBegin) > new Date(this.listQuery.dateEnd)){
                    this.$message("结束时间要大于开始时间");
                    flag = true;
                }
            }else{
              this.$message("请选择结束时间");
              flag = true;
            }
          }
          if(this.listQuery.dateEnd!=null && this.listQuery.dateEnd!=''){
            //当结束时间选择以后
            if(this.listQuery.dateBegin!=null && this.listQuery.dateBegin!=''){
              if(new Date(this.listQuery.dateBegin) > new Date(this.listQuery.dateEnd)){
                this.$message("结束时间要大于开始时间");
                flag = true;
              }
            }else{
              this.$message("请选择开始时间");
              flag = true;
            }
          }
          if(!flag){
            this.listQuery.currentPage = 1;
            this.getList()
          }
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
      //删除数据
      del(row){
        let data = this.list[row];
        this.$confirm('是否确定删除该日志吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteItem(data.id).then(response => {
            var data = response.data;
            if(data.code==200){
              this.list.splice(row,1);
            }
          });
        });
      }
    }
  }
</script>

