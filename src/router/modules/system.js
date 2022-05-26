import Layout from '@/layout'

export default {
    path: '/system',
    component: Layout,
    redirect: '/system/device',
    name: 'System',
    meta: {
        title: '系统管理',
        icon: 'system-management',
        roles: ['super_admin', 'admin']
    },
    alwaysShow: true,
    children: [{
        path: 'device',
        name: 'Device',
        component: () =>
            import ('@/views/system/device/index'),
        meta: {
            title: '设备维护',
            roles: ['super_admin', 'admin']
        }
    }, {
        path: 'warehouse',
        name: 'Warehouse',
        component: () =>
            import ('@/views/system/warehouse/Index'),
        meta: {
            title: '发货地址',
            roles: ['super_admin', 'admin']
        }
    }]
}