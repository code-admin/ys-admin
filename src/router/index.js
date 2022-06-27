import Vue from 'vue'
import Router from 'vue-router'

import orderRouter from './modules/order'
import refundRouter from './modules/refund'
import deliveryRouter from './modules/delivery'
import printRouter from './modules/print'
import billRouter from './modules/bill'
import analysisRouter from './modules/analysis'
import productRouter from './modules/product'
import produceRouter from './modules/produce'
import userRouter from './modules/user'
import departmentRouter from './modules/department'
import feedbackRouter from './modules/feedback'
import systemRouter from './modules/system'

Vue.use(Router)
    /* Layout */
import Layout from '@/layout'

export const constantRoutes = [{
        path: '/login',
        component: () =>
            import ('@/views/login/index'),
        meta: {
            title: '系统登录'
        },
        hidden: true
    },

    {
        path: '/404',
        component: () =>
            import ('@/views/404'),
        meta: {
            title: '哎呀～，页面丢失！'
        },
        hidden: true
    },

    {
        path: '/',
        component: Layout,
        redirect: '/dashboard',
        children: [{
            path: 'dashboard',
            name: 'Dashboard',
            component: () =>
                import ('@/views/dashboard/index'),
            meta: {
                title: '管理首页',
                icon: 'dashboard'
            }
        }]
    },

    {
        path: '/print/history/view/:id',
        name: 'PrintHistoryView',
        component: () =>
            import ('@/views/print/PrintView.vue'),
        hidden: true,
        meta: {
            title: '提货单'
        }
    },
    {
        path: '/print/history/view/2/:id',
        name: 'PrintHistoryView2',
        component: () =>
            import ('@/views/print/PrintView2.vue'),
        hidden: true,
        meta: {
            title: '结算单'
        }
    },
    {
        path: '/print/history/view/3/:id',
        name: 'PrintHistoryView3',
        component: () =>
            import ('@/views/print/PrintView3.vue'),
        hidden: true,
        meta: {
            title: '结算单'
        }
    },
    {
        path: '/print/history/view/4/:id',
        name: 'PrintHistoryView4',
        component: () =>
            import ('@/views/print/PrintView4.vue'),
        hidden: true,
        meta: {
            title: '结算单'
        }
    },
    {
        path: '/print/history/view/5/:id',
        name: 'PrintHistoryView5',
        component: () =>
            import ('@/views/print/PrintView5.vue'),
        hidden: true,
        meta: {
            title: '收款单'
        }
    }

    // 404 page must be placed at the end !!!
    // {
    //     path: '*',
    //     redirect: '/404',
    //     hidden: true
    // }
]

//异步挂载的路由
//动态需要根据权限加载的路由表 
export const asyncRoutes = [
    orderRouter,
    refundRouter,
    deliveryRouter,
    printRouter,
    billRouter,
    analysisRouter,
    productRouter,
    produceRouter,
    userRouter,
    departmentRouter,
    feedbackRouter,
    systemRouter,
    // 404 page must be placed at the end !!!
    { path: '*', redirect: '/404', hidden: true }
];

const createRouter = () => new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({
        y: 0
    }),
    routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
    const newRouter = createRouter()
    router.matcher = newRouter.matcher // reset router
}

export default router