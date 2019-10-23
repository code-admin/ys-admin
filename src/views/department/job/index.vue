<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="filter.jobNo" placeholder="岗位名称" style="width: 200px;" class="filter-item" clearable />
      <el-input v-model="filter.jobName" placeholder="岗位名称" style="width: 200px;" class="filter-item" clearable />
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="queryData">查询</el-button>
      <el-button class="filter-item" icon="el-icon-plus" @click="addInit">添加</el-button>
    </div>

    <el-table :key="tableKey" v-loading="listLoading" :data="jobList" border fit highlight-current-row style="width: 100%;">
      <el-table-column type="selection" align="center" width="55" />
      <el-table-column type="index" width="50" align="center" />
      <el-table-column label="所属部门" prop="departmentName" align="center" show-overflow-tooltip />
      <el-table-column label="职位编号" prop="jobNo" align="center" sortable="custom" />
      <el-table-column label="职位名称" prop="name" align="center" sortable="custom" />
      <el-table-column label="描述" prop="description" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.description }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" prop="id" sortable="custom" align="center" width="160">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="editInit(scope.row)">
            修改
          </el-button>
          <el-popover :ref="scope.row.id" placement="top" width="150" trigger="click">
            <p>确定删除当前职位吗？</p>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="()=>{$refs[scope.row.id].doClose()}">取消</el-button>
              <el-button type="danger" size="mini" plain @click="deleteJob(scope.row)">确定</el-button>
            </div>
            <el-button slot="reference" type="danger" size="mini">删除</el-button>
          </el-popover>
        </template>
      </el-table-column>
    </el-table>
    <div class="block">
      <el-pagination v-show="total>0" :current-page="filter.pageIndex" :page-sizes="[10, 20, 50, 100]" :page-size="filter.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>

    <el-dialog :title="title" :visible.sync="dialogFormVisible">
      <el-form :model="job">
        <el-form-item label="职位编号" :label-width="formLabelWidth">
          <el-input v-model="job.jobNo" autocomplete="off" placeholder="请输入职位编号" />
        </el-form-item>
        <el-form-item label="职位名称" :label-width="formLabelWidth">
          <el-input v-model="job.name" autocomplete="off" placeholder="请输入职位名称" />
        </el-form-item>
        <el-form-item label="所属部门" :label-width="formLabelWidth">
          <el-select v-model="job.departmentId" placeholder="请选择部门" style="width:100%" clearable>
            <el-option v-for="(dept,index) in deptList" :key="index" :label="dept.departmentName" :value="dept.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="描述" :label-width="formLabelWidth">
          <el-input v-model="job.description" type="textarea" autocomplete="off" placeholder="请输入描述" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveJob">保 存</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { getJobs, saveJobInfo, deleteJobById, fetchDeptList } from '@/api/department'
export default {
  data() {
    return {
      listLoading: true,
      tableKey: 0,
      total: 0,
      filter: {
        jobNo: '',
        jobName: '',
        pageIndex: 1,
        pageSize: 10
      },
      jobList: [],
      deptList: [],
      job: {},
      title: '',
      dialogFormVisible: false,
      formLabelWidth: '80px'
    }
  },
  created() {
    this.getJobList()
    this.getDeptList()
  },
  methods: {
    getJobList() {
      this.listLoading = true
      const params = {
        ...this.filter,
        jobNo: this.filter.jobNo.trim(),
        jobName: this.filter.jobName.trim()
      }
      getJobs(params).then(res => {
        if (res.code === 10000) {
          this.jobList = res.data
          this.total = res.total
        }
        this.listLoading = false
      })
    },
    addInit() {
      this.title = '添加职位信息'
      this.job = {}
      this.dialogFormVisible = !this.dialogFormVisible
    },
    editInit(obj) {
      this.title = '修改职位信息'
      this.job = obj
      this.dialogFormVisible = !this.dialogFormVisible
    },
    saveJob() {
      saveJobInfo(this.job).then(res => {
        if (res.code === 10000) {
          this.$message({
            message: '保存成功！',
            type: 'success'
          })
          this.getJobList()
        }
      })
      this.dialogFormVisible = !this.dialogFormVisible
    },
    deleteJob(job) {
      deleteJobById(job.id).then(res => {
        if (res.code === 10000) {
          this.$message({
            message: '删除成功！',
            type: 'success'
          })
          this.getJobList()
        }
      })
      this.$refs[job.id].doClose()
    },
    queryData() {
      this.filter.pageIndex = 1
      this.getJobList()
    },
    handleSizeChange(val) {
      this.filter.pageSize = val
      this.getJobList()
    },
    handleCurrentChange(val) {
      this.filter.pageIndex = val
      this.getJobList()
    },

    getDeptList() {
      fetchDeptList({ pageIndex: 1, pageSize: 100000 }).then(res => {
        if (res.code === 10000) this.deptList = res.data
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.block{
  padding-top: 15px;
}
</style>
