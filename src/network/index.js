import request from './request'

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

//分配用户角色
export function handleUserRight(id, data) {
    return request({
        url: 'users/' + id + '/role',
        method: 'PUT',
        data: data
    })
}


//获取所有的权限列表(type)
export function getRightsList(type) {
    return request({
        url: 'rights/' + type,
        method: 'GET'
    })
}


//获取角色列表
export function getRoleList() {
    return request({
        url: 'roles',
        method: 'GET'
    })
}

//添加角色
export function addRole(data) {
    return request({
        url: 'roles',
        method: 'POST',
        data: data
    })
}

//根据ID查询角色
export function queryById(id) {
    return request({
        url: 'roles/' + id,
        method: 'GET'
    })
}

//修改角色
export function updateRole(id, data) {
    return request({
        url: 'roles/' + id,
        method: 'PUT',
        data: data
    })
}

//根据ID删除角色
export function deleteRole(id) {
    return request({
        url: 'roles/' + id,
        method: 'DELETE'
    })
}

//角色授权
export function handleRole(roleId, data) {
    return request({
        url: 'roles/' + roleId + '/rights',
        method: 'POST',
        data: data
    })
}

//删除角色指定权限
export function deleteRoleRights(roleId, rightId) {
    return request({
        url: 'roles/' + roleId + '/rights/' + rightId,
        method: 'DELETE'
    })
}

//获取商品分类列表
export function getCategoryList(params) {
    return request({
        url: 'categories/',
        method: 'GET',
        params: params
    })
}

//添加分类
export function addCategory(data) {
    return request({
        url: 'categories',
        method: 'POST',
        data: data
    })
}

//根据ID查询分类
export function queryByIdCate(id) {
    return request({
        url: 'categories/' + id,
        method: 'GET'
    })
}

//修改分类
export function updateCate(id, data) {
    return request({
        url: 'categories/' + id,
        method: 'PUT',
        data: data
    })
}

//删除分类
export function deleteCate(id) {
    return request({
        url: 'categories/' + id,
        method: 'DELETE'
    })
}

//参数列表
export function paramList(id, sel) {
    return request({
        url: 'categories/' + id + '/attributes',
        method: 'GET',
        params: {
            sel
        }
    })
}

//删除参数
export function removeAttr(catId, attrId) {
    return request({
        url: 'categories/' + catId + '/attributes/' + attrId,
        method: 'DELETE'
    })
}

//添加动态参数或者静态属性
export function addParams(id, data) {
    return request({
        url: 'categories/' + id + '/attributes',
        method: 'POST',
        data: data
    })
}

//根据ID查询参数
export function queryByIdParam(id, attrId, params) {
    return request({
        url: 'categories/' + id + '/attributes/' + attrId,
        method: 'GET',
        params: params
    })
}

//修改参数
export function updateParams(id, attrId, data) {
    return request({
        url: 'categories/' + id + '/attributes/' + attrId,
        method: 'PUT',
        data: data
    })
}

//删除参数
export function deleteParams(id, attrId){
    return request({
        url:'categories/'+id+'/attributes/'+attrId,
        method: 'DELETE'
    })
}