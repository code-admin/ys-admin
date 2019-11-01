<template>
  <div class="app-container">
    <div class="filter-container">
      <el-date-picker v-model="filter.queryDate" clearable class="filter-item" value-format="yyyy-MM-dd" :format="'yyyy-MM-dd'" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" />
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="queryData">查询</el-button>
    </div>

    <div v-loading="listLoading" style="margin-top:20px;">
      <el-table v-if="!!produceList" :data="produceList" border>
        <el-table-column type="index" width="50" align="center" />
        <el-table-column prop="year" label="年份" align="center" width="100" />
        <el-table-column prop="reportDate" label="月份" align="center" width="100" />
        <el-table-column prop="className" label="班次" align="center" width="50" />
        <el-table-column prop="productDate" label="日期" align="center" width="100" />
        <el-table-column prop="deviceNo" label="机号" align="center" width="100" />
        <!-- <el-table-column prop="staffNumber" label="员工编号" align="center" width="140" /> -->
        <el-table-column prop="staffName" label="姓名" align="center" width="100" />
        <el-table-column prop="productName" label="名称" align="center" width="100" />
        <el-table-column prop="requirement" label="要求" align="center" width="120" />
        <el-table-column prop="productWidth" label="宽" align="center" width="40" />
        <el-table-column prop="productWeight" label="克重" align="center" width="50" />
        <el-table-column prop="deviceTurnNumber" label="转数" align="center" width="80" />
        <el-table-column prop="productLength" label="米数" align="center" width="80" />
        <el-table-column prop="totalWeight" label="重量/公斤" align="center" width="90" />
        <el-table-column prop="realWeight" label="实际克重" align="center" width="80" />
        <el-table-column prop="diffWeight" label="克重差" align="center" width="70" />
        <el-table-column prop="salaryRate" label="工资率" align="center" width="80" />
        <el-table-column prop="bonus" label="奖金" align="center" width="100" />
        <el-table-column prop="penalty" label="罚款" align="center" width="100" />
        <el-table-column prop="salary" label="工资" align="center" width="120" />
        <el-table-column prop="realSalary" label="总工资" align="center" width="80" />
      </el-table>
    </div>
    <div class="block">
      <el-pagination v-show="total>0" :current-page="filter.pageIndex" :page-sizes="[10, 30, 50, 100]" :page-size="filter.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>
  </div>
</template>

<script>
import {
  getProduceStaffDetailReport
} from '@/api/analysis'
export default {
  data() {
    return {
      listLoading: true,
      filter: {
        queryDate: [],
        pageIndex: 1,
        pageSize: 10
      },
      total: 0,
      produceList: null
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    getData() {
      this.listLoading = true
      getProduceStaffDetailReport({
        ...this.filter,
        startTime: this.filter.queryDate[0],
        endTime: this.filter.queryDate[1]
      }).then(res => {
        if (res.code === 10000) {
          this.produceList = res.data
          this.total = res.total
        }
        this.listLoading = false
      }).catch(err => {
        this.$message({
          type: 'error',
          message: err.message
        })
        this.listLoading = false
      })
    },
    queryData() {
      this.filter.pageIndex = 1
      this.getData()
    },
    handleSizeChange(val) {
      this.filter.pageSize = val
      this.getData()
    },
    handleCurrentChange(val) {
      this.filter.pageIndex = val
      this.getData()
    }
  }
}
</script>
