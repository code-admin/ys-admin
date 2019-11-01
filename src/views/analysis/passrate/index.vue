<template>
  <div class="app-container">
    <div class="filter-container">
      <el-date-picker v-model="filter.queryDate" clearable class="filter-item" value-format="yyyy-MM-dd" :format="'yyyy-MM-dd'" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" />
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="queryData">查询</el-button>
    </div>

    <div v-loading="listLoading" style="margin-top:20px;">
      <el-table v-if="!!produceList" :data="produceList" border>
        <el-table-column prop="status" label="状态" align="center" />
        <el-table-column prop="className" label="班次" align="center" />
        <el-table-column prop="staffName" label="姓名" align="center" />
        <el-table-column prop="entryTime" label="入职" align="center" />
        <el-table-column prop="leaveTime" label="离职" align="center" />
        <el-table-column prop="daysInService" label="在职天数" align="center" />
        <el-table-column prop="average" label="平均" align="center" />
        <el-table-column prop="produceClassesNumber" label="生产班次" align="center" />
        <el-table-column prop="produceDeviceNumber" label="生产台数" align="center" />
        <el-table-column prop="goodsNumber" label="生产个数" align="center" />
        <el-table-column prop="produceNumber" label="产量" align="center" />
        <el-table-column prop="salary" label="工资" align="center" />
        <el-table-column prop="penalty" label="罚款" align="center" />
        <el-table-column prop="bonus" label="奖励" align="center" />
      </el-table>
    </div>
    <div class="block">
      <el-pagination v-show="total>0" :current-page="filter.pageIndex" :page-sizes="[10, 30, 50, 100]" :page-size="filter.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>
  </div>
</template>

<script>
import {
  getProduceStaffReport
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
      getProduceStaffReport({
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
