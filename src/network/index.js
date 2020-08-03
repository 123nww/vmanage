import request from './request'

// 1. 定义基础路径
const BASE_URL = 'http://127.0.0.1:8888/api/private/v1/';


/***** 登录界面接口 *********/
// 1.获取手机验证码(GET)
// Easy Mock 模拟发送验证码 
// export const getPhoneCaptcha = (phoneNumber) => ajax(BASE_URL + 'send_code', {
//     phoneNumber
// });


// // 3.账号密码登录(POST)
// export const pwdLogin = (userName, pwd, captcha) => ajax(BASE_URL + 'login_pwd', {
//     userName,
//     pwd,
//     captcha
// }, 'POST');

//账号密码登录(POST)
export function pwdLogin(data) {
    return request({
        url: 'login',
        method: 'POST',
        data: data
    })
}

//获取所有的菜单
export function getMenuList() {
    return request({
        url: 'menus',
        method: 'GET'
    })
}

//获取用户列表
export function getUserList(params) {
    return request({
        url: 'users',
        method: 'GET',
        params: params
    })
}

//修改用户的状态
export function updateUser(uId, type) {
    return request({
        url: 'users/' + uId + '/state/' + type,
        method: 'PUT'
    })

}

//添加用户
export function addUser(data) {
    return request({
        url: 'users',
        method: 'POST',
        data: data
    })
}

//根据ID查询用户信息
export function queryByIdUser(id) {
    return request({
        url: 'users/' + id,
        method: 'GET',
    })
}

//根据ID修改用户信息
export function updateById(id, data) {
    return request({
        url: 'users/' + id,
        method: 'PUT',
        data: data
    })
}

//根据ID删除用户
export function deleteUser(id) {
    return request({
        url: 'users/' + id,
        method: 'DELETE'
    })
}