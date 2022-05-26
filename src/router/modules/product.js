import Layout from '@/layout'

export default {
    path: '/product',
    component: Layout,
    redirect: '/product/list',
    name: 'Product',
    meta: {
        title: '产品仓库',
        icon: 'product',
        roles: ['super_admin', 'admin', 'salesman', 'employee']
    },
    alwaysShow: true,
    children: [{
            path: '/product/list',
            name: 'ProductList',
            component: () =>
                import ('@/views/product/index'),
            meta: {
                title: '产品管理',
                roles: ['super_admin', 'admin', 'salesman']
            }
        },
        {
            path: '/product/class',
            name: 'ProductClass',
            component: () =>
                import ('@/views/product/class/index'),
            meta: {
                title: '品类管理',
                roles: ['super_admin', 'admin', 'salesman']
            }
        },
        {
            path: '/product/adjusted',
            name: 'ProductAdjusted',
            component: () =>
                import ('@/views/product/adjusted/index'),
            meta: {
                title: '调价规则',
                roles: ['super_admin', 'admin', 'salesman']
            }
        },
        {
            path: '/product/adjusted/add',
            name: 'ProductAdjustedAdd',
            component: () =>
                import ('@/views/product/adjusted/Add'),
            meta: {
                title: '添加规则',
                roles: ['super_admin', 'admin', 'salesman']
            },
            hidden: true
        },
        {
            path: '/product/adjusted/edit/:id',
            name: 'ProductAdjustedEdit',
            component: () =>
                import ('@/views/product/adjusted/Edit'),
            meta: {
                title: '修改规则',
                roles: ['super_admin', 'admin', 'salesman']
            },
            hidden: true
        },
        {
            path: '/product/adjusted/:id',
            name: 'ProductAdjustedDetail',
            component: () =>
                import ('@/views/product/adjusted/Detail'),
            meta: {
                title: '规则详情',
                roles: ['super_admin', 'admin', 'salesman']
            },
            hidden: true
        },
        {
            path: '/product/iostock',
            name: 'IOStock',
            component: () =>
                import ('@/views/product/iostock/index'),
            meta: {
                title: '产品出入库',
                roles: ['super_admin', 'admin', 'salesman', 'employee']
            }
        },
        {
            path: '/product/report',
            name: 'ProductReport',
            component: () =>
                import ('@/views/product/report/index'),
            meta: {
                title: '产品报表',
                roles: ['super_admin', 'admin', 'salesman']
            }
        }
    ]
}