import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

export const constantRoutes = [{
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
    meta: {
      title: '管理首页',
      icon: 'dashboard'
    }
  }]
},

{
  path: '/order',
  component: Layout,
  redirect: '/order/manage',
  name: 'Order',
  meta: {
    title: '订单管理',
    icon: 'order'
  },
  children: [{
    path: '/order/manage',
    name: 'OrderManage',
    component: () => import('@/views/order/manage/index'),
    meta: {
      title: '订单管理'
    }
  },
  {
    path: '/order/manage/add',
    name: 'OrderManageAdd',
    component: () => import('@/views/order/manage/add'),
    hidden: true,
    meta: {
      title: '新建销售单'
    }
  },
  {
    path: '/order/manage/return/add',
    name: 'OrderManageReturnAdd',
    component: () => import('@/views/order/manage/return/add'),
    hidden: true,
    meta: {
      title: '新建退货单'
    }
  },
  {
    path: '/order/manage/edit/:id',
    name: 'OrderManageEdit',
    component: () => import('@/views/order/manage/edit'),
    hidden: true,
    meta: {
      title: '编辑销售单'
    }
  },
  {
    path: '/order/manage/return/edit/:id',
    name: 'OrderManageReturnEdit',
    component: () => import('@/views/order/manage/return/edit'),
    hidden: true,
    meta: {
      title: '编辑退货单'
    }
  },
  {
    path: '/order/manage/detail/:id',
    name: 'OrderManageDetail',
    component: () => import('@/views/order/manage/detail'),
    hidden: true,
    meta: {
      title: '销售单详情'
    }
  },
  {
    path: '/order/manage/return/detail/:id',
    name: 'OrderManageReturnDetail',
    component: () => import('@/views/order/manage/return/detail'),
    hidden: true,
    meta: {
      title: '退货单详情'
    }
  },
  {
    path: '/order/printing/extracted/:id',
    name: 'ExtractedPrint',
    component: () => import('@/views/order/manage/extractedPrint'),
    hidden: true,
    meta: {
      title: '打印提货单'
    }
  },
  {
    path: '/order/printing/checkout/:id',
    name: 'OrderPrinting',
    component: () => import('@/views/order/manage/printing'),
    hidden: true,
    meta: {
      title: '打印预览'
    }
  },
  {
    path: '/order/approval',
    name: 'OrderApproval',
    component: () => import('@/views/order/approval/index'),
    meta: {
      title: '订单审核'
    }
  },
  {
    path: '/order/approval/detail/:type/:id',
    name: 'OrderApprovalDetail',
    component: () => import('@/views/order/approval/detail'),
    hidden: true,
    meta: {
      title: '审核详情'
    }
  },
  {
    path: '/order/detail',
    name: 'OrderDetail',
    component: () => import('@/views/order/detail/index'),
    meta: {
      title: '订单明细'
    }
  }
  ]
},
{
  path: '/refund',
  component: Layout,
  redirect: '/refund',
  name: 'Order',
  meta: {
    title: '退筒管理',
    icon: 'tuitong'
  },
  alwaysShow: true,
  children: [{
    path: '/refund',
    name: 'OrderRefund',
    component: () => import('@/views/refund/index'),
    meta: {
      title: '退筒管理'
    }
  },
  {
    path: '/refund/add',
    name: 'OrderRefundAdd',
    component: () => import('@/views/refund/Add'),
    meta: {
      title: '添加退筒'
    },
    hidden: true
  },
  {
    path: '/refund/batch/:number/:weight',
    name: 'OrderRefundBatch',
    component: () => import('@/views/refund/Batch'),
    meta: {
      title: '添加退筒'
    },
    hidden: true
  },
  {
    path: '/refund/history',
    name: 'OrderRefundHistory',
    component: () => import('@/views/refund/History/index'),
    meta: {
      title: '退筒记录'
    }
  },
  {
    path: '/refund/detail/:id',
    name: 'OrderRefundDetail',
    component: () => import('@/views/refund/Detail/index'),
    meta: {
      title: '退筒明细'
    },
    hidden: true
  },
  {
    path: '/refund/history/list',
    name: 'OrderRefundHistoryList',
    component: () => import('@/views/refund/History/List'),
    meta: {
      title: '退筒明细'
    }
  }
  ]
},
{
  path: '/print',
  component: Layout,
  redirect: '/print/history',
  name: 'Print',
  meta: {
    title: '打印管理',
    icon: 'printer'
  },
  alwaysShow: true,
  children: [{
    path: '/print/history',
    name: 'PrintHistory',
    component: () => import('@/views/print/index.vue'),
    meta: {
      title: '打印历史'
    }
  }]
},
{
  path: '/bill',
  component: Layout,
  redirect: '/bill/receipt',
  name: 'Bill',
  meta: {
    title: '账单管理',
    icon: 'cashier'
  },
  alwaysShow: true,
  children: [{
    path: '/bill/receipt',
    name: 'BillReceipt',
    component: () => import('@/views/bill/receipt/index'),
    meta: {
      title: '收款管理'
    }
  },
  {
    path: '/bill/receipt/add',
    name: 'BillReceiptAdd',
    component: () => import('@/views/bill/receipt/Add'),
    meta: {
      title: '新增收款'
    },
    hidden: true
  },
  {
    path: '/bill/receipt/addReturn',
    name: 'BillReceiptAddReturn',
    component: () => import('@/views/bill/receipt/AddReturn'),
    meta: {
      title: '添加退筒单'
    },
    hidden: true
  },
  {
    path: '/bill/detail',
    name: 'BillDetail',
    component: () => import('@/views/bill/detail/index'),
    meta: {
      title: '账目明细'
    }
  },
  {
    path: '/bill/total',
    name: 'BillTotal',
    component: () => import('@/views/bill/total/index'),
    meta: {
      title: '账目汇总'
    }
  }
  ]
},
{
  path: '/analysis',
  component: Layout,
  redirect: '/analysis/produce',
  name: 'Analysis',
  meta: {
    title: '数据分析',
    icon: 'analysis'
  },
  alwaysShow: true,
  children: [{
    path: '/analysis/produce',
    name: 'AnalysisProduce',
    component: () => import('@/views/analysis/produce/index'),
    meta: {
      title: '生产数据'
    }
  },
  {
    path: '/analysis/month',
    name: 'AnalysisMonth',
    component: () => import('@/views/analysis/month/index'),
    meta: {
      title: '月汇产总'
    }
  },
  {
    path: '/analysis/day',
    name: 'AnalysisDay',
    component: () => import('@/views/analysis/day/index'),
    meta: {
      title: '日汇产总'
    }
  },
  {
    path: '/analysis/year',
    name: 'AnalysisYear',
    component: () => import('@/views/analysis/year/index'),
    meta: {
      title: '年汇产总'
    }
  },
  {
    path: '/analysis/passrate',
    name: 'AnalysisPassrate',
    component: () => import('@/views/analysis/passrate/index'),
    meta: {
      title: '员工合格率'
    }
  }
  ]
},

