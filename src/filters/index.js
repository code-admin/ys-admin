import { capitalAmount } from './capitalAmount'
import { deliveryStatus } from './status'

const Filters = {
  capitalAmount, deliveryStatus
}
export default function install(Vue) {
  if (!Vue) {
    console.error('please install Vue')
  }
  // *** register filter
  Object.keys(Filters).forEach(k => Vue.filter(k, Filters[k]))
}
