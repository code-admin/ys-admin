import request from '@/utils/request'

// 收款列表
export function getOrderBillList(data) {
  return request({
    url: '/bill/getOrderBillList',
    method: 'post',
    data
  })
}

// 保存
export function submitOrderBill(data) {
  return request({
    url: '/bill/submitOrderBill',
    method: 'post',
    data
  })
}

// 根据ID删除
export function deleteOrderBillById(billId) {
  return request({
    url: `/bill/deleteOrderBillById/${billId}`,
    method: 'post'
  })
}

// 账目明细
export function getOrderBillSummaryList(data) {
  return request({
    url: '/bill/getOrderBillSummaryList',
    method: 'post',
    data
  })
}
