<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="filter.orderNo" placeholder="订单编号" style="width: 200px;" class="filter-item" clearable />
      <el-select v-model="filter.customerId" :loading="showCustomer" filterable default-first-option clearable placeholder="客户" @change="queryData">
        <el-option v-for="customer in customerList" :key="customer.id" :value="customer.id" :label="customer.userName" />
      </el-select>
      <!-- <el-input v-model="filter.customerName" placeholder="客户" style="width: 200px;" class="filter-item" clearable /> -->
      <el-input v-model="filter.createName" placeholder="制单人" style="width: 200px;" class="filter-item" clearable />
      <el-select v-model="filter.userType" placeholder="制单人类型" style="width: 200px;" class="filter-item" clearable>
        <el-option label="客户" :value="2" />
        <el-option label="员工" :value="1" />
      </el-select>
      <el-select v-model="filter.orderType" placeholder="销售类型" style="width: 200px;" class="filter-item" clearable>
        <el-option v-for="(orderType,index) in orderTypeList" :key="index" :label="orderType.name" :value="orderType.id" />
      </el-select>
      <el-select v-model="filter.status" placeholder="订单状态" style="width: 200px;" class="filter-item" clearable>
        <el-option v-for="(flow,index) in flowList" :key="index" :label="flow.workName" :value="flow.workStatus" />
      </el-select>
      <el-select v-model="filter.auditType" placeholder="审核类型" style="width: 200px;" class="filter-item" clearable>
        <el-option label="订单审核" :value="1" />
        <el-option label="调价审核" :value="2" />
        <el-option label="数量审核" :value="4" />
        <el-option label="出库审核" :value="3" />
      </el-select>
      <el-select v-model="filter.auditStatus" placeholder="审核状态" style="width: 200px;" class="filter-item" clearable>
        <el-option label="待审核" :value="1" />
        <el-option label="驳回" :value="2" />
        <el-option label="通过" :value="3" />
        <el-option label="拒绝" :value="4" />
      </el-select>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="queryData">查询</el-button>
    </div>

    <el-radio-group v-model="tabPosition" size="mini" @change="switchData">
      <el-radio-button type="info" label="current">待审核</el-radio-button>
      <el-radio-button type="info" label="history">审核历史</el-radio-button>
    </el-radio-group>

    <el-table :key="tableKey" v-loading="listLoading" :data="orderList" border fit highlight-current-row style="width: 100%;">
      <el-table-column type="selection" align="center" width="55" />
      <el-table-column type="index" width="50" align="center" />
      <el-table-column label="审核编号" prop="auditNo" align="center" width="140" />
      <el-table-column label="订单编号" prop="orderNo" align="center" width="140">
        <template slot-scope="scope">
          <router-link v-if=" scope.row.id" :to="{name: 'OrderManageDetail', params: { id: scope.row.id } }">
            <el-button size="mini" type="text">{{ `${scope.row.orderNo}` }}</el-button>
          </router-link>
        </template>
      </el-table-column>
      <el-table-column label="审核类型" prop="auditTypeName" align="center" width="140">
        <template slot-scope="scope">
          <div>
            <el-tag v-if="scope.row.auditType===1 " type="primary" size="mini">{{ scope.row.auditTypeName }}</el-tag>
            <el-tag v-if="scope.row.auditType===2 " type="danger" size="mini">{{ scope.row.auditTypeName }}</el-tag>
            <el-tag v-if="scope.row.auditType===3 " type="success" size="mini">{{ scope.row.auditTypeName }}</el-tag>
            <el-tag v-if="scope.row.auditType===4 " type="warning" size="mini">{{ scope.row.auditTypeName }}</el-tag>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="客户" prop="customerName" align="center" />
      <el-table-column label="销售类型" prop="orderTypeName" align="center" />
      <el-table-column label="制单人类型" prop="userTypeName" align="center" />
      <el-table-column label="制单人" prop="createBy" align="center" />
      <el-table-column label="订单状态" prop="statusName" align="center" />
      <el-table-column label="审核状态" prop="auditStatusName" align="center" />
      <el-table-column label="时间" prop="createTime" align="center" width="120">
        <template slot-scope="scope">
          <div>
            {{ scope.row.updateTime | moment('YYYY-MM-DD') }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作" prop="id" align="center" width="160">
        <template slot-scope="scope">
          <el-button size="mini" @click="detail(scope.row)">查看</el-button>
          <el-button v-if="scope.row.historyFlag === 0" type="primary" size="mini" @click="approval(scope.row)">审核</el-button>
        </template>
      </el-table-column>

    </el-table>
    <div class="block">
      <el-pagination v-show="total>0" :current-page="filter.pageIndex" :page-sizes="[10, 20, 50, 100]" :page-size="filter.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>
  </div>
</template>

<script>
import {
  getOrderApprovals,
  getOrderTypes,
  getOrderFlowNodes
} from '@/api/order'
import { getCustomes } from '@/api/user'
export default {
  data() {
    return {
      listLoading: true,
      tableKey: 0,
      total: 0,
      filter: {
        historyFlag: 0,
        pageIndex: 1,
        pageSize: 10
      },
      tabPosition: 'current',
      orderList: [],
      orderTypeList: [],
      flowList: [],
      dialogFormVisible: false,
      formLabelWidth: '80px',
      customerList: [],
      showCustomer: true
    }
  },
  mounted() {
    this.filter.customerId = null
    this.fetchCustomer()
    this.getOrderList()
    this.getOrderTypeList()
    this.getFlowList()
  },
  methods: {
    // 搜索客户
    fetchCustomer() {
      this.customerList = []
      getCustomes().then(res => {
        this.customerList = res.data
        this.showCustomer = !this.showCustomer
      })
    },
    getOrderList() {
      this.listLoading = true
      const params = {
        ...this.filter
      }
      getOrderApprovals(params).then(res => {
        if (res.code === 10000) {
          this.orderList = res.data
          this.total = res.total
        }
        this.listLoading = false
      })
    },
    getOrderTypeList() {
      getOrderTypes().then(res => {
        if (res.code === 10000) this.orderTypeList = res.data
      })
    },
    getFlowList() {
      getOrderFlowNodes().then(res => {
        if (res.code === 10000) this.flowList = res.data
      })
    },
    detail(obj) {
      this.$router.push({
        name: 'OrderApprovalDetail',
        params: {
          type: 0,
          id: obj.auditId
        }
      })
    },
    approval(obj) {
      this.$router.push({
        name: 'OrderApprovalDetail',
        params: {
          type: 1,
          id: obj.auditId
        }
      })
    },
    queryData() {
      this.filter.pageIndex = 1
      this.getOrderList()
    },
    handleSizeChange(val) {
      this.filter.pageSize = val
      this.getOrderList()
    },
    handleCurrentChange(val) {
      this.filter.pageIndex = val
      this.getOrderList()
    },
    switchData() {
      if (this.tabPosition === 'current') {
        this.filter.historyFlag = 0
      } else if (this.tabPosition === 'history') {
        this.filter.historyFlag = 1
      }
      this.filter.pageIndex = 1
      this.getOrderList()
    }

  }
}
</script>

<style lang="scss" scoped>
.block {
    padding-top: 15px;
}
</style>
