import request from '@/utils/request'

// 获取设备列表
export function getDeviceList (data) {
  return request({
    url: '/device/getDeviceList',
    method: 'post',
    data
  })
}

// 保存设备
export function saveDevice (data) {
  return request({
    url: '/device/saveDevice',
    method: 'post',
    data
  })
}

// 删除设备
export function deleteDevice(id) {
  return request({
    url: `/device/deleteDevice/${id}`,
    method: 'post'
  })
}

// 获取有效设备列表
export function getValidateDeviceList(data) {
  return request({
    url: '/device/getValidateDeviceList',
    method: 'post',
    data
  })
}

// 获取有效设备列表
export function getDevicesByUserId(userId) {
  return request({
    url: `/device/getDevicesByUserId/${userId}`,
    method: 'post'
  })
}

// 获取有效设备绑定列表
export function getDeviceRelInfoList(data) {
  return request({
    url: `/device/getDeviceRelInfoList`,
    method: 'post',
    data
  })
}

// 设备绑定
export function bindDevice(data) {
  return request({
    url: `/device/bindDevice`,
    method: 'post',
    data
  })
}
