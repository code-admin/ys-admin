<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select v-model="filter.productType" placeholder="请选择品种" style="width: 200px;" class="filter-item" clearable>
        <el-option v-for="productType in productTypeList" :key="productType.id" :label="productType.name" :value="productType.id" />
      </el-select>
      <el-select v-model="filter.questionId" placeholder="请选择问题类型" style="width: 200px;" class="filter-item" clearable>
        <el-option v-for="(feedbackType,index) in feedbackTypeList" :key="index" :label="feedbackType.questionName" :value="feedbackType.id" />
      </el-select>
      <el-input v-model="filter.deviceNo" placeholder="	机台号" style="width: 200px;" class="filter-item" clearable />
      <el-date-picker v-model="filter.productDate" type="date" value-format="yyyy-MM-dd" placeholder="生产日期" style="width: 200px;" class="filter-item" clearable />
      <el-select v-model="filter.status" placeholder="回馈状态" style="width: 200px;" class="filter-item" clearable>
        <el-option label="待回馈" :value="1" />
        <el-option label="已回馈" :value="2" />
      </el-select>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="getFeedBacks">查询</el-button>
    </div>

    <el-table :key="tableKey" v-loading="listLoading" :data="feedbackList" border fit highlight-current-row style="width: 100%;">
      <el-table-column type="selection" align="center" width="55" />
      <el-table-column type="index" width="50" align="center" />
      <el-table-column label="反馈时间" prop="createTime" align="center" sortable="custom" show-overflow-tooltip />
      <el-table-column label="问题类型" prop="questionName" align="center" />
      <el-table-column label="具体说明" prop="description" align="center" />
      <el-table-column label="客户名称" prop="customerName" align="center" />
      <el-table-column label="生产时间" prop="productDate" align="center" sortable="custom" width="110" />
      <el-table-column label="机台号" prop="deviceNo" align="center" />
      <el-table-column label="品种" prop="productType" align="center" />
      <el-table-column label="要求" prop="requirement" align="center" />
      <!-- <el-table-column label="宽度" prop="width" align="center" />
      <el-table-column label="克重" prop="weight" align="center" /> -->
      <el-table-column label="备注" prop="remark" align="center" />
      <el-table-column label="状态" prop="status" align="center">
        <template slot-scope="scope">
          <el-tag size="mini" :type="scope.row.status ? 'info' : 'danger'">{{ scope.row.status ? '已回馈' : '待回馈' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" prop="id" align="center">
        <template slot-scope="scope">
          <el-button size="mini" @click="toDetail(scope.row)">
            查 看
          </el-button>
        </template>
      </el-table-column>

    </el-table>
    <div class="block">
      <el-pagination v-show="total>0" :current-page="filter.pageIndex" :page-sizes="[10, 20, 50, 100]" :page-size="filter.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>
  </div>
</template>

<script>
import { getFeedBackList, getFeedBackTypeList } from '@/api/feedback'
import { getProductTypes } from '@/api/product'
export default {
  data() {
    return {
      listLoading: true,
      tableKey: 0,
      total: 0,
      filter: {
        pageIndex: 1,
        pageSize: 10
      },
      deptList: [],

      feedbackList: [],
      productTypeList: [],
      feedbackTypeList: [],
      department: {},
      title: '',
      dialogFormVisible: false,
      formLabelWidth: '80px'
    }
  },
  mounted() {
    this.getFeedBacks()
    this.getProductTypeList()
    this.getFeedBackTypes()
  },
  methods: {
    getFeedBacks() {
      this.listLoading = true
      const params = {
        ...this.filter
      }
      getFeedBackList(params).then(res => {
        if (res.code === 10000) {
          this.feedbackList = res.data
          this.total = res.total
        }
        this.listLoading = false
      })
    },
    getProductTypeList() {
      getProductTypes().then(res => {
        if (res.code === 10000) this.productTypeList = res.data
      })
    },
    getFeedBackTypes() {
      getFeedBackTypeList().then(res => {
        if (res.code === 10000) this.feedbackTypeList = res.data
      })
    },
    toDetail(obj) {
      this.$router.push({ name: 'FeedbackDetail', params: { id: obj.id }})
    },
    editInit(dept) {
      this.title = '修改部门信息'
      this.department = dept
      this.dialogFormVisible = !this.dialogFormVisible
    },
    handleSizeChange(val) {
      this.filter.pageSize = val
      this.getFeedBacks()
    },
    handleCurrentChange(val) {
      this.filter.pageIndex = val
      this.getFeedBacks()
    }

  }
}
</script>

<style lang="scss" scoped>
.block{
  padding-top: 15px;
}
</style>

