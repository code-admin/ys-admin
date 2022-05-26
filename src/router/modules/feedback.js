import Layout from '@/layout'

export default {
    path: '/feedback',
    component: Layout,
    redirect: '/feedback/list',
    name: 'Feedback',
    meta: {
        title: '反馈管理',
        icon: 'feed_back'
    },
    alwaysShow: true,
    children: [{
            path: '/feedback/list',
            name: 'FeedbackList',
            component: () =>
                import ('@/views/feedback/index'),
            meta: {
                title: '反馈查询'
            }
        },
        {
            path: '/feedback/detail/:id',
            name: 'FeedbackDetail',
            component: () =>
                import ('@/views/feedback/detail'),
            hidden: true,
            meta: {
                title: '反馈详情'
            }
        }
        // {
        //   path: '/feedback/report',
        //   name: 'FeedbackReport',
        //   component: () => import('@/views/feedback/index'),
        //   meta: { title: '反馈报表' }
        // }
    ]
}