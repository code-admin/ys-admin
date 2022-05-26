import Layout from '@/layout'

const chartsRouter = {
    path: '/order',
    component: Layout,
    redirect: '/order/manage',
    name: 'Order',
    meta: {
        title: '订单管理',
        icon: 'order',
        roles: ['super_admin', 'admin', 'salesman', 'auditor']
    },
    children: [{
            path: '/order/manage',
            name: 'OrderManage',
            component: () =>
                import ('@/views/order/manage/index'),
            meta: {
                title: '订单管理',
                roles: ['super_admin', 'admin', 'salesman', 'auditor']
            }
        },
        {
            path: '/order/manage/add',
            name: 'OrderManageAdd',
            component: () =>
                import ('@/views/order/manage/add'),
            hidden: true,
            meta: {
                title: '新建销售单',
                roles: ['super_admin', 'admin', 'salesman', 'auditor']
            }
        },
        {
            path: '/order/manage/return/add',
            name: 'OrderManageReturnAdd',
            component: () =>
                import ('@/views/order/manage/return/add'),
            hidden: true,
            meta: {
                title: '新建退货单',
                roles: ['super_admin', 'admin', 'salesman', 'auditor']
            }
        },
        {
            path: '/order/manage/edit/:id',
            name: 'OrderManageEdit',
            component: () =>
                import ('@/views/order/manage/edit'),
            hidden: true,
            meta: {
                title: '编辑销售单',
                roles: ['super_admin', 'admin', 'salesman', 'auditor']
            }
        },
        {
            path: '/order/manage/return/edit/:id',
            name: 'OrderManageReturnEdit',
            component: () =>
                import ('@/views/order/manage/return/edit'),
            hidden: true,
            meta: {
                title: '编辑退货单',
                roles: ['super_admin', 'admin', 'salesman', 'auditor']
            }
        },
        {
            path: '/order/manage/detail/:id',
            name: 'OrderManageDetail',
            component: () =>
                import ('@/views/order/manage/detail'),
            hidden: true,
            meta: {
                title: '销售单详情',
                roles: ['super_admin', 'admin', 'salesman', 'auditor']
            }
        },
        {
            path: '/order/manage/return/detail/:id',
            name: 'OrderManageReturnDetail',
            component: () =>
                import ('@/views/order/manage/return/detail'),
            hidden: true,
            meta: {
                title: '退货单详情',
                roles: ['super_admin', 'admin', 'salesman', 'auditor']
            }
        },
        {
            path: '/order/printing/extracted/:id',
            name: 'ExtractedPrint',
            component: () =>
                import ('@/views/order/manage/extractedPrint'),
            hidden: true,
            meta: {
                title: '打印提货单',
                roles: ['super_admin', 'admin', 'salesman', 'auditor']
            }
        },
        {
            path: '/order/printing/checkout/:id',
            name: 'OrderPrinting',
            component: () =>
                import ('@/views/order/manage/printing'),
            hidden: true,
            meta: {
                title: '打印预览',
                roles: ['super_admin', 'admin', 'salesman', 'auditor']
            }
        },
        {
            path: '/order/approval',
            name: 'OrderApproval',
            component: () =>
                import ('@/views/order/approval/index'),
            meta: {
                title: '订单审核',
                roles: ['super_admin', 'admin', 'salesman', 'auditor']
            }
        },
        {
            path: '/order/approval/detail/:type/:id',
            name: 'OrderApprovalDetail',
            component: () =>
                import ('@/views/order/approval/detail'),
            hidden: true,
            meta: {
                title: '审核详情',
                roles: ['super_admin', 'admin', 'salesman', 'auditor']
            }
        },
        {
            path: '/order/detail',
            name: 'OrderDetail',
            component: () =>
                import ('@/views/order/detail/index'),
            meta: {
                title: '订单明细',
                roles: ['super_admin', 'admin', 'salesman', 'auditor']
            }
        }
    ]
}
export default chartsRouter