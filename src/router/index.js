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
    redirect: '/order/manage',
    name: 'Order',
    meta: { title: '订单管理', icon: 'order' },
    children: [
      {
        path: '/order/manage',
        name: 'OrderManage',
        component: () => import('@/views/order/manage/index'),
        meta: { title: '订单管理' }
      },
      {
        path: '/order/manage/add',
        name: 'OrderManageAdd',
        component: () => import('@/views/order/manage/add'),
        hidden: true,
        meta: { title: '新建销售单' }
      },
      {
        path: '/order/manage/return/add',
        name: 'OrderManageReturnAdd',
        component: () => import('@/views/order/manage/return/add'),
        hidden: true,
        meta: { title: '新建退筒单' }
      },
      {
        path: '/order/manage/edit/:id',
        name: 'OrderManageEdit',
        component: () => import('@/views/order/manage/edit'),
        hidden: true,
        meta: { title: '编辑销售单' }
      },
      {
        path: '/order/manage/return/edit/:id',
        name: 'OrderManageReturnEdit',
        component: () => import('@/views/order/manage/return/edit'),
        hidden: true,
        meta: { title: '编辑退筒单' }
      },
      {
        path: '/order/manage/detail/:id',
        name: 'OrderManageDetail',
        component: () => import('@/views/order/manage/detail'),
        hidden: true,
        meta: { title: '销售单详情' }
      },
      {
        path: '/order/manage/return/detail/:id',
        name: 'OrderManageReturnDetail',
        component: () => import('@/views/order/manage/return/detail'),
        hidden: true,
        meta: { title: '退筒单详情' }
      },

      {
        path: '/order/approval',
        name: 'OrderApproval',
        component: () => import('@/views/order/approval/index'),
        meta: { title: '订单审核' }
      },
      {
        path: '/order/approval/detail/:type/:id',
        name: 'OrderApprovalDetail',
        component: () => import('@/views/order/approval/detail'),
        hidden: true,
        meta: { title: '审核详情' }
      }
    ]
  },

  {
    path: '/bill',
    component: Layout,
    redirect: '/bill/receipt',
    name: 'Bill',
    meta: { title: '账单管理', icon: 'cashier' },
    alwaysShow: true,
    children: [
      {
        path: '/bill/receipt',
        name: 'BillReceipt',
        component: () => import('@/views/bill/receipt/index'),
        meta: { title: '收款管理' }
      }]
  },

  {
    path: '/product',
    component: Layout,
    redirect: '/product/list',
    name: 'Product',
    meta: { title: '产品仓库', icon: 'product' },
    alwaysShow: true,
    children: [
      {
        path: '/product/list',
        name: 'ProductList',
        component: () => import('@/views/product/index'),
        meta: { title: '产品管理' }
      },
      {
        path: '/product/iostock',
        name: 'IOStock',
        component: () => import('@/views/product/iostock/index'),
        meta: { title: '产品出入库' }
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
    alwaysShow: true,
    children: [
      {
        path: '/feedback/list',
        name: 'FeedbackList',
        component: () => import('@/views/feedback/index'),
        meta: { title: '反馈查询' }
      },
      {
        path: '/feedback/detail/:id',
        name: 'FeedbackDetail',
        component: () => import('@/views/feedback/detail'),
        hidden: true,
        meta: { title: '反馈详情' }
      }
      // {
      //   path: '/feedback/report',
      //   name: 'FeedbackReport',
      //   component: () => import('@/views/feedback/index'),
      //   meta: { title: '反馈报表' }
      // }
    ]
  },
  {
    path: '/system',
    component: Layout,
    redirect: '/system/device',
    name: 'System',
    meta: { title: '系统管理', icon: 'system-management' },
    alwaysShow: true,
    children: [
      {
        path: 'device',
        name: 'Device',
        component: () => import('@/views/system/device/index'),
        meta: { title: '设备维护' }
      }]
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
