<template>
  <div class="app-container">
    <div class="filter-container">
      <el-date-picker v-model="filter.reportTime" type="date" style="width: 200px;" value-format="yyyy-MM-dd" format="yyyy-MM-dd" placeholder="选择收款日期" />
      <el-input v-model="filter.productNo" placeholder="产品编号" style="width: 200px;" class="filter-item" clearable />
      <el-input v-model="filter.productName" placeholder="产品名称" style="width: 200px;" class="filter-item" clearable />
      <el-input v-model="filter.requirement" placeholder="要求" style="width: 200px;" class="filter-item" clearable />
      <el-input v-model="filter.width" placeholder="宽度" style="width: 200px;" class="filter-item" clearable />
      <el-input v-model="filter.weight" placeholder="克重" style="width: 200px;" class="filter-item" clearable />
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="queryData">查询</el-button>
      <el-button class="filter-item" icon="el-icon-download" @click="exportData">导出</el-button>
    </div>

    <el-table :key="tableKey" v-loading="listLoading" :data="productList" border fit highlight-current-row style="width: 100%;">
      <el-table-column type="index" width="50" align="center" />
      <el-table-column label="日期" prop="reportTime" align="center" show-overflow-tooltip width="120" />
      <el-table-column label="产品编号" prop="productNo" align="center" show-overflow-tooltip width="120" />
      <el-table-column label="产品名称" prop="name" align="center" show-overflow-tooltip width="150">
        <template slot-scope="scope">
          <el-tag size="mini" type="info" effect="plain">{{ scope.row.name }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="要求" prop="requirement" align="center" show-overflow-tooltip width="120" />
      <el-table-column label="宽度(CM)" prop="width" align="center" width="60" />
      <el-table-column label="克重(G)" prop="weight" align="center" width="60" />
      <el-table-column label="米数(M)" prop="length" align="center" />
      <el-table-column label="重量(KG)" prop="netWeight" align="center" />
      <el-table-column label="库存(个)" prop="stockNumber" align="center" />
      <el-table-column label="价格" prop="price" align="center">
        <template slot-scope="scope">
          <div v-if="scope.row.price" style="color:#f40;">
            {{ scope.row.price }} ¥
          </div>
        </template>
      </el-table-column>
      <el-table-column label="今日入库" prop="todayStockNumber" align="center" />
      <el-table-column label="订单数量(未完成订单数)" prop="todayStockNumber" align="center" width="90">
        <template slot-scope="scope">
          <div>
            {{ scope.row.totalOrders }}{{ scope.row.unfinishedOrders ? `( ${scope.row.unfinishedOrders} )` : '' }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="今日出库" prop="todaySaledNumber" align="center" />
      <el-table-column label="预售" prop="preSaledNumber" align="center" />
      <el-table-column label="在产数" prop="productingNumber" align="center" />
    </el-table>
    <div class="block">
      <el-pagination v-show="total>0" :current-page="filter.pageIndex" :page-sizes="[10, 20, 50, 100]" :page-size="filter.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>
  </div>
</template>

<script>
import {
  getProductReportList,
  exportProductReport
} from '@/api/product'
export default {
  data() {
    const date = new Date()
    return {
      listLoading: true,
      tableKey: 0,
      total: 0,
      filter: {
        reportTime: `${date.getFullYear()}-${(date.getMonth() + 1) < 10 ? '0' : ''}${date.getMonth() + 1}-${date.getDate() < 10 ? '0' : ''}${date.getDate()}`,
        pageIndex: 1,
        pageSize: 10
      },
      productList: [],
      product: {}
    }
  },

  mounted() {
    this.getProductList()
  },

  methods: {
    getProductList() {
      this.listLoading = true
      const params = {
        ...this.filter
      }
      getProductReportList(params).then(res => {
        if (res.code === 10000) {
          this.productList = res.data
          this.total = res.total
        }
        this.listLoading = false
      })
    },
    exportData() {
      exportProductReport(this.filter).then(res => {
        if (res.code === 10000) {
          window.open(res.data)
          return
        }
      }).catch(err => {
        this.$message({
          message: err.message,
          type: 'error'
        })
      })
    },
    queryData() {
      this.filter.pageIndex = 1
      this.getProductList()
    },
    handleSizeChange(val) {
      this.filter.pageSize = val
      this.getProductList()
    },
    handleCurrentChange(val) {
      this.filter.pageIndex = val
      this.getProductList()
    }
  }
}
</script>

<style lang="scss" scoped>
.block {
    padding-top: 15px;
}

.demo-drawer__content {
    padding: 20px;
    height: calc(100vh - 60px);
    overflow: scroll;
}
</style>
