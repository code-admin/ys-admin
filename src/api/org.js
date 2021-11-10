import request from '@/utils/request'

// 收款列表
export function getShippingAddress (orgId) {
  return request({
    url: `/org/getShippingAddress/${orgId}`,
    method: 'post'
  })
}
