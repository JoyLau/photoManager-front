/**
 * 基础API对象
 */
'use strict'
import request from '@/utils/request'
export class BaseApi{

  /**
   * 查询列表
   * @param url
   * @param data
   */
  getList(url,data){
    return this.post(url,data);
  }

  /**
   * 新增对象
   * @param url
   * @param data
   */
  createItem(url,data){
    return this.post(url,data);
  }

  /**
   * 修改对象
   * @param url
   * @param data
   */
  updateItem(url,data){
    return this.post(url,data);
  }

  /**
   * 删除对象
   * @param url?id=xxxx
   */
  deleteItem(url,id){
    return this.get(url+id);
  }

  /**
   * post调用
   * @param url
   * @param data
   */
  post(url,data){
    var params = new URLSearchParams();
    for (let item in data) {
      if(data[item]!=null){
        params.append(item, data[item]);
      }
    }
    return request({
      url: url,
      method: 'post',
      data:params
    })
  }

  /**
   * get调用
   * @param url
   */
  get(url){
    return request({
      url: url,
      method: 'get'
    })
  }

}
