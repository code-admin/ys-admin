import request from '@/utils/request'

// 统计报表
export function getTotalReport() {
  return request({
    url: '/dashboard/indexTotalReport',
    method: 'post'
  })
}

export function getFeedbackReport(data) {
  return request({
    url: '/dashboard/indexFeedbackReport',
    method: 'post',
    data
  })
}

export function getOrderReport(data) {
  return request({
    url: '/dashboard/indexOrderReport',
    method: 'post',
    data
  })
}

export function weightRepor(data) {
  return request({
    url: '/dashboard/weightReport',
    method: 'post',
    data
  })
}

// 获取待出库统计、未完成统计
export function newTotalReport() {
  return request({
    url: `/dashboard/newTotalReport`,
    method: 'post'
  })
}
// 过去7天产品销售个数统计
export function orderNumberReport(data) {
  return request({
    url: `/dashboard/orderNumberReport`,
    method: 'post',
    data
  })
}

// 过去30天产品销售重量统计
export function orderWeightReport(data) {
  return request({
    url: `/dashboard/orderWeightReport`,
    method: 'post',
    data
  })
}
