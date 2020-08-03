import axios from 'axios'
import { getLocalStore } from 'config/global.js'
import { Message, MessageBox } from 'element-ui'

// 创建axios实例
const BASE_URL = 'http://127.0.0.1:8888/api/private/v1/';
const service = axios.create({
  baseURL: BASE_URL, // api的base_url
  timeout: 15000 // 请求超时时间
})

// request拦截器
service.interceptors.request.use(config => {
  const token = getLocalStore('token');
  if (token) {
    config.headers['Authorization'] = token // 让每个请求携带自定义token 请根据实际情况自行修改
  }
  return config
}, error => {
  // Do something with request error
  //console.log(error) // for debug
  Message({
    message: error,
    type: 'error',
    duration: 3 * 1000
  })
  Promise.reject(error)
})

// respone拦截器
service.interceptors.response.use(
  response => {
  /**
  * code为非200是抛错 可结合自己业务进行修改
  */
    const res = response.data
    if (res.meta.status !== 200 && res.meta.status !== 201) {
      Message({
        message: res.meta.msg,
        type: 'error',
        duration: 3 * 1000
      })

      // 401:未登录;
      if (res.meta.status === 401) {
        MessageBox.confirm('你已被登出，可以取消继续留在该页面，或者重新登录', '确定登出', {
          confirmButtonText: '重新登录',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // store.dispatch('FedLogOut').then(() => {
          //   location.reload()// 为了重新实例化vue-router对象 避免bug
          // })
        })
      }
      return Promise.reject('error')
    } else {
      return response.data
    }
    return response.data
  },
  error => {
    //console.log('err' + error)// for debug
    Message({
      message: error,
      type: 'error',
      duration: 3 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
