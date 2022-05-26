import Layout from '@/layout'

export default {
    path: '/refund',
    component: Layout,
    redirect: '/refund/list',
    name: 'Refund',
    meta: {
        title: '退筒管理',
        icon: 'tuitong',
        roles: ['super_admin', 'admin', 'salesman']
    },
    alwaysShow: true,
    children: [{
            path: '/refund/list',
            name: 'OrderRefund',
            component: () =>
                import ('@/views/refund/index'),
            meta: {
                title: '退筒管理',
                roles: ['super_admin', 'admin', 'salesman']
            }
        },
        {
            path: '/refund/add',
            name: 'OrderRefundAdd',
            component: () =>
                import ('@/views/refund/Add'),
            meta: {
                title: '添加退筒',
                roles: ['super_admin', 'admin', 'salesman']
            },
            hidden: true
        },
        {
            path: '/refund/batch/:number/:weight',
            name: 'OrderRefundBatch',
            component: () =>
                import ('@/views/refund/Batch'),
            meta: {
                title: '添加退筒',
                roles: ['super_admin', 'admin', 'salesman']
            },
            hidden: true
        },
        {
            path: '/refund/history',
            name: 'OrderRefundHistory',
            component: () =>
                import ('@/views/refund/History/index'),
            meta: {
                title: '退筒记录',
                roles: ['super_admin', 'admin', 'salesman']
            }
        },
        {
            path: '/refund/detail/:id',
            name: 'OrderRefundDetail',
            component: () =>
                import ('@/views/refund/Detail/index'),
            meta: {
                title: '退筒明细',
                roles: ['super_admin', 'admin', 'salesman']
            },
            hidden: true
        },
        {
            path: '/refund/history/list',
            name: 'OrderRefundHistoryList',
            component: () =>
                import ('@/views/refund/History/List'),
            meta: {
                title: '退筒明细',
                roles: ['super_admin', 'admin', 'salesman']
            }
        }
    ]
}