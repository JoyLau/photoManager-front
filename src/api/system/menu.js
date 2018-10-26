/**
 * 菜单管理
 * Created by huangchao on 2018/7/20.
 */
'use strict'
import {BaseApi} from '../BaseApi'
export class Menu extends BaseApi{

  //查询接口
  queryApi = "/menu/list";
  //新增接口
  createApi = "/menu/create";
  //修改接口
  updateApi = "/menu/update";
  //删除接口
  deleteApi = "/menu/delete?id=";

  //获取菜单树
  getMenuTree(menuType){
    return super.get('/menu/tree?menuType='+menuType);
  }

  //获取角色对应的菜单
  getMenuByRole(roleId){
    return super.get( '/menu/findMenuByRole?roleId='+roleId);
  }

}

