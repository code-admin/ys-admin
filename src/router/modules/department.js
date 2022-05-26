import Layout from '@/layout'

export default {
    path: '/department',
    component: Layout,
    redirect: '/department/list',
    name: 'Department',
    meta: {
        title: '部门管理',
        icon: 'department',
        roles: ['super_admin', 'admin']
    },
    children: [{
            path: '/department/list',
            name: 'DepartmentList',
            component: () =>
                import ('@/views/department/department/index.vue'),
            meta: {
                title: '部门设置',
                roles: ['super_admin', 'admin']
            }
        },
        {
            path: '/job/list',
            name: 'JobList',
            component: () =>
                import ('@/views/department/job/index.vue'),
            meta: {
                title: '职位设置',
                roles: ['super_admin', 'admin']
            }
        }
    ]
}