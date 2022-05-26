import Layout from '@/layout'

export default {
    path: '/produce',
    component: Layout,
    redirect: '/produce/log',
    meta: {
        title: '生产管理',
        icon: 'produce'
    },
    alwaysShow: true,
    children: [{
            path: '/produce/log',
            name: 'ProduceLog',
            component: () =>
                import ('@/views/produce/log/index'),
            meta: {
                title: '生产日志'
            }
        },
        {
            path: '/produce/device',
            name: 'ProduceDevice',
            component: () =>
                import ('@/views/produce/device/index'),
            meta: {
                title: '设备绑定'
            }
        },
        {
            path: '/produce/log/import',
            name: 'ProduceLogImport',
            component: () =>
                import ('@/views/produce/log/ImportData'),
            hidden: true,
            meta: {
                title: '导入数据'
            }
        },
        {
            path: '/produce/log/detail/:id/:reportTime',
            name: 'ProduceLogDetail',
            component: () =>
                import ('@/views/produce/log/Detail'),
            hidden: true,
            meta: {
                title: '数据详情'
            }
        }
    ]
}