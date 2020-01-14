<template>
  <div class="app-container">
    <div class="filter-container">
      <!-- <el-input v-model="filter.customerName" placeholder="客户名称" style="width: 200px;" class="filter-item" clearable /> -->
      <el-select v-model="filter.userId" filterable placeholder="请选择付款人" style="width: 200px;" class="filter-item" clearable>
        <el-option v-for="user in customeList" :key="user.loginName" :label="user.userName" :value="user.id" />
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
              销售重量:
            </span>
            <span>
              {{ summary.totalWeight }}
            </span>
          </div>
        </el-col>
        <el-col :span="4">
          <div>
            <span>
              欠款余额:
            </span>
            <span>
              {{ summary.totalDebtAmount }}
            </span>
          </div>
        </el-col>
        <el-col :span="4">
          <div>
            <span>
              上年结余:
            </span>
            <span>
              {{ summary.totalLastYearBalanceAmount }}
            </span>
          </div>
        </el-col>
        <el-col :span="4">
          <div>
            <span>
              销售金额:
            </span>
            <span>
              {{ summary.totalAmount }}
            </span>
          </div>
        </el-col>
        <el-col :span="4">
          <div>
            <span>
              收款金额:
            </span>
            <span>
              {{ summary.totalReceivablesAmount }}
            </span>
          </div>
        </el-col>
        <el-col :span="4">
          <div>
            <span>
              退筒金额:
            </span>
            <span>
              {{ summary.totalReturnAmount }}
            </span>
          </div>
        </el-col>
        <el-col :span="4">
          <div>
            <span>
              销售个数:
            </span>
            <span>
              {{ summary.totalNumber }}
            </span>
          </div>
        </el-col>
        <el-col :span="4">
          <div>
            <span>
              退筒个数:
            </span>
            <span>
              {{ summary.totalReturnNumber }}
            </span>
          </div>
        </el-col>
        <el-col :span="4">
          <div>
            <span>
              差值:
            </span>
            <span>
              {{ summary.totalDifferentAmount }}
            </span>
          </div>
        </el-col>
        <el-col :span="4">
          <div>
            <span>
              其他款:
            </span>
            <span>
              {{ summary.totalOtherAmount }}
            </span>
          </div>
        </el-col>
        <el-col :span="4">
          <div>
            <span>
              余额:
            </span>
            <span>
              {{ summary.totalBalanceAmount }}
            </span>
          </div>
        </el-col>
      </el-row>
    </div>
    <el-table v-loading="listLoading" :data="billList" border show-summary>
      <el-table-column label="客户名称" prop="customerName" align="center" width="120" />
      <el-table-column label="销售重量(KG)" prop="totalWeight" align="center" width="150" />
      <el-table-column label="欠款余额" prop="debtAmount" align="center" />
      <el-table-column label="上年结余" prop="lastYearBalanceAmount" align="center" />
      <el-table-column label="销售金额" prop="totalAmount" align="center">
        <template slot-scope="scope">
          <div v-if="scope.row.totalAmount" :class=" scope.row.totalAmount > 0 ? 'increase' : 'decrease'">
            {{ scope.row.totalAmount }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="收款金额" prop="receivablesAmount" align="center">
        <template slot-scope="scope">
          <div v-if="scope.row.receivablesAmount" :class=" scope.row.receivablesAmount > 0 ? 'increase' : 'decrease'">
            <span v-if="scope.row.receivablesAmount > 0"> + </span> {{ scope.row.receivablesAmount }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="退筒金额" prop="returnAmount" align="center">
        <template slot-scope="scope">
          <div>
            <span v-if="scope.row.returnAmount " class="f40"> {{ `-${scope.row.returnAmount}` }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="销售个数" prop="totalNumber" align="center" />
      <el-table-column label="退筒个数" prop="returnNumber" align="center" />
      <el-table-column label="差值" prop="differentAmount" align="center" />
      <el-table-column label="其他款" prop="otherAmount" align="center">
        <template slot-scope="scope">
          <div v-if="scope.row.otherAmount" :class=" scope.row.otherAmount > 0 ? 'increase' : 'decrease'">
            {{ scope.row.otherAmount }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="余额" prop="balanceAmount" align="center" width="150">
        <template slot-scope="scope">
          <div v-if="scope.row.balanceAmount" :class=" scope.row.balanceAmount > 0 ? 'increase' : 'decrease'">
            {{ scope.row.balanceAmount }}
          </div>
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
  getCustomes
} from '@/api/user'
import {
  getCustomerBillReport,
  exportBillCustomerSummary
} from '@/api/bill'
export default {
  data() {
    return {
      listLoading: true,
      total: 0,
      filter: {
        queryDate: [],
        pageIndex: 1,
        pageSize: 10
      },
      billList: [],
      summary: {},
      customeList: []
    }
  },
  mounted() {
    this.getBillList()
    this.getCustomeList()
  },
  methods: {
    getBillList() {
      this.listLoading = true
      getCustomerBillReport(this.filter).then(res => {
        if (res.code === 10000) {
          this.billList = res.data
          this.summary = res.summary
          this.total = res.total
        }
        this.listLoading = false
      })
    },
    getCustomeList() {
      getCustomes().then(res => {
        if (res.code === 10000) this.customeList = res.data
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
      exportBillCustomerSummary(this.filter).then(res => {
        if (res.code === 10000) {
          loading.close()
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
    // 查询
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
.block {
    padding-top: 15px;
}

.f40 {
    color: #ff4400;
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
