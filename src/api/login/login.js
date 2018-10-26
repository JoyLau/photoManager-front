import request from '@/utils/request'

//用户登录
export function loginByUsername(username, password,verificationCode,key) {
  const data = {
    username,
    password,
    verificationCode,
    key
  }
  return request({
    url:"/api/login?username="+data.username+"&password="+data.password+'&verificationCode='+data.verificationCode+'&key='+data.key+"&loginChannel=web",
    method: 'get'
  })
}
//用户退出
export function logout() {
  return request({
    url: '/api/logout',
    method: 'get',
  })
}
//获取当前登录用户信息
export function getUserInfo(token) {
  return request({
    url: '/api/info',
    method: 'get',
    params: {token}
  })
}

//获取验证码图片
export function getVerificationCode() {
  return request({
    url: '/api/getImageIdendifingCode'
  })
}

