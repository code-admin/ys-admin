import Layout from '@/layout'

export default {
    name: 'delivery',
    path: '/delivery',
    component: Layout,
    meta: { title: '配送管理', icon: 'truck', roles: ['super_admin', 'admin', 'salesman', 'auditor', 'employee'] },
    redirect: '/delivery/order',
    alwaysShow: true,
    children: [{
            name: 'DeliveryOrder',
            path: '/delivery/order',
            component: () =>
                import ('@/views/delivery/order/Index.vue'),
            meta: {
                title: '配送订单',
                roles: ['super_admin', 'admin', 'salesman', 'auditor', 'employee']
            }
        },
        {
            name: 'DeliveryOrderAdd',
            path: '/delivery/order/add',
            hidden: true,
            component: () =>
                import ('@/views/delivery/order/Edit.vue'),
            meta: { title: '新增订单', roles: ['super_admin', 'admin', 'salesman', 'auditor'] }
        },
        {
            name: 'DeliveryOrderEdit',
            path: '/delivery/order/edit/:id',
            hidden: true,
            component: () =>
                import ('@/views/delivery/order/Edit.vue'),
            meta: { title: '编辑订单', roles: ['super_admin', 'admin', 'salesman', 'auditor'] }
        },
        {
            name: 'DeliveryOrderDetail',
            path: '/delivery/order/Detil/:id',
            hidden: true,
            component: () =>
                import ('@/views/delivery/order/Detail.vue'),
            meta: { title: '订单详情', roles: ['super_admin', 'admin', 'salesman', 'auditor', 'employee', 'outsource'] }
        }
    ]
}