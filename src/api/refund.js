import request from '@/utils/request'

/**
 * 退筒订单
 * @param {*} data
 */
export function refundList(data) {
  return request({
    url: '/refund/refundList',
    method: 'post',
    data
  })
}

export function queryList(data) {
  return request({
    url: '/refund/list',
    method: 'post',
    data
  })
}

/**
 * 删除退筒订单
 * @param {*} refundId
 */
export function cancelRefund(refundId) {
  return request({
    url: `/refund/cancelRefund/${refundId}`,
    method: 'post'
  })
}

/**
 * 根据明细ID删除退筒明细
 * @param {*} refundDetailId
 */
export function cancelReturnOrder(refundDetailId) {
  return request({
    url: `/refund/cancelReturnOrder/${refundDetailId}`,
    method: 'post'
  })
}

/**
 * 根据退筒单ID查询退筒明细
 * @param {*} refundId
 */
export function getRefundOrderDetails(refundId) {
  return request({
    url: `/refund/getRefundOrderDetails/${refundId}`,
    method: 'post'
  })
}

