import request from '@/utils/request'

// 配送表
export function getDeliverList(data) {
    return request({
        url: '/deliver/list',
        method: 'post',
        data
    })
}

// 保存
export function saveData(data) {
    return request({
        url: '/deliver/save',
        method: 'post',
        data
    })
}
// 删除订单产品出库草稿记录
export function deleteDeliveryOrder(expressId) {
    return request({
        url: `/deliver/deleteDeliveryOrder/${expressId}`,
        method: 'post'
    })
}
// 派单信息详情
export function detail(deliverId) {
    return request({
        url: `/deliver/detail/${deliverId}`,
        method: 'post'
    })
}

// 配送单出库
export function submitExpressOrder(data) {
    return request({
        url: '/deliver/submitExpressOrder',
        method: 'post',
        data
    })
}

// 保存草稿订单产品出库
export function saveExpressOrder(data) {
    return request({
        url: '/deliver/saveExpressOrder',
        method: 'post',
        data
    })
}

//
export function updateStatus(data) {
    return request({
        url: '/deliver/updateStatus',
        method: 'post',
        data
    })
}

// 配送单作废
export function cancel(deliverId) {
    return request({
        url: `/deliver/cancel/${deliverId}`,
        method: 'post'
    })
}