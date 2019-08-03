import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/login/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/user/getUserByTokenId',
    method: 'post',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/login/logout',
    method: 'post'
  })
}

export function getUsers(data) {
  return request(
    {
      url: '/user/getUserList',
      method: 'post',
      data
    }
  )
}

// 保存用户信息
export function saveUserInfo(data) {
  return request(
    {
      url: '/user/saveUser',
      method: 'post',
      data
    }
  )
}

// 重置密码
export function resetPwd(id) {
  return request(
    {
      url: `/user/reset/${id}`,
      method: 'post'
    }
  )
}

// 禁用/启用
export function disable(data) {
  return request(
    {
      url: '/user/enable',
      method: 'post',
      data
    }
  )
}

// 获取系统角色
export function getRoleList(data) {
  return request({
    url: '/role/getRoleList',
    method: 'post',
    data
  })
}

// 获取客户类型
export function getCustomeTypeList() {
  return request({
    url: '/user/getCustomerTypes',
    method: 'post'
  })
}