{
  path: '/product',
  component: Layout,
  redirect: '/product/list',
  name: 'Product',
  meta: {
    title: '产品仓库',
    icon: 'product'
  },
  alwaysShow: true,
  children: [{
    path: '/product/list',
    name: 'ProductList',
    component: () => import('@/views/product/index'),
    meta: {
      title: '产品管理'
    }
  },
  {
    path: '/product/class',
    name: 'ProductClass',
    component: () => import('@/views/product/class/index'),
    meta: {
      title: '品类管理'
    }
  },
  {
    path: '/product/adjusted',
    name: 'ProductAdjusted',
    component: () => import('@/views/product/adjusted/index'),
    meta: {
      title: '调价规则'
    }
  },
  {
    path: '/product/iostock',
    name: 'IOStock',
    component: () => import('@/views/product/iostock/index'),
    meta: {
      title: '产品出入库'
    }
  },
  {
    path: '/product/report',
    name: 'ProductReport',
    component: () => import('@/views/product/report/index'),
    meta: {
      title: '产品报表'
    }
  }
  ]
},

{
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
    component: () => import('@/views/produce/log/index'),
    meta: {
      title: '生产日志'
    }
  },
  {
    path: '/produce/device',
    name: 'ProduceDevice',
    component: () => import('@/views/produce/device/index'),
    meta: {
      title: '设备绑定'
    }
  },
  {
    path: '/produce/log/import',
    name: 'ProduceLogImport',
    component: () => import('@/views/produce/log/ImportData'),
    hidden: true,
    meta: {
      title: '导入数据'
    }
  },
  {
    path: '/produce/log/detail/:id/:reportTime',
    name: 'ProduceLogDetail',
    component: () => import('@/views/produce/log/Detail'),
    hidden: true,
    meta: {
      title: '数据详情'
    }
  }
  ]
},

