/**
 * 用户管理
 * Created by huangchao on 2018/7/19.
 */
'use strict'
import {BaseApi} from '../BaseApi'
export class User extends BaseApi{

  //查询接口
  queryApi = "/user/list";
  //新增接口
  createApi = "/user/create";
  //修改接口
  updateApi = "/user/update";
  //删除接口
  deleteApi = "/user/delete?id=";

  /**
   * 获取用户的部门数据范围
   * @param userId
   * @returns {*}
   */
  getOrgByUser(userId){
    return super.get('/user/getOrgsByUser?userId='+userId);
  }

  /**
   * 新增部门权限
   * @param data
   */
  addUserDataRange(data){
    return super.post('/user/saveUserDataRange',data);
  }

  /**
   * 重置密码
   * @param id
   */
  resetPassword(id){
    return super.get('/user/resetPassword?id='+id);
  }

}

