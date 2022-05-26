import Layout from '@/layout'

export default {
    path: '/bill',
    component: Layout,
    redirect: '/bill/receipt',
    name: 'Bill',
    meta: {
        title: '账单管理',
        icon: 'cashier',
        roles: ['super_admin', 'admin', 'salesman', 'auditor']
    },
    alwaysShow: true,
    children: [{
            path: '/bill/receipt',
            name: 'BillReceipt',
            component: () =>
                import ('@/views/bill/receipt/index'),
            meta: {
                title: '收款管理',
                roles: ['super_admin', 'admin', 'salesman', 'auditor']
            }
        },
        {
            path: '/bill/receipt/add',
            name: 'BillReceiptAdd',
            component: () =>
                import ('@/views/bill/receipt/Add'),
            meta: {
                title: '新增收款',
                roles: ['super_admin', 'admin', 'salesman', 'auditor', ]
            },
            hidden: true
        },
        {
            path: '/bill/receipt/addReturn',
            name: 'BillReceiptAddReturn',
            component: () =>
                import ('@/views/bill/receipt/AddReturn'),
            meta: {
                title: '添加退筒单',
                roles: ['super_admin', 'admin', 'salesman']
            },
            hidden: true
        },
        {
            path: '/bill/detail',
            name: 'BillDetail',
            component: () =>
                import ('@/views/bill/detail/index'),
            meta: {
                title: '账目明细',
                roles: ['super_admin', 'admin']
            }
        },
        {
            path: '/bill/total',
            name: 'BillTotal',
            component: () =>
                import ('@/views/bill/total/index'),
            meta: {
                title: '账目汇总',
                roles: ['super_admin', 'admin']
            }
        }
    ]
}