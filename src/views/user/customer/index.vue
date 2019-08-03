<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="filter.phone" placeholder="手机号" style="width: 200px;" class="filter-item" clearable />
      <el-input v-model="filter.userName" placeholder="姓名" style="width: 200px;" class="filter-item" clearable />
      <el-input v-model="filter.customerNo" placeholder="客户编号" style="width: 200px;" class="filter-item" clearable />
      <el-select v-model="filter.customerType" placeholder="请选择客户类型" style="width: 200px;" class="filter-item" clearable>
        <el-option v-for="(customeType,index) in customeTypeList" :key="index" :label="customeType.name" :value="customeType.id" />
      </el-select>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="getUserList">查询</el-button>
      <el-button class="filter-item" icon="el-icon-plus" @click="addInit">添加</el-button>
    </div>

    <el-table :key="tableKey" v-loading="listLoading" :data="userList" border fit highlight-current-row style="width: 100%;">
      <el-table-column type="selection" align="center" width="55" />
      <el-table-column type="index" width="50" align="center" />
      <el-table-column label="客户编号" prop="customerNo" align="center" sortable="custom" />
      <el-table-column label="姓名" prop="userName" align="center" />
      <el-table-column label="性别" prop="gender" align="center">
        <template slot-scope="scope">
          <i>{{ scope.row.gender ? '男' : '女' }}</i>
          <svg-icon :icon-class="scope.row.gender ? 'male' : 'female'" />
        </template>
      </el-table-column>
      <el-table-column label="手机号" prop="phone" align="center" />
      <el-table-column label="公司名称" prop="companyName" align="center" />
      <el-table-column label="身份证" prop="identityCard" align="center" />
      <el-table-column label="客户类型" prop="customerTypeName" align="center" />
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
        <el-form-item label="客户编号" :label-width="formLabelWidth">
          <el-input v-model="user.customerNo" autocomplete="off" placeholder="请输入员工编号" />
        </el-form-item>
        <el-form-item label="客户姓名" :label-width="formLabelWidth">
          <el-input v-model="user.userName" autocomplete="off" placeholder="请输入员工姓名" />
        </el-form-item>
        <el-form-item label="性别" :label-width="formLabelWidth">
          <el-radio v-model="user.gender" :label="1">男</el-radio>
          <el-radio v-model="user.gender" :label="0">女</el-radio>
        </el-form-item>
        <el-form-item label="手机号码" :label-width="formLabelWidth">
          <el-input v-model="user.phone" autocomplete="off" placeholder="请输入手机号码" />
        </el-form-item>
        <el-form-item label="公司名称" :label-width="formLabelWidth">
          <el-input v-model="user.companyName" autocomplete="off" placeholder="请输入公司名称" />
        </el-form-item>
        <el-form-item label="身份证号" :label-width="formLabelWidth">
          <el-input v-model="user.identityCard" autocomplete="off" placeholder="请输入身份证号 " />
        </el-form-item>
        <el-form-item label="电子邮箱" :label-width="formLabelWidth">
          <el-input v-model="user.email" autocomplete="off" placeholder="请输入设备数" />
        </el-form-item>
        <el-form-item v-if="!!customeTypeList" label="客户类型" :label-width="formLabelWidth">
          <el-select v-model="user.customerType" placeholder="请选择客户类型" style="width:100%">
            <el-option v-for="(customeType,index) in customeTypeList" :key="index" :label="customeType.name" :value="customeType.id" />
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
import { getUsers, getCustomeTypeList, getRoleList, saveUserInfo, resetPwd, disable } from '@/api/user'
export default {
  data() {
    return {
      listLoading: true,
      tableKey: 0,
      total: 0,
      filter: {
        userType: '2',
        phone: '',
        userName: '',
        customerNo: '',
        departmentId: null,
        pageIndex: 1,
        pageSize: 10
      },
      userList: [],
      deptList: [],
      jobList: [],
      roleList: [],
      customeTypeList: [],
      user: {},
      title: '',
      dialogFormVisible: false,
      formLabelWidth: '80px'
    }
  },
  mounted() {
    this.getUserList()
    this.getCustomeTypes()
  },
  methods: {
    getUserList() {
      this.listLoading = true
      const params = {
        ...this.filter,
        phone: this.filter.phone.trim(),
        userName: this.filter.userName.trim(),
        customerNo: this.filter.customerNo.trim()
      }
      getUsers(params).then(res => {
        if (res.code === 10000) {
          this.userList = res.data
          this.total = res.total
        }
        this.listLoading = false
      })
    },
    getCustomeTypes() {
      getCustomeTypeList({}).then(res => {
        if (res.code === 10000) this.customeTypeList = res.data
      })
    },
    getRoles() {
      getRoleList({}).then(res => {
        if (res.code === 10000) this.roleList = res.data
      })
    },
    addInit() {
      this.title = '添加员工信息'
      this.user = {
        gender: 1,
        roleId: 2
      }
      this.dialogFormVisible = !this.dialogFormVisible
    },
    editInit(obj) {
      this.title = '修改员工信息'
      this.user = obj
      this.dialogFormVisible = !this.dialogFormVisible
    },
    saveUser() {
      saveUserInfo({ ...this.user, userType: '2', loginName: this.user.phone }).then(res => {
        res.code === 10000 && this.$message({ message: '保存成功！', type: 'success' })
        this.getUserList()
      })
      this.dialogFormVisible = !this.dialogFormVisible
    },
    resetPassword(obj) {
      resetPwd(obj.id).then(res => {
        res.code === 10000 && this.$notify({ title: '提示', message: res.message, type: 'success' })
      })
      this.$refs[obj.id].doClose()
    },
    handleEnable(obj) {
      const params = {
        userId: obj.id,
        enable: obj.enable
      }
      disable(params).then(res => {
        res.code === 10000 && this.$message({ message: '操作成功！', type: 'success' })
      })
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
.block{
  padding-top: 15px;
}
</style>
