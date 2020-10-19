<template>
  <div class="app-container">
    <div class="filter-container">
      <!-- <el-input v-model="filter.productName" placeholder="产品名称" style="width: 200px;" class="filter-item" clearable /> -->
      <el-date-picker v-model="filter.queryDate" clearable class="filter-item" value-format="yyyy-MM-dd" :format="'yyyy-MM-dd'" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" />
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="queryData">查询</el-button>
    </div>

    <el-table v-loading="listLoading" :data="dataList" border style="width: 100%;" size="mini">
      <el-table-column label="退筒时间" prop="refundTime" align="center" width="160" />
      <el-table-column label="订购日期" prop="orderTime" align="center" width="90">
        <template slot-scope="scope">
          <div>
            {{ scope.row.orderTime | moment('YYYY-MM-DD') }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="订单编号" prop="orderNo" align="center" width="120" />
      <el-table-column label="客户" prop="customerName" align="center" />
      <el-table-column label="产品编号/名称" prop="userTypeName" align="center" width="140" show-overflow-tooltip>
        <template slot-scope="scope">
          <div>
            {{ `${ scope.row.productNo} / ${ scope.row.productName}` }}
          </div>
        </template></el-table-column>
      <el-table-column label="要求" prop="requirement" align="center" />
      <el-table-column label="宽度" prop="width" align="center" width="50" />
      <el-table-column label="克重" prop="weight" align="center" width="50" />
      <el-table-column label="个数" prop="goodsNumber" align="center" width="50" />
      <!-- <el-table-column label="已出库" prop="checkOutNumber" align="center" width="60" /> -->
      <el-table-column label="单价" prop="price" align="center" />
      <!-- <el-table-column label="已退筒个数" prop="returnNumber" align="center" /> -->
      <el-table-column label="本次退筒个数" align="center">
        <template slot-scope="{row}">
          <div style="color:#f40;">
            {{ row.returnNumber }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="本次退筒重量(KG)" prop="returnWeight" align="center" width="120" />
      <el-table-column label="本次退筒金额" prop="returnPrice" align="center" />
      <el-table-column label="制单人" prop="createByName" align="center" />
      <el-table-column label="操作" align="center" width="80">
        <template slot-scope="{row}">
          <el-popconfirm
            confirm-button-text="确定"
            confirm-button-type="danger"
            cancel-button-text="取消"
            icon="el-icon-info"
            icon-color="red"
            title="您确定要删除该记录吗?"
            @onConfirm="handleDelete(row)"
          >
            <el-button :key="row.id" slot="reference" type="text" icon="el-icon-delete" size="small">
              删除
            </el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <div class="block">
      <el-pagination v-show="total>0" :current-page="filter.pageIndex" :page-sizes="[15, 30, 50, 100]" :page-size="filter.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>
  </div>
</template>

<script>
import { queryList, cancelReturnOrder } from '@/api/refund'
export default {
  data() {
    return {
      filter: {
        queryDate: [],
        pageIndex: 1,
        pageSize: 15
      },
      listLoading: false,
      dataList: [],
      total: 0
    }
  },
  mounted() {
    this.getDataList()
  },
  methods: {
    getDataList() {
      this.listLoading = !this.listLoading
      queryList(this.filter).then(res => {
        this.dataList = res.data
        this.total = res.total
        this.listLoading = !this.listLoading
      }).catch(err => {
        this.$message({
          message: err.message,
          type: 'error'
        })
        this.listLoading = !this.listLoading
      })
    },
    handleDelete(obj) {
      cancelReturnOrder(obj.id).then(res => {
        this.$message({
          type: 'success',
          message: res.message
        })
        this.getDataList()
      }).catch(err => {
        this.$message({
          type: 'error',
          message: err.message
        })
      })
    },
    queryData() {
      this.filter.pageIndex = 1
      this.getDataList()
    },
    handleSizeChange(val) {
      this.filter.pageSize = val
      this.getDataList()
    },
    handleCurrentChange(val) {
      this.filter.pageIndex = val
      this.getDataList()
    }
  }
}
</script>

<style lang="scss">

</style>
