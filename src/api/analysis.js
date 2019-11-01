import request from '@/utils/request'

// 日汇生产总
export function getProduceDailyReport(data) {
  return request({
    url: '/report/getProduceDailyReport',
    method: 'post',
    data
  })
}

// 月汇生产总
export function getProduceMonthReport(data) {
  return request({
    url: '/report/getProduceMonthReport',
    method: 'post',
    data
  })
}

// 年汇生产总
export function getProduceYearReport(data) {
  return request({
    url: '/report/getProduceYearReport',
    method: 'post',
    data
  })
}

// 员工合格率
export function getProduceStaffReport(data) {
  return request({
    url: '/report/getProduceStaffReport',
    method: 'post',
    data
  })
}

// 生产数据
export function getProduceStaffDetailReport(data) {
  return request({
    url: '/report/getProduceStaffDetailReport',
    method: 'post',
    data
  })
}
