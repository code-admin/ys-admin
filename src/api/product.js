import request from '@/utils/request'

// 获取产品列表
export function getProducts(data) {
  return request({
    url: '/product/getProductList',
    method: 'post',
    data
  })
}

// 获取产品类型
export function getProductTypes() {
  return request({
    url: '/product/getProductTypes',
    method: 'post'
  })
}

// 获取产品上下架
export function disable(data) {
  return request({
    url: '/product/enableProduct',
    method: 'post',
    data
  })
}

// 保存产品信息
export function saveProductInfo(data) {
  return request({
    url: '/product/saveProduct',
    method: 'post',
    data
  })
}
