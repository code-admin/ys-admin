import request from '@/utils/request'

export function queryList(data) {
  return request({
    url: '/refund/list',
    method: 'post',
    data
  })
}

export function cancelReturnOrder(refundDetailId) {
  return request({
    url: `/refund/cancelReturnOrder/${refundDetailId}`,
    method: 'post'
  })
}

