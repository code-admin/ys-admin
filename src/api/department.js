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

// ////////////////职位////////////////////
export function getJobs(data) {
  return request({
    url: '/department/getJobList',
    method: 'post',
    data
  })
}

export function saveJobInfo(data) {
  return request({
    url: '/department/saveJob',
    method: 'post',
    data
  })
}

export function deleteJobById(id) {
  return request({
    url: `/department/deleteJobById/${id}`,
    method: 'post'
  })
}
