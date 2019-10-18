import request from '@/utils/request'

// 导入的文件列表
export function getFileList(data) {
  return request({
    url: '/staffProduct/getFileList',
    method: 'post',
    data
  })
}

// 创建日志
export function submitStaffProductFile(data) {
  return request({
    url: '/staffProduct/submitStaffProductFile',
    method: 'post',
    data
  })
}

// 详情
export function getStaffProductRecordsByFileId(fileId) {
  return request({
    url: `/staffProduct/getStaffProductRecordsByFileId/${fileId}`,
    method: 'post'
  })
}

// 提交导入的数据
export function submitStaffProductRecords(data) {
  return request({
    url: '/staffProduct/submitStaffProductRecords',
    method: 'post',
    data
  })
}

// 录入生产数据
export function submitOneStaffProductRecord(data) {
  return request({
    url: '/staffProduct/submitOneStaffProductRecord',
    method: 'post',
    data
  })
}

// 初始化准备
export function getInitStaffDeviceInfo(data) {
  return request({
    url: '/staffProduct/getInitStaffDeviceInfo',
    method: 'post',
    data
  })
}

