import request from '@/utils/request'

export function getOrders(data) {
  return request({
    url: '/order/getOrderList',
    method: 'post',
    data
  })
}

// 获取订单状态集
export function getOrderTypes(data) {
  return request({
    url: '/order/getOrderTypes',
    method: 'post',
    data
  })
}

// 获取订单流程
export function getOrderFlowNodes(data) {
  return request({
    url: '/order/getOrderStatusFlow',
    method: 'post',
    data
  })
}

// 获取订单流程
export function getExpress() {
  return request({
    url: '/order/getExpress',
    method: 'post'
  })
}

// 保存订单
export function saveOrder(data) {
  return request({
    url: '/order/draftOrder',
    method: 'post',
    data
  })
}

// 提交订单
export function submitOrder(data) {
  return request({
    url: '/order/create',
    method: 'post',
    data
  })
}
