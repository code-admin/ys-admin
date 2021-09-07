<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="filter.phone" placeholder="手机号" style="width: 200px;" class="filter-item" clearable />
      <el-input v-model="filter.userName" placeholder="姓名" style="width: 200px;" class="filter-item" clearable />
      <el-input v-model="filter.jobNumber" placeholder="工号" style="width: 200px;" class="filter-item" clearable />
      <el-select v-model="filter.departmentId" placeholder="请选择部门" style="width: 200px;" class="filter-item" clearable>
        <el-option v-for="(dept,index) in deptList" :key="index" :label="dept.departmentName" :value="dept.id" />
      </el-select>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="queryData">查询</el-button>
      <el-button class="filter-item" icon="el-icon-plus" @click="addInit">添加</el-button>
    </div>

    <el-table :key="tableKey" v-loading="listLoading" :data="userList" border fit highlight-current-row style="width: 100%;">
      <el-table-column type="selection" align="center" width="55" />
      <el-table-column type="index" width="50" align="center" />
      <el-table-column label="工号" prop="jobNumber" align="center" sortable="custom" />
      <el-table-column label="姓名" prop="userName" align="center" />
      <el-table-column label="性别" prop="gender" align="center">
        <template slot-scope="scope">
          <i>{{ scope.row.gender ? '男' : '女' }}</i>
          <svg-icon :icon-class="scope.row.gender ? 'male' : 'female'" />
        </template>
      </el-table-column>
      <el-table-column label="身份证" prop="identityCard" align="center" />
      <el-table-column label="手机号" prop="phone" align="center" />
      <el-table-column label="公众服务号" prop="mpOpenId" align="center" />
      <el-table-column label="所属部门" prop="departmentName" align="center" sortable="custom" />
      <el-table-column label="所属职位" prop="jobName" align="center" sortable="custom" />
      <el-table-column label="班次" prop="className" align="center" sortable="custom" />
      <el-table-column label="设备数" prop="deviceNumber" align="center" sortable="custom">
        <template slot-scope="scope">
          <el-popover placement="right" width="300px" trigger="click">
            <el-table :data="scope.row.deviceList">
              <el-table-column width="150" property="deviceNumber" label="设备编号" />
              <el-table-column width="150" property="deviceName" label="设备名称" />
            </el-table>
            <el-button slot="reference" type="text" size="mini">{{ scope.row.deviceList.length }}台</el-button>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="用户角色" prop="roleName" align="center" show-overflow-tooltip />
      <el-table-column label="禁用/启用" prop="enable" align="center">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.enable" @change="handleEnable(scope.row)" />
        </template>
      </el-table-column>
      <el-table-column label="操作" prop="id" align="center" width="120">
        <template slot-scope="scope">
          <el-button type="text" size="mini" @click="editInit(scope.row)">
            修改
          </el-button>
          <el-popover :ref="scope.row.id" placement="top" width="150" trigger="click">
            <p>确定要为该用户重置密码吗？</p>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="()=>{$refs[scope.row.id].doClose()}">取消</el-button>
              <el-button type="primary" size="mini" @click="resetPassword(scope.row)">确定</el-button>
            </div>
            <el-button slot="reference" type="text" size="mini">重置密码</el-button>
          </el-popover>
        </template>
      </el-table-column>
    </el-table>
    <div class="block">
      <el-pagination v-show="total>0" :current-page="filter.pageIndex" :page-sizes="[10, 20, 50, 100]" :page-size="filter.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>

    <el-dialog :title="title" :visible.sync="dialogFormVisible">
      <el-form :model="user">
        <el-form-item label="工号" :label-width="formLabelWidth">
          <el-input v-model="user.jobNumber" autocomplete="off" placeholder="请输入员工编号" />
        </el-form-item>
        <el-form-item label="员工姓名" :label-width="formLabelWidth">
          <el-input v-model="user.userName" autocomplete="off" placeholder="请输入员工姓名" />
        </el-form-item>
        <el-form-item label="登录账号" :label-width="formLabelWidth">
          <el-input v-model="user.loginName" autocomplete="off" placeholder="请输入登录账号" />
        </el-form-item>
        <el-form-item label="性别" :label-width="formLabelWidth">
          <el-radio v-model="user.gender" :label="1">男</el-radio>
          <el-radio v-model="user.gender" :label="0">女</el-radio>
        </el-form-item>
        <el-form-item label="手机号码" :label-width="formLabelWidth">
          <el-input v-model="user.phone" autocomplete="off" placeholder="请输入手机号码" />
        </el-form-item>
        <el-form-item label="所属部门" :label-width="formLabelWidth">
          <el-select v-model="user.departmentId" placeholder="请选择部门" style="width:100%" @change="changeDept">
            <el-option v-for="(dept,index) in deptList" :key="index" :label="dept.departmentName" :value="dept.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="所属职位" :label-width="formLabelWidth">
          <el-select v-model="user.jobId" placeholder="请选择职位" style="width:100%">
            <el-option v-for="job in jobList" :key="job.id" :label="job.name" :value="job.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="班次" :label-width="formLabelWidth">
          <el-select v-model="user.classId" placeholder="请选择班次" style="width:100%">
            <el-option :value="1" label="甲班" />
            <el-option :value="2" label="乙班" />
            <el-option :value="3" label="白班" />
            <el-option :value="4" label="夜班" />
          </el-select>
        </el-form-item>
        <el-form-item label="设备" :label-width="formLabelWidth">
          <el-select v-model="user.deviceIdList" multiple filterable remote reserve-keyword placeholder="请输入设备名称" :remote-method="getDeviceList" :loading="loading" style="width:100%">
            <el-option v-for="(device, index) in deviceList" :key="index" :label="`${device.deviceNumber}/${device.deviceName}`" :value="device.id" />
          </el-select>
        </el-form-item>

        <el-form-item v-if="!!roleList" label="系统角色" :label-width="formLabelWidth">
          <el-select v-model="user.roleId" placeholder="请选择系统角色" style="width:100%">
            <el-option v-for="role in roleList" :key="role.id" :value="role.id" :label="role.roleName" />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveUser">保 存</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import {
  fetchDeptList,
  getJobListByDeptId
} from '@/api/department'
import {
  getUsers,
  getRoleList,
  saveUserInfo,
  resetPwd,
  disable
} from '@/api/user'
import {
  getValidateDeviceList
} from '@/api/device'
export default {
  data() {
    return {
      listLoading: true,
      tableKey: 0,
      total: 0,
      filter: {
        userType: '1',
        phone: '',
        userName: '',
        jobNumber: '',
        departmentId: null,
        pageIndex: 1,
        pageSize: 10
      },
      userList: [],
      deptList: [],
      jobList: [],
      loading: false,
      deviceList: [],
      roleList: [],
      user: {},
      title: '',
      dialogFormVisible: false,
      formLabelWidth: '80px'
    }
  },
  mounted() {
    this.getUserList()
    this.getDeptList()
    this.getRoles()
  },
  methods: {
    getUserList() {
      this.listLoading = true
      const params = {
        ...this.filter,
        phone: this.filter.phone.trim(),
        userName: this.filter.userName.trim(),
        jobNumber: this.filter.jobNumber.trim()
      }
      getUsers(params).then(res => {
        if (res.code === 10000) {
          this.userList = res.data
          this.total = res.total
        }
        this.listLoading = false
      })
    },
    getRoles() {
      getRoleList({}).then(res => {
        if (res.code === 10000) this.roleList = res.data
      })
    },
    addInit() {
      this.getDeviceList('')
      this.title = '添加员工信息'
      this.user = {
        jobId: '',
        gender: 1,
        roleId: 2
      }
      this.dialogFormVisible = !this.dialogFormVisible
    },
    editInit(obj) {
      // this.getDeviceList('')
      this.deviceList = obj.deviceList
      this.getJobListById(obj.departmentId)
      this.title = '修改员工信息'
      this.user = obj
      this.dialogFormVisible = !this.dialogFormVisible
    },
    saveUser() {
      saveUserInfo({
        ...this.user,
        userType: '1'
      }).then(res => {
        if (res.code === 10000) {
          this.$message({
            message: '保存成功！',
            type: 'success'
          })
          this.getUserList()
          this.dialogFormVisible = !this.dialogFormVisible
        }
      })
    },
    resetPassword(obj) {
      resetPwd(obj.id).then(res => {
        res.code === 10000 && this.$notify({
          title: '提示',
          message: res.message,
          type: 'success'
        })
      })
      this.$refs[obj.id].doClose()
    },
    handleEnable(obj) {
      const params = {
        userId: obj.id,
        enable: obj.enable
      }
      disable(params).then(res => {
        res.code === 10000 && this.$message({
          message: '操作成功！',
          type: 'success'
        })
      })
    },
    getDeptList() {
      fetchDeptList({
        pageIndex: 1,
        pageSize: 100000
      }).then(res => {
        if (res.code === 10000) this.deptList = res.data
      })
    },
    changeDept() {
      this.user.jobId = ''
      this.getJobListById(this.user.departmentId)
    },
    getJobListById(deptId) {
      getJobListByDeptId(deptId).then(res => {
        if (res.code === 10000) this.jobList = res.data
      })
    },
    getDeviceList(name) {
      const params = {
        deviceName: name,
        pageIndex: 1,
        pageSize: 100000
      }
      this.loading = !this.loading
      getValidateDeviceList(params).then(res => {
        this.loading = !this.loading
        if (res.code === 10000) this.deviceList = res.data
      })
    },
    queryData() {
      this.filter.pageIndex = 1
      this.getUserList()
    },
    handleSizeChange(val) {
      this.filter.pageSize = val
      this.getUserList()
    },
    handleCurrentChange(val) {
      this.filter.pageIndex = val
      this.getUserList()
    }
  }
}
</script>

<style lang="scss" scoped>
.block {
    padding-top: 15px;
}
</style>
