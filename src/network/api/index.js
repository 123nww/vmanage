import ajax from './ajax'

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
export const pwdLogin = (loginForm) => ajax(BASE_URL + 'login',loginForm,'POST');
