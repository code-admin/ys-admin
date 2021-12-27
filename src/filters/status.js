function deliveryStatus(value) {
  switch (value) {
    case 0:
      return '制单'
    case 1:
      return '待接单'
    case 2:
      return '已接单'
    case 3:
      return '待出库'
    case 4:
      return '配送中'
    case 5:
      return '签收'
    case 6:
      return '完成'
    default:
      return ''
  }
}
export {
  deliveryStatus
}
