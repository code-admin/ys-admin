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
      <el-date-picker v-model="filter.queryDate" clearable class="filter-item" value-format="yyyy-MM-dd" :format="'yyyy-MM-dd'" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" />
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="queryData">查询</el-button>
      <el-button class="filter-item" icon="el-icon-download" @click="exportData">导出</el-button>
    </div>
    <div class="total-data">
      <el-row :gutter="5">
        <el-col :span="4">
          <div>
            <span>
              总个数:
            </span>
            <span>
              {{ summary.totalProductNumber }}
            </span>
          </div>
        </el-col>
        <el-col :span="4">
          <div>
            <span>
              总条数:
            </span>
            <span>
              {{ summary.totalGoodsNumber }}
            </span>
          </div>
        </el-col>
        <el-col :span="4">
          <div>
            <span>
              总重量:
            </span>
            <span>
              {{ summary.totalWeight }}
            </span>
          </div>
        </el-col>
        <el-col :span="4">
          <div>
            <span>
              总金额:
            </span>
            <span>
              {{ summary.totalBillAmount }}
            </span>
          </div>
        </el-col>
      </el-row>
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
      <el-table-column label="时间" prop="createTime" align="center" width="120">
        <template slot-scope="scope">
          <i class="el-icon-time" /> {{ scope.row.createTime | moment('YYYY-MM-DD') }}
        </template>
      </el-table-column>
      <el-table-column label="客户" prop="userName" align="center" width="160" />
      <el-table-column label="单据类型" prop="feeTypeName" align="center" width="100" />

      <el-table-column label="品名" prop="productName" align="center" />
      <el-table-column label="要求" prop="requirement" align="center" width="130" show-overflow-tooltip />
      <el-table-column label="宽度(cm)" prop="width" align="center" />
      <el-table-column label="克重(g)" prop="weight" align="center" />
      <el-table-column label="长(cm)" prop="goodsLength" align="center" />
      <el-table-column label="个" prop="goodsNumber" align="center" />
      <el-table-column label="条数" prop="productNumber" align="center" />
      <el-table-column label="单价(元)" prop="price" align="center" />
      <el-table-column label="重量" prop="netWeight" align="center" />
      <!-- <el-table-column label="重量" prop="" align="center" /> -->
      <el-table-column label="金额(元)" prop="amount" align="center">
        <template slot-scope="scope">
          <div v-if="scope.row.feeType === 4" class="decrease">
            -{{ scope.row.amount }}
          </div>
          <div v-else-if="scope.row.amount" :class=" scope.row.amount > 0 ? 'increase' : 'decrease'">
            {{ scope.row.amount }}
          </div>
        </template>
      </el-table-column>
      <!-- <el-table-column label="制单人" prop="createBy" align="center" /> -->
      <el-table-column label="备注" prop="remark" align="center" show-overflow-tooltip />

    </el-table>
    <div class="block">
      <el-pagination v-show="total>0" :current-page="filter.pageIndex" :page-sizes="[10, 20, 50, 100]" :page-size="filter.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>
  </div>
</template>

<script>
import {
  getOrderBillSummaryList,
  exportBillDetail
} from '@/api/bill'
export default {
  data() {
    return {
      listLoading: true,
      dialogFormVisible: false,
      total: 0,
      filter: {
        queryDate: [],
        pageIndex: 1,
        pageSize: 10
      },
      billList: [],
      summary: {}
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
          this.summary = res.summary
          this.total = res.total
        }
        this.listLoading = false
      })
    },
    // 导出
    exportData() {
      const loading = this.$loading({
        lock: true,
        text: '正在拼命整理数据中……',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      exportBillDetail(this.filter).then(res => {
        if (res.code === 10000) {
          loading.close()
          window.open(res.data)
          return
        }
      }).catch(err => {
        loading.close()
        this.$message({
          message: err.message,
          type: 'error'
        })
      })
    },
    // 查询
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
.block {
    padding-top: 15px;
}

.increase {
    color: #67C23A;
}

.decrease {
    color: #f40;
}

.total-data {
    line-height: 38px;
    font-size: 14px;
    color: #909399;
}
</style>
