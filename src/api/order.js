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

// 订单详情
export function getOrderById(id) {
  return request({
    url: `/order/getOrderById/${id}`,
    method: 'post'
  })
}

// 关闭订单
export function closeOrder(id) {
  return request({
    url: `/order/closeOrder/${id}`,
    method: 'post'
  })
}
// 添加出库记录
export function addRemark(data) {
  return request({
    url: '/order/addRemark',
    method: 'post',
    data
  })
}

// ///////////////审核管理///////////////////////
export function getOrderApprovals(data) {
  return request({
    url: '/order/getOrderAuditList',
    method: 'post',
    data
  })
}

// 审核详情
export function getAuditById(id) {
  return request({
    url: `/audit/getAuditById/${id}`,
    method: 'post'
  })
}

// 提交审核
export function auditOrder(data) {
  return request({
    url: '/audit/auditOrder',
    method: 'post',
    data
  })
}

// 订单出库(草稿)
export function saveDeliveryOrder(data) {
  return request({
    url: '/order/saveDeliveryOrder',
    method: 'post',
    data
  })
}

// 删除出库草稿
export function deleteDeliveryOrder(id) {
  return request({
    url: `/order/deleteDeliveryOrder/${id}`,
    method: 'post'
  })
}

// 提交订单出库并更新库存
export function submitDeliveryOrder(data) {
  return request({
    url: '/order/submitDeliveryOrder',
    method: 'post',
    data
  })
}

// 订单完成出库
export function confirmOut(id) {
  return request({
    url: `/order/confirm/${id}`,
    method: 'post'
  })
}
