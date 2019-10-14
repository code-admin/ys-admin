<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="filter.orderNo" placeholder="订单编号" style="width: 200px;" class="filter-item" clearable />
      <el-input v-model="filter.customerName" placeholder="客户名称" style="width: 200px;" class="filter-item" clearable />
      <!-- <el-input v-model="filter.createName" placeholder="制单人" style="width: 200px;" class="filter-item" clearable /> -->
      <el-select v-model="filter.feeType" placeholder="收款类型" style="width: 200px;" class="filter-item" clearable>
        <el-option label="销售单" :value="3" />
        <el-option label="退筒单" :value="4" />
        <el-option label="收袋款" :value="1" />
        <el-option label="其他款" :value="2" />
      </el-select>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="queryData">查询</el-button>
    </div>

    <el-table v-loading="listLoading" :data="billList" border>
      <el-table-column type="index" width="50" align="center" />
      <el-table-column label="流水号" prop="billNo" align="center" width="140" />
      <el-table-column label="订单号" prop="orderNo" align="center" width="120">
        <template slot-scope="scope">
          <router-link v-if=" scope.row.orderId" :to="{name: scope.row.makingType === 1 ? 'OrderManageDetail' : 'OrderManageReturnDetail', params: { id: scope.row.orderId } }">
            <el-button size="mini" type="text">{{ `${scope.row.orderNo}` }}</el-button>
          </router-link>
        </template>
      </el-table-column>
      <el-table-column label="客户" prop="userName" align="center" width="160" />
      <el-table-column label="单据类型" prop="feeTypeName" align="center" width="100" />
      <el-table-column label="金额(元)" prop="amount" align="center" width="160">
        <template slot-scope="scope">
          <div v-if="scope.row.amount" :class=" scope.row.amount > 0 ? 'increase' : 'decrease'">
            <span v-if="scope.row.amount > 0"> + </span> {{ scope.row.amount }} ¥
          </div>
        </template>
      </el-table-column>
      <!-- <el-table-column label="制单人" prop="createBy" align="center" /> -->
      <el-table-column label="备注" prop="remark" align="center" show-overflow-tooltip />
      <el-table-column label="时间" prop="createTime" align="center" width="120">
        <template slot-scope="scope">
          <i class="el-icon-time" /> {{ scope.row.createTime | moment('YYYY-MM-DD') }}
        </template>
      </el-table-column>
    </el-table>
    <div class="block">
      <el-pagination v-show="total>0" :current-page="filter.pageIndex" :page-sizes="[10, 20, 50, 100]" :page-size="filter.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>
  </div>
</template>

<script>
import { getOrderBillSummaryList } from '@/api/bill'
export default {
  data() {
    return {
      listLoading: true,
      dialogFormVisible: false,
      total: 0,
      filter: {
        pageIndex: 1,
        pageSize: 10
      },
      billList: []
    }
  },
  mounted() {
    this.getBillDetailList()
  },
  methods: {
    getBillDetailList() {
      this.listLoading = true
      getOrderBillSummaryList(this.filter).then(res => {
        if (res.code === 10000) {
          this.billList = res.data
          this.total = res.total
        }
        this.listLoading = false
      })
    },
    queryData() {
      this.filter.pageIndex = 1
      this.getBillDetailList()
    },
    handleSizeChange(val) {
      this.filter.pageSize = val
      this.getBillDetailList()
    },
    handleCurrentChange(val) {
      this.filter.pageIndex = val
      this.getBillDetailList()
    }

  }
}
</script>

<style lang="scss" scoped>
.block{
  padding-top: 15px;
}
.increase{
  color: #67C23A;
}
.decrease{
  color: #f40;
}

</style>
