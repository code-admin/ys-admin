import { capitalAmount } from './capitalAmount'

const Filters = {
  capitalAmount
}
export default function install(Vue) {
  if (!Vue) {
    console.error('please install Vue')
  }
  // *** register filter
  Object.keys(Filters).forEach(k => Vue.filter(k, Filters[k]))
}
