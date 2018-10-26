/**
 * 相册管理
 * Created by huangchao on 2018/7/19.
 */
'use strict'
import {BaseApi} from '../BaseApi'
export class Photo extends BaseApi{

  //查询接口
  queryApi = "/photo/list";
  //新增接口
  createApi = "/photo/create";
  //修改接口
  updateApi= "/photo/update";
  //删除接口
  deleteApi = "/photo/delete?id=";


}
