import Layout from '@/layout'

export default {
    path: '/analysis',
    component: Layout,
    redirect: '/analysis/produce',
    name: 'Analysis',
    meta: {
        title: '数据分析',
        icon: 'analysis',
        roles: ['super_admin', 'admin']
    },
    alwaysShow: true,
    children: [{
            path: '/analysis/produce',
            name: 'AnalysisProduce',
            component: () =>
                import ('@/views/analysis/produce/index'),
            meta: {
                title: '生产数据',
                roles: ['super_admin', 'admin']
            }
        },
        {
            path: '/analysis/month',
            name: 'AnalysisMonth',
            component: () =>
                import ('@/views/analysis/month/index'),
            meta: {
                title: '月汇产总',
                roles: ['super_admin', 'admin']
            }
        },
        {
            path: '/analysis/day',
            name: 'AnalysisDay',
            component: () =>
                import ('@/views/analysis/day/index'),
            meta: {
                title: '日汇产总',
                roles: ['super_admin', 'admin']
            }
        },
        {
            path: '/analysis/year',
            name: 'AnalysisYear',
            component: () =>
                import ('@/views/analysis/year/index'),
            meta: {
                title: '年汇产总',
                roles: ['super_admin', 'admin']
            }
        },
        {
            path: '/analysis/passrate',
            name: 'AnalysisPassrate',
            component: () =>
                import ('@/views/analysis/passrate/index'),
            meta: {
                title: '员工合格率',
                roles: ['super_admin', 'admin']
            }
        }
    ]
}