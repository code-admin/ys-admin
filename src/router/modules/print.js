import Layout from '@/layout'

export default {
    path: '/print',
    component: Layout,
    redirect: '/print/history',
    name: 'Print',
    meta: {
        title: '打印管理',
        icon: 'printer'
    },
    alwaysShow: true,
    children: [{
        path: '/print/history',
        name: 'PrintHistory',
        component: () =>
            import ('@/views/print/index.vue'),
        meta: {
            title: '打印历史'
        }
    }]
}