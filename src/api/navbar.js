/**顶部个人信息以及修改密码**/

import request from '@/utils/request'

//修改用户密码
export function updatePassword(oldPassword,password){
  return request({
    url:"/user/updatePassword?oldPassword="+oldPassword+"&password="+password,
    method: 'get'
  })
}

//修改个人信息
export function updateUser(data) {
  var params = new URLSearchParams();
  for (let item in data) {
    params.append(item, data[item]);
  }
  return request({
    url:"/user/updatePersonalUser",
    method: 'post',
    data:params
  })
}
