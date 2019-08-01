import request from '@/utils/request'

export function fetDeptList(data) {
  return request({
    url: '/department/getDepartmentList',
    method: 'post',
    data
  })
}
export function saveDeptment(data) {
  return request({
    url: '/department/saveDepartment',
    method: 'post',
    data
  })
}
export function deleteDeptById(id) {
  return request({
    url: `/department/deleteDepartmentById/${id}`,
    method: 'post'
  })
}
