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
    url: '/productType/getProductTypes',
    method: 'post'
  })
}
// 品类列表
export function queryTypeList(data) {
  return request({
    url: '/productType/queryTypeList',
    method: 'post',
    data
  })
}

// 获取产品类型
export function deleteProductType(productTypeId) {
  return request({
    url: `/productType/deleteProductType/${productTypeId}`,
    method: 'post'
  })
}

// 品类保存
export function saveProductType(data) {
  return request({
    url: '/productType/saveProductType',
    method: 'post',
    data
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

// 有效产品列表
export function getValidateProducts(data) {
  return request({
    url: '/product/getValidateProducts',
    method: 'post',
    data: data || {}
  })
}

// 有效产品下拉列表专用
export function getAllProducts() {
  return request({
    url: '/product/getAllProducts',
    method: 'post'
  })
}

// 产品出入库列表
export function getProductLogList(data) {
  return request({
    url: '/product/getProductLogList',
    method: 'post',
    data
  })
}

// 新增出入库
export function createProductLog(data) {
  return request({
    url: '/product/createProductLog',
    method: 'post',
    data
  })
}

// 调换货
export function exchangeProductStock(data) {
  return request({
    url: '/product/exchangeProductStock',
    method: 'post',
    data
  })
}

// 获取产品列表
export function getProductReportList(data) {
  return request({
    url: '/product/getProductReportList',
    method: 'post',
    data
  })
}
// 导出报表
export function exportProductReport(data) {
  return request({
    url: '/product/exportProductReport',
    method: 'post',
    data
  })
}

// 产品管理导出
export function exportProduct(data) {
  return request({
    url: '/product/exportProduct',
    method: 'post',
    data
  })
}
