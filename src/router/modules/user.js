import Layout from '@/layout'

export default {
    path: '/user',
    component: Layout,
    redirect: '/user/employee',
    name: 'User',
    meta: {
        title: '用户管理',
        icon: 'user',
        roles: ['super_admin', 'admin']
    },
    children: [{
            path: '/user/employee',
            name: 'UserEmployee',
            component: () =>
                import ('@/views/user/employee/index'),
            meta: {
                title: '员工管理',
                roles: ['super_admin', 'admin']
            }
        },

        {
            path: '/user/customer',
            name: 'UserCustomer',
            component: () =>
                import ('@/views/user/customer/index'),
            meta: {
                title: '客户管理',
                roles: ['super_admin', 'admin', 'salesman']
            }
        }
    ]
}