{
  path: '/user',
  component: Layout,
  redirect: '/user/employee',
  name: 'User',
  meta: {
    title: '用户管理',
    icon: 'user'
  },
  children: [{
    path: '/user/employee',
    name: 'UserEmployee',
    component: () => import('@/views/user/employee/index'),
    meta: {
      title: '员工管理'
    }
  },

  {
    path: '/user/customer',
    name: 'UserCustomer',
    component: () => import('@/views/user/customer/index'),
    meta: {
      title: '客户管理'
    }
  }
  ]
},
{
  path: '/department',
  component: Layout,
  redirect: '/department/list',
  name: 'Department',
  meta: {
    title: '部门管理',
    icon: 'department'
  },
  children: [{
    path: '/department/list',
    name: 'DepartmentList',
    component: () => import('@/views/department/department/index.vue'),
    meta: {
      title: '部门设置'
    }
  },
  {
    path: '/job/list',
    name: 'JobList',
    component: () => import('@/views/department/job/index.vue'),
    meta: {
      title: '职位设置'
    }
  }
  ]
},
{
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
    component: () => import('@/views/feedback/index'),
    meta: {
      title: '反馈查询'
    }
  },
  {
    path: '/feedback/detail/:id',
    name: 'FeedbackDetail',
    component: () => import('@/views/feedback/detail'),
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
},
{
  path: '/system',
  component: Layout,
  redirect: '/system/device',
  name: 'System',
  meta: {
    title: '系统管理',
    icon: 'system-management'
  },
  alwaysShow: true,
  children: [{
    path: 'device',
    name: 'Device',
    component: () => import('@/views/system/device/index'),
    meta: {
      title: '设备维护'
    }
  }]
},

{
  path: '/print/history/view/:id',
  name: 'PrintHistoryView',
  component: () => import('@/views/print/PrintView.vue'),
  hidden: true,
  meta: {
    title: '提货单'
  }
},
{
  path: '/print/history/view/2/:id',
  name: 'PrintHistoryView2',
  component: () => import('@/views/print/PrintView2.vue'),
  hidden: true,
  meta: {
    title: '结算单'
  }
},
{
  path: '/print/history/view/3/:id',
  name: 'PrintHistoryView3',
  component: () => import('@/views/print/PrintView3.vue'),
  hidden: true,
  meta: {
    title: '结算单'
  }
},
{
  path: '/print/history/view/4/:id',
  name: 'PrintHistoryView4',
  component: () => import('@/views/print/PrintView4.vue'),
  hidden: true,
  meta: {
    title: '结算单'
  }
},
{
  path: '/print/history/view/5/:id',
  name: 'PrintHistoryView5',
  component: () => import('@/views/print/PrintView5.vue'),
  hidden: true,
  meta: {
    title: '收款单'
  }
},

// 404 page must be placed at the end !!!
{
  path: '*',
  redirect: '/404',
  hidden: true
}
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({
    y: 0
  }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
