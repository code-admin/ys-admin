<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="filter.departmentNo" placeholder="部门编号" style="width: 200px;" class="filter-item" clearable />
      <el-input v-model="filter.departmentName" placeholder="部门名称" style="width: 200px;" class="filter-item" clearable />
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="getDeptList">查询</el-button>
      <el-button class="filter-item" icon="el-icon-plus" @click="addInit">添加</el-button>
    </div>

    <el-table :key="tableKey" v-loading="listLoading" :data="deptList" border fit highlight-current-row style="width: 100%;">
      <el-table-column type="selection" align="center" width="55" />
      <el-table-column type="index" width="50" align="center" />
      <el-table-column label="部门编号" prop="departmentNo" align="center" sortable="custom">
        <template slot-scope="scope">
          <span>{{ scope.row.departmentNo }}</span>
        </template>
      </el-table-column>
      <el-table-column label="部门名称" prop="departmentName" align="center" sortable="custom" />
      <el-table-column label="职位" prop="deptName" align="left" show-overflow-tooltip>
        <template slot-scope="scope">
          <el-tag v-for="(job,index) in scope.row.jobs" :key="index" size="mini" type="info" effect="plain" style="margin-right:5px;">{{ job.name }}</el-tag>
        </template>
      </el-table-column>
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
            <p>确定删除当前部门吗？</p>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="()=>{$refs[scope.row.id].doClose()}">取消</el-button>
              <el-button type="danger" size="mini" plain @click="deleteDept(scope.row)">确定</el-button>
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
      <el-form :model="department">
        <el-form-item label="部门编号" :label-width="formLabelWidth">
          <el-input v-model="department.departmentNo" autocomplete="off" placeholder="请输入部门编号" />
        </el-form-item>
        <el-form-item label="部门名称" :label-width="formLabelWidth">
          <el-input v-model="department.departmentName" autocomplete="off" placeholder="请输入部门名称" />
        </el-form-item>
        <el-form-item label="描述" :label-width="formLabelWidth">
          <el-input v-model="department.description" type="textarea" autocomplete="off" placeholder="请输入描述" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveDept">保 存</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { fetchDeptList, saveDeptment, deleteDeptById } from '@/api/department'
export default {
  data() {
    return {
      listLoading: true,
      tableKey: 0,
      total: 0,
      filter: {
        departmentNo: '',
        departmentName: '',
        pageIndex: 1,
        pageSize: 10
      },
      deptList: [],
      department: {},
      title: '',
      dialogFormVisible: false,
      formLabelWidth: '80px'
    }
  },
  created() {
    this.getDeptList()
  },
  methods: {
    getDeptList() {
      this.listLoading = true
      const params = {
        ...this.filter,
        departmentNo: this.filter.departmentNo.trim(),
        departmentName: this.filter.departmentName.trim()
      }
      fetchDeptList(params).then(res => {
        if (res.code === 10000) {
          this.deptList = res.data
          this.total = res.total
        }
        this.listLoading = false
      })
    },
    addInit() {
      this.title = '添加部门信息'
      this.department = {}
      this.dialogFormVisible = !this.dialogFormVisible
    },
    editInit(dept) {
      this.title = '修改部门信息'
      this.department = dept
      this.dialogFormVisible = !this.dialogFormVisible
    },
    saveDept() {
      saveDeptment(this.department).then(res => {
        if (res.code === 10000) {
          this.$message({
            message: '保存成功！',
            type: 'success'
          })
          this.getDeptList()
        }
      })
      this.dialogFormVisible = !this.dialogFormVisible
    },
    deleteDept(dept) {
      deleteDeptById(dept.id).then(res => {
        if (res.code === 10000) {
          this.$message({
            message: '保存成功！',
            type: 'success'
          })
          this.getDeptList()
        }
      })
      this.$refs[dept.id].doClose()
    },
    handleSizeChange(val) {
      this.filter.pageSize = val
      this.getDeptList()
    },
    handleCurrentChange(val) {
      this.filter.pageIndex = val
      this.getDeptList()
    }

  }
}
</script>

<style lang="scss" scoped>
.block{
  padding-top: 15px;
}
</style>

