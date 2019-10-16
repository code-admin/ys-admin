<template>
  <div class="app-container">
    <div class="filter-container">
      <el-date-picker v-model="filter.orderNo" type="date" placeholder="选择日期" style="width: 200px;" class="filter-item" clearable />
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="queryData">查询</el-button>
      <router-link :to="{name:'ProduceLogImport'}">
        <el-button class="filter-item" icon="el-icon-download" @click="queryData">导入数据</el-button>
      </router-link>
    </div>

    <el-table v-loading="listLoading" :data="logData" border fit highlight-current-row style="width: 100%;">
      <el-table-column type="index" width="50" align="center" />
      <el-table-column label="日期" prop="reportTime" align="center" />
      <el-table-column label="文件名称" prop="fileName" align="center">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="点击可下载文件" placement="top">
            <el-button type="text" @click="dowloadByUrl(scope.row.fileUrl)">{{ scope.row.fileName }}</el-button>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="总数据" prop="totalNumber" align="center" />
      <el-table-column label="上传人" prop="createBy" align="center" />
      <el-table-column label="上传日期" prop="createTime" align="center" width="160" />
      <el-table-column label="操作" align="center" width="120">
        <template slot-scope="scope">
          <router-link :to="{name:'ProduceLogDetail', params:{id:scope.row.id}}">
            <el-button size="mini">查看数据</el-button>
          </router-link>
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
  getFileList
} from '@/api/produce'
export default {
  data() {
    return {
      listLoading: true,
      filter: {
        pageIndex: 1,
        pageSize: 1000
      },
      total: 0,
      logData: []
    }
  },
  mounted() {
    this.getFileLogs()
  },
  methods: {
    getFileLogs() {
      this.listLoading = true
      getFileList(this.filter).then(res => {
        this.listLoading = !this.listLoading
        if (res.code === 10000) {
          this.logData = res.data
          this.total = res.total
        }
      })
    },
    dowloadByUrl(url) {
      console.log(url)
      if (url) {
        window.open(url)
      }
    },
    queryData() {
      this.filter.pageIndex = 1
      this.getFileLogs()
    },
    handleSizeChange(val) {
      this.filter.pageSize = val
      this.getFileLogs()
    },
    handleCurrentChange(val) {
      this.filter.pageIndex = val
      this.getFileLogs()
    }
  }
}
</script>

<style lang="scss" scoped>
.block {
    padding-top: 15px;
}
</style>
