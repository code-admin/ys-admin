<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="filter.orderNo" placeholder="订单编号" style="width: 200px;" class="filter-item" clearable />
      <el-input v-model="filter.customerName" placeholder="客户" style="width: 200px;" class="filter-item" clearable />
      <el-date-picker v-model="filter.queryDate" clearable class="filter-item" value-format="yyyy-MM-dd" :format="'yyyy-MM-dd'" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" />
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="queryData">查询</el-button>
    </div>

    <el-table :key="tableKey" v-loading="listLoading" :data="orderList" border fit highlight-current-row style="width: 100%;">
      <!-- <el-table-column type="selection" align="center" width="55" /> -->
      <el-table-column type="index" width="50" align="center" />
      <el-table-column label="日期" prop="orderTime" align="center" width="120">
        <template slot-scope="scope">
          <div>
            {{ scope.row.orderTime | moment('YYYY-MM-DD') }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="订单编号" prop="orderNo" align="center" width="140" />
      <el-table-column label="客户" prop="customerName" align="center" />
      <el-table-column label="产品编号/名称" prop="userTypeName" align="center" width="180" show-overflow-tooltip>
        <template slot-scope="scope">
          <div>
            {{ `${ scope.row.productNo} / ${ scope.row.productName}` }}
          </div>
        </template></el-table-column>
      <el-table-column label="要求" prop="requirement" align="center" />
      <el-table-column label="宽度" prop="productWidth" align="center" />
      <el-table-column label="克重" prop="productWeight" align="center" />
      <el-table-column label="个数" prop="goodsNumber" align="center" />
      <el-table-column label="已出库" prop="checkOutNumber" align="center" />
      <el-table-column label="单价" prop="price" align="center" />
      <el-table-column label="备注" prop="remark" align="center" />
    </el-table>
    <div class="block">
      <el-pagination v-show="total>0" :current-page="filter.pageIndex" :page-sizes="[10, 20, 50, 100]" :page-size="filter.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>
  </div>
</template>

<script>
import {
  getOrderDetailList
} from '@/api/order'
export default {
  data() {
    return {
      listLoading: true,
      tableKey: 0,
      total: 0,
      filter: {
        queryDate: [],
        pageIndex: 1,
        pageSize: 10
      },
      orderList: []
    }
  },
  mounted() {
    this.getOrderList()
  },
  methods: {
    getOrderList() {
      this.listLoading = true
      const params = {
        ...this.filter
      }
      getOrderDetailList(params).then(res => {
        if (res.code === 10000) {
          this.orderList = res.data
          this.total = res.total
        }
        this.listLoading = false
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
    }
  }
}
</script>

<style lang="scss" scoped>
.block {
    padding-top: 15px;
}
</style>
