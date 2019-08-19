import request from '@/utils/request'

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
