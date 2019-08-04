import request from '@/utils/request'

// 获取反馈列表
export function getFeedBackList(data) {
  return request({
    url: '/feedback/getFeedBackList',
    method: 'post',
    data
  })
}

// 问题类型列表
export function getFeedBackTypeList() {
  return request({
    url: '/feedback/getFeedBackTypes',
    method: 'post'
  })
}

// 反馈详情
export function feedbackDetailById(id) {
  return request({
    url: `/feedback/getFeedbackById/${id}`,
    method: 'post'
  })
}

// 回馈记录
export function getRemarkListByFeedBackId(id) {
  return request({
    url: `/feedback/getFeedbackRemarkById/${id}`,
    method: 'post'
  })
}

// 添加反馈
export function addRemark(data) {
  return request({
    url: '/feedback/addRemark',
    method: 'post',
    data
  })
}

// 修改反馈
export function updateFeedback(data) {
  return request({
    url: '/feedback/updateFeedback',
    method: 'post',
    data
  })
}
