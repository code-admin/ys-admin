<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="filter.orderNo" placeholder="订单编号" style="width: 200px;" class="filter-item" clearable />
      <el-input v-model="filter.customerName" placeholder="下单人" style="width: 200px;" class="filter-item" clearable />
      <el-input v-model="filter.createName" placeholder="制单人" style="width: 200px;" class="filter-item" clearable />
      <el-select v-model="filter.userType" placeholder="制单人类型" style="width: 200px;" class="filter-item" clearable>
        <el-option label="客户" :value="2" />
        <el-option label="员工" :value="1" />
      </el-select>
      <el-select v-model="filter.orderType" placeholder="销售类型" style="width: 200px;" class="filter-item" clearable>
        <el-option v-for="(orderType,index) in orderTypeList" :key="index" :label="orderType.name" :value="orderType.id" />
      </el-select>
      <el-select v-model="filter.status" placeholder="订单状态" style="width: 200px;" class="filter-item" clearable>
        <el-option v-for="(flow,index) in flowList" :key="index" :label="flow.workName" :value="flow.id" />
      </el-select>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="getOrderList">查询</el-button>
      <el-button class="filter-item" icon="el-icon-plus" @click="addInit">创建订单</el-button>
    </div>

    <el-table :key="tableKey" v-loading="listLoading" :data="orderList" border fit highlight-current-row style="width: 100%;">
      <el-table-column type="selection" align="center" width="55" />
      <el-table-column type="index" width="50" align="center" />
      <el-table-column label="订单编号" prop="orderNo" align="center" sortable="custom" />
      <el-table-column label="下单人" prop="customerName" align="center" />
      <el-table-column label="销售类型" prop="orderTypeName" align="center" />
      <el-table-column label="制单人类型" prop="userTypeName" align="center" />
      <el-table-column label="制单人" prop="createBy" align="center" />
      <el-table-column label="总价" prop="totalPrice" align="center" />
      <el-table-column label="状态" prop="statusName" align="center" />
      <el-table-column label="下单时间" prop="orderTime" align="center" sortable="custom" width="160px" />

      <el-table-column label="操作" prop="id" sortable="custom" align="center" width="240">
        <template slot-scope="scope">
          <el-button size="mini" @click="detail(scope.row)">查看</el-button>
          <el-button type="primary" size="mini" @click="detail(scope.row)">出库</el-button>
          <el-button type="danger" size="mini" @click="detail(scope.row)">关闭</el-button>
        </template>
      </el-table-column>

    </el-table>
    <div class="block">
      <el-pagination v-show="total>0" :current-page="filter.pageIndex" :page-sizes="[10, 20, 50, 100]" :page-size="filter.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>
  </div>
</template>

<script>
import { getOrders, getOrderTypes, getOrderFlowNodes } from '@/api/order'
export default {
  data() {
    return {
      listLoading: true,
      tableKey: 0,
      total: 0,
      filter: {
        pageIndex: 1,
        pageSize: 10
      },
      orderList: [],
      orderTypeList: [],
      flowList: [],
      dialogFormVisible: false,
      formLabelWidth: '80px'
    }
  },
  mounted() {
    this.getOrderList()
    this.getOrderTypeList()
    this.getFlowList()
  },
  methods: {
    getOrderList() {
      this.listLoading = true
      const params = {
        ...this.filter
      }
      getOrders(params).then(res => {
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
    addInit() {
      this.$router.push({ name: 'OrderManageAdd' })
    },
    detail() {},
    handleSizeChange(val) {
      this.filter.pageSize = val
      this.getOrderList()
    },
    handleCurrentChange(val) {
      this.filter.pageIndex = val
      this.getOrderList()
    }

  }
}
</script>

<style lang="scss" scoped>
.block{
  padding-top: 15px;
}
</style>
