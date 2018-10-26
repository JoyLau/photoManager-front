/**
 * 按钮级权限过滤
 */
import store from '@/store'

//接口级权限过滤
export function urlFilter(url){
  var flag = false;
  var menus = store.getters.menus;
  for(var i=0;i<menus.length;i++){
    if(url === menus[i]){
      flag = true;
      break;
    }
  }
  return flag;
}
