import request from '@/utils/request'

/**
 * 保存打印记录
 * @param {*} data
 */
export function installData(data) {
  return request({
    url: '/print/savePrint',
    method: 'post',
    data
  })
}

/**
 * 查询打印记录
 * @param {*} data
 */
export function queryList(data) {
  return request({
    url: '/print/queryList',
    method: 'post',
    data
  })
}
