<template>
  <div class="app-container">
    <div class="filter-container">
      <el-date-picker v-model="filter.queryDate" clearable class="filter-item" value-format="yyyy-MM-dd" :format="'yyyy-MM-dd'" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" />
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="queryData">查询</el-button>
    </div>
    <div style="margin-top:20px;">
      <el-table v-loading="listLoading" :data="produceList" style="width: 100%">
        <el-table-column prop="year" label="年份" align="center" />
        <el-table-column prop="reportDate" label="月份" align="center" width="120" />
        <el-table-column prop="produceDate" label="日期" align="center" width="120" />
        <el-table-column label="生产数据汇总" align="center">
          <el-table-column prop="produceWeight" label="生产重量（kg）" width="90" />
          <el-table-column prop="produceLength" label="生产米数（cm）" width="90" />
          <el-table-column prop="totalWidth" label="总宽度（cm）" width="120" />
          <el-table-column prop="bonus" label="奖励" width="90" />
          <el-table-column prop="penalty" label="罚款" width="90" />
          <el-table-column prop="passRate" label="筒布合格率" width="120" />
          <el-table-column prop="totalDevice" label="总机台数" width="90" />
          <el-table-column prop="produceDevice" label="生产机台数（台）" width="130" />
          <el-table-column prop="unproduceDevice" label="未生产机台数（台）" width="130" />
          <el-table-column prop="produceNumber" label="生产筒布个数（个）" width="130" />
          <el-table-column prop="noWeighingDevice" label="不称重（台）" width="90" />
          <el-table-column prop="noWeightDevice" label="不算克重（个）" width="130" />
          <el-table-column prop="unnormalDevice" label="生产不正常数（台）" width="130" />
          <el-table-column prop="unnormalWidth" label="生产不正常宽度（cm）" width="130" />
        </el-table-column>
        <el-table-column label="平均数据" align="center">
          <el-table-column prop="perCapitaDevice" label="人均生产机台数" width="100" />
          <el-table-column prop="perCapitaLength" label="人均生产米数（cm）" width="100" />
          <el-table-column prop="perCapitaWeight" label="人均生产重量（kg）" width="100" />
          <el-table-column prop="perCapitaSalary" label="人均生产工资（元/天）" width="100" />
          <el-table-column prop="perCapitaWidth" label="人均总宽度（cm）" width="100" />
          <el-table-column prop="avgDeviceLength" label="台均生产米数（cm）" width="100" />
          <el-table-column prop="avgDeviceWeight" label="台均生产重量（kg）" width="100" />
          <el-table-column prop="avgWeightSalary" label="每吨工资(元/吨)" width="100" />
          <el-table-column prop="avgDeviceSalary" label="台均生产工资（元）" width="100" />
          <el-table-column prop="avgDeviceWidth" label="台均总宽度（cm）" width="100" />
        </el-table-column>
        <el-table-column label="员工数据" align="center">
          <el-table-column prop="staffNumber" label="员工人数" width="90" />
          <el-table-column prop="totalSalary" label="总工资" width="90" />
        </el-table-column>
      </el-table>
    </div>
    <div class="block">
      <el-pagination v-show="total>0" :current-page="filter.pageIndex" :page-sizes="[20, 50, 100, 500, 1000]" :page-size="filter.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>
  </div>
</template>

<script>
import {
  getProduceDailyReport
} from '@/api/analysis'
export default {
  data() {
    return {
      listLoading: true,
      filter: {
        queryDate: [],
        pageIndex: 1,
        pageSize: 20
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
      getProduceDailyReport({ ...this.filter, startTime: this.filter.queryDate[0], endTime: this.filter.queryDate[1] }).then(res => {
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
