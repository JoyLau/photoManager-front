import axios from 'axios'
import { Message ,MessageBox } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'

// create an axios instance,创建axios实例
let base = process.env.API_URL;

//获取请求链接
export function getUrl() {
  return base;
}
const service = axios.create({
  baseURL: base, // api的base_url
  timeout: 50000 // request timeout 请求超时时间
})

// request interceptor request拦截器
service.interceptors.request.use(config => {
  // Do something before request is sent
  if (store.getters.token) {
    config.headers['X-Token'] = getToken(); // 让每个请求携带token-- ['X-Token']为自定义key 请根据实际情况自行修改
    config.headers['Login-Channel'] = 'web';
  }
  return config
}, error => {
  // Do something with request error
  console.log(error) // for debug
  Promise.reject(error)
})

// respone interceptor respone拦截器
service.interceptors.response.use(
  // response => response,
  response => {
    /**
     * 下面的注释为通过response自定义code来标示请求状态，当code返回如下情况为权限有问题，登出并返回到登录页
     * 如通过xmlhttprequest 状态码标识 逻辑可写在下面error中
     */
    const res = response.data;
    console.log(typeof res.code)
    if (res.code !== 200) {
      // 403:token已过期;
      if (res.code === 403) {
        MessageBox.confirm('登录令牌已过期', '确定登出', {
          confirmButtonText: '重新登录',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          store.dispatch('FedLogOut').then(() => {
            location.reload();// 为了重新实例化vue-router对象 避免bug
          });
        })
      }else{
        Message({
          message: res.message,
          type: 'warning',
          duration: 5 * 1000
        })
      }
      return Promise.reject('error');
    } else {
      return response;
    }
  },
  error => {
    console.log('err' + error)// for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  })
export default service
