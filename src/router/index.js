import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '管理首页', icon: 'dashboard' }
    }]
  },

  {
    path: '/order',
    component: Layout,
    redirect: '/order/List',
    name: 'Order',
    meta: { title: '订单管理', icon: 'order' },
    children: [
      {
        path: '/order/List',
        name: 'OrderList',
        component: () => import('@/views/table/index'),
        meta: { title: '订单管理' }
      },

      {
        path: '/order/examination',
        name: 'OrderExamination',
        component: () => import('@/views/table/index'),
        meta: { title: '订单审核' }
      }
    ]
  },

  {
    path: '/user',
    component: Layout,
    redirect: '/user/employee',
    name: 'User',
    meta: { title: '用户管理', icon: 'user' },
    children: [
      {
        path: '/user/employee',
        name: 'UserEmployee',
        component: () => import('@/views/user/employee/index'),
        meta: { title: '员工管理' }
      },

      {
        path: '/user/customer',
        name: 'UserCustomer',
        component: () => import('@/views/user/customer/index'),
        meta: { title: '客户管理' }
      }
    ]
  },
  {
    path: '/department',
    component: Layout,
    redirect: '/department/list',
    name: 'Department',
    meta: { title: '部门管理', icon: 'department' },
    children: [
      {
        path: '/department/list',
        name: 'DepartmentList',
        component: () => import('@/views/department/department/index.vue'),
        meta: { title: '部门设置' }
      },
      {
        path: '/job/list',
        name: 'JobList',
        component: () => import('@/views/department/job/index.vue'),
        meta: { title: '职位设置' }
      }
    ]
  },
  {
    path: '/feedback',
    component: Layout,
    redirect: '/feedback/list',
    name: 'Feedback',
    meta: { title: '反馈管理', icon: 'feed_back' },
    children: [
      {
        path: '/feedback/list',
        name: 'FeedbackList',
        component: () => import('@/views/table/index'),
        meta: { title: '反馈查询' }
      },

      {
        path: '/feedback/report',
        name: 'FeedbackReport',
        component: () => import('@/views/table/index'),
        meta: { title: '反馈报表' }
      }
    ]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
