import request from '@/utils/request'

// 发货地址
export function getShippingAddress(orgId) {
  return request({
    url: `/org/getShippingAddress/${orgId}`,
    method: 'post'
  })
}

// 仓库管理查询
export function getShippingAddressList(data) {
  return request({
    url: '/org/shippingAddress/list',
    method: 'post',
    data
  })
}

// 发货地址
export function enable(data) {
  return request({
    url: '/org/shippingAddress/enable',
    method: 'post',
    data
  })
}

// 发货地址
export function saveShippingAddress(data) {
  return request({
    url: '/org/shippingAddress/save',
    method: 'post',
    data
  })
}
