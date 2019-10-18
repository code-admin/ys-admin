<template>
  <div v-loading="listLoading" class="app-container">
    <div class="filter-container">
      <el-date-picker v-model="queryDate" clearable class="filter-item" value-format="yyyy-MM-dd" :format="'yyyy-MM-dd'" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" />
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="queryData">查询</el-button>
      <router-link :to="{name:'ProduceLogImport'}">
        <el-button class="filter-item" icon="el-icon-document-add" @click="queryData">导入数据</el-button>
      </router-link>
      <el-button class="filter-item" icon="el-icon-plus" @click="addInit">创建日志</el-button>
    </div>

    <el-table v-if="!!logData" :data="logData" border fit highlight-current-row style="width: 100%;">
      <el-table-column type="index" width="50" align="center" />
      <el-table-column label="日期" prop="reportTime" align="center">
        <template slot-scope="scope">
          <router-link :to="{name:'ProduceLogDetail', params:{id:scope.row.id, reportTime:scope.row.reportTime}}">
            <el-button type="text">{{ scope.row.reportTime }}</el-button>
          </router-link>
        </template>
      </el-table-column>
      <!-- <el-table-column label="文件名称" prop="fileName" align="center">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="点击可下载文件" placement="top">
            <el-button type="text" @click="dowloadByUrl(scope.row.fileUrl)">{{ scope.row.fileName }}</el-button>
          </el-tooltip>
        </template>
      </el-table-column> -->
      <el-table-column label="总数据(条)" prop="totalNumber" align="center" />
      <el-table-column label="记录人" prop="createBy" align="center" />
      <el-table-column label="记录时间" prop="createTime" align="center" width="160" />
      <el-table-column label="操作" align="center" width="150">
        <template slot-scope="scope">
          <router-link :to="{name:'ProduceLogDetail', params:{id:scope.row.id, reportTime:scope.row.reportTime}}">
            <el-button size="mini">查看数据</el-button>
          </router-link>
        </template>
      </el-table-column>
    </el-table>

    <div class="block">
      <el-pagination v-show="total>0" :current-page="filter.pageIndex" :page-sizes="[10, 20, 50, 100]" :page-size="filter.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>

    <el-dialog title="创建日志" :visible.sync="dialogFormVisible">
      <el-form :model="log">
        <el-form-item label="生产日期" :label-width="formLabelWidth">
          <el-date-picker v-model="log.reportTime" value-format="yyyy-MM-dd" format="yyyy-MM-dd" type="date" placeholder="选择日期" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveLog">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getFileList,
  submitStaffProductFile
} from '@/api/produce'
export default {
  data() {
    return {
      listLoading: true,
      queryDate: [],
      filter: {
        pageIndex: 1,
        pageSize: 10
      },
      total: 0,
      logData: null,
      dialogFormVisible: false,
      formLabelWidth: '90px',
      log: {
        reportTime: ''
      }
    }
  },
  mounted() {
    this.getFileLogs()
  },
  methods: {
    getFileLogs() {
      this.listLoading = true
      getFileList({
        ...this.filter,
        startTime: this.queryDate[0],
        endTime: this.queryDate[1]
      }).then(res => {
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
    addInit() {
      const dateTime = new Date()
      this.log.reportTime = `${dateTime.getFullYear()}-${dateTime.getMonth() < 9 ? '0' + (dateTime.getMonth() + 1) : dateTime.getMonth() + 1}-${dateTime.getDate() < 10 ? '0' + dateTime.getDate() : dateTime.getDate()}`
      this.dialogFormVisible = !this.dialogFormVisible
    },
    saveLog() {
      submitStaffProductFile(this.log).then(res => {
        if (res.code === 10000) {
          this.$message({
            message: '创建成功',
            type: 'success'
          })
          this.getFileLogs()
        } else {
          this.$message({
            message: res.message,
            type: 'error'
          })
        }
      })
      this.dialogFormVisible = !this.dialogFormVisible
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
