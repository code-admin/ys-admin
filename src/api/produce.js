import request from '@/utils/request'

// 导入的文件列表
export function getFileList(data) {
  return request({
    url: '/staffProduct/getFileList',
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
