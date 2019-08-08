import request from '@/utils/request'

// 省
export function getProvinces() {
  return request({
    url: '/common/regions/getProvinces',
    method: 'post'
  })
}
// 市
export function getCitys(id) {
  return request({
    url: `/common/regions/getCity/${id}`,
    method: 'post'
  })
}
// 区
export function getCountrys(id) {
  return request({
    url: `/common/regions/getCountry/${id}`,
    method: 'post'
  })
}

// 街
export function getTowns(id) {
  return request({
    url: `/common/regions/getTown/${id}`,
    method: 'post'
  })
}
