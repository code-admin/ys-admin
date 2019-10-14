<template>
  <div class="app-container">
    <div class="filter-container">
      <el-date-picker v-model="filter.orderNo" type="date" placeholder="选择日期" style="width: 200px;" class="filter-item" clearable />
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="queryData">查询</el-button>
      <el-button class="filter-item" icon="el-icon-download" @click="queryData">导入数据</el-button>
    </div>

    <el-table v-loading="listLoading" :data="logData" border fit highlight-current-row style="width: 100%;">
      <el-table-column label="订单号" prop="orderNo" align="center" width="140" />
    </el-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      listLoading: true,
      filter: {
        pageIndex: 1,
        pageSize: 1000
      },
      logData: []
    }
  },
  methods: {
    getLogDatasByDate() {

    },
    queryData() {
      this.filter.pageIndex = 1
      this.getLogDatasByDate()
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
