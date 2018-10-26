/**
 * 角色管理
 * Created by huangchao on 2018/7/19.
 */
'use strict'
import {BaseApi} from '../BaseApi'
export class Role extends BaseApi{

  //查询接口
  queryApi = "/role/list";
  //新增接口
  createApi = "/role/create";
  //修改接口
  updateApi= "/role/update";
  //删除接口
  deleteApi = "/role/delete?id=";

  /**
   * 分配角色菜单
   * @param data
   */
  allotRoleMenu(data){
    return super.post('/role/allot',data);
  }

}
