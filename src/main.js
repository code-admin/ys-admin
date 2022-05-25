import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/zh-CN' // lang i18n
import moment from 'vue-moment'
import VueAMap from 'vue-amap'
import map from '@/config/map'

// import Echarts from 'echarts'
import VueECharts from 'vue-echarts' // 在 webpack 环境下指向 components/ECharts.vue
// 全局引入
// require('echarts')

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // permission control

import filters from './filters' // 过滤器

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online! ! !
 */
import { mockXHR } from '../mock'
if (process.env.NODE_ENV === 'production') {
    mockXHR()
}

VueAMap.initAMapApiLoader({
    key: `${map.amap.WEB_API_KEY}`,
    plugin: ['Geolocation', 'Autocomplete', 'PlaceSearch', 'Scale', 'ToolBar', 'MapType', 'CircleEditor', 'Driving', 'PoiPicker'],
    uiVersion: '1.0.11', // ui库版本，不配置不加载,
    v: '1.4.15' // 默认高德 sdk 版本为 1.4.4
})



// 防抖处理-立即执行
const on = Vue.prototype.$on
Vue.prototype.$on = function(event, func) {
    let timer;
    let flag = true;
    let newFunc = func
    if (event == 'click') {
        newFunc = function() {
            if (flag) {
                func.apply(this, arguments)
                flag = false
            }
            clearTimeout(timer)
            timer = setTimeout(function() {
                flag = true
            }, 1000)
        }
    }
    on.call(this, event, newFunc)
}

// set ElementUI lang to EN
Vue.use(ElementUI, { locale })
    // set amap
Vue.use(VueAMap)
Vue.use(moment)

Vue.use(filters)
    // echarts
    // Vue.use(Echarts)
Vue.component('v-chart', VueECharts)

Vue.config.productionTip = false

new Vue({ el: '#app', router, store, render: h => h(App) })