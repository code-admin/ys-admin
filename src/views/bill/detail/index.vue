<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="filter.orderNo" placeholder="订单编号" style="width: 200px;" class="filter-item" clearable />
      <el-input v-model="filter.customerName" placeholder="客户名称" style="width: 200px;" class="filter-item" clearable />
      <el-input v-model="filter.createName" placeholder="制单人" style="width: 200px;" class="filter-item" clearable />
      <el-select v-model="filter.orderType" placeholder="收款类型" style="width: 200px;" class="filter-item" clearable>
        <el-option label="收袋款" :value="1" />
        <el-option label="其他款" :value="2" />
      </el-select>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="queryData">查询</el-button>
    </div>

    <el-table v-loading="listLoading" :data="billList" border>
      <el-table-column type="index" width="50" align="center" />
      <el-table-column label="流水号" prop="billNo" align="center" />
      <el-table-column label="订单号" prop="orderNo" align="center" />
      <el-table-column label="客户" prop="userName" align="center" />
      <el-table-column label="单据类型" prop="feeTypeName" align="center" />
      <el-table-column label="金额(元)" prop="amount" align="center">
        <template slot-scope="scope">
          <div v-if="scope.row.amount" style="color:#f40;">
            {{ scope.row.amount }} ¥
          </div>
        </template>
      </el-table-column>
      <el-table-column label="制单人" prop="createBy" align="center" />
      <el-table-column label="备注" prop="remark" align="center" show-overflow-tooltip />
      <el-table-column label="时间" prop="createTime" align="center" width="180">
        <template slot-scope="scope">
          <i class="el-icon-time" /> {{ scope.row.createTime }}
        </template>
      </el-table-column>
    </el-table>
    <div class="block">
      <el-pagination v-show="total>0" :current-page="filter.pageIndex" :page-sizes="[10, 20, 50, 100]" :page-size="filter.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>
  </div>
</template>

<script>
import { getOrderBillList, submitOrderBill } from '@/api/bill'
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
    this.getBillList()
  },
  methods: {
    getBillList() {
      this.listLoading = true
      getOrderBillList(this.filter).then(res => {
        if (res.code === 10000) {
          this.billList = res.data
          this.total = res.total
        }
        this.listLoading = false
      })
    },
    editInit() {
      this.bill = {}
      this.dialogFormVisible = !this.dialogFormVisible
    },
    saveBill() {
      submitOrderBill(this.bill).then(res => {
        this.dialogFormVisible = !this.dialogFormVisible
        if (res.code === 10000) {
          this.$message({ message: '保存成功！', type: 'success' })
          this.getBillList()
        }
      })
    },
    queryData() {
      this.filter.pageIndex = 1
      this.getBillList()
    },
    handleSizeChange(val) {
      this.filter.pageSize = val
      this.getBillList()
    },
    handleCurrentChange(val) {
      this.filter.pageIndex = val
      this.getBillList()
    }

  }
}
</script>

<style lang="scss" scoped>
.block{
  padding-top: 15px;
}
</style>
