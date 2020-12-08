import request from '@/utils/request'

/**
 * 规则列表
 * @param {*} data
 */
export function queryList(data) {
  return request({
    url: '/productRule/queryList',
    method: 'post',
    data
  })
}
/**
 * 保存规则
 * @param {*} data
 */
export function saveRule(data) {
  return request({
    url: '/productRule/saveRule',
    method: 'post',
    data
  })
}
/**
 * 规则详情
 * @param {*} productRuleId
 */
export function getRuleById(productRuleId) {
  return request({
    url: `/productRule/getRuleById/${productRuleId}`,
    method: 'post'
  })
}
/**
 * 删除规则
 * @param {*} productRuleId
 */
export function deleteRuleById(productRuleId) {
  return request({
    url: `/productRule/deleteRuleById/${productRuleId}`,
    method: 'post'
  })
}
