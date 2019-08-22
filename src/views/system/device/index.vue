<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="filter.deviceNumber" placeholder="设备编号" style="width: 200px;" class="filter-item" clearable />
      <el-input v-model="filter.deviceName" placeholder="设备名称" style="width: 200px;" class="filter-item" clearable />
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="getDevices">查询</el-button>
      <el-button class="filter-item" icon="el-icon-plus" @click="addInit">添加</el-button>
    </div>
    <el-table v-loading="listLoading" :data="deviceList" border fit highlight-current-row style="width: 100%;">
      <el-table-column type="index" width="50" align="center" />
      <el-table-column label="设备编号" prop="deviceNumber" align="center" show-overflow-tooltip width="120" />
      <el-table-column label="设备名称" prop="deviceName" align="center" show-overflow-tooltip width="150" />

      <el-table-column label="描述" prop="remark" show-overflow-tooltip />
      <el-table-column label="禁用/启用" prop="enable" align="center" width="120">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.enable" disabled />
        </template>
      </el-table-column>
      <el-table-column label="操作" prop="id" align="center" width="160">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="editInit(scope.row)">  修 改 </el-button>
          <el-popover :ref="scope.row.id" placement="top" width="150" trigger="click">
            <p>确定要删除该设备吗？</p>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="()=>{$refs[scope.row.id].doClose()}">取消</el-button>
              <el-button plain type="danger" size="mini" @click="deleteDevice(scope.row)">确定</el-button>
            </div>
            <el-button slot="reference" type="danger" size="mini">  删 除 </el-button>
          </el-popover>
        </template>
      </el-table-column>
    </el-table>
    <div class="block">
      <el-pagination v-show="total>0" :current-page="filter.pageIndex" :page-sizes="[10, 20, 50, 100]" :page-size="filter.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>

    <el-dialog :title="title" :visible.sync="dialogFormVisible">
      <el-form :model="device">
        <el-form-item label="设备编号" :label-width="formLabelWidth">
          <el-input v-model="device.deviceNumber" />
        </el-form-item>
        <el-form-item label="设备名称" :label-width="formLabelWidth">
          <el-input v-model="device.deviceName" />
        </el-form-item>
        <el-form-item label="设备状态" :label-width="formLabelWidth">
          <el-switch v-model="device.enable" />
        </el-form-item>
        <el-form-item label="描述" :label-width="formLabelWidth">
          <el-input v-model="device.remark" type="textarea" placeholder="请输入描述" maxlength="100" show-word-limit />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveOrUpdate">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getDeviceList, saveDevice, deleteDevice } from '@/api/device'
export default {
  data() {
    return {
      listLoading: true,
      dialogFormVisible: false,
      total: 0,
      filter: {
        pageIndex: 1,
        pageSize: 10
      },
      deviceList: [],
      title: '',
      formLabelWidth: '80px',
      device: {}
    }
  },

  mounted() {
    this.getDevices()
  },

  methods: {
    getDevices() {
      this.listLoading = true
      const params = {
        ...this.filter
      }
      getDeviceList(params).then(res => {
        if (res.code === 10000) {
          this.deviceList = res.data
          this.total = res.total
        }
        this.listLoading = false
      })
    },

    addInit() {
      this.title = '新增设备'
      this.device = {}
      this.dialogFormVisible = !this.dialogFormVisible
    },
    editInit(obj) {
      this.title = '修改设备'
      this.device = obj
      this.dialogFormVisible = !this.dialogFormVisible
    },
    saveOrUpdate() {
      saveDevice(this.device).then(res => {
        this.dialogFormVisible = !this.dialogFormVisible
        if (res.code === 10000) {
          this.$message({
            message: '保存成功！',
            type: 'success'
          })
          this.getDevices()
        }
      })
    },
    deleteDevice(obj) {
      deleteDevice(obj.id).then(res => {
        if (res.code === 10000) {
          this.$message({
            message: '删除成功！',
            type: 'success'
          })
          this.getDevices()
        }
      })
      this.$refs[obj.id].doClose()
    },
    handleSizeChange(val) {
      this.filter.pageSize = val
      this.getDevices()
    },
    handleCurrentChange(val) {
      this.filter.pageIndex = val
      this.getDevices()
    }
  }
}
</script>

<style lang="scss" scoped>
.block{
  padding-top: 15px;
}
.demo-drawer__content{
  padding: 20px;
  height: calc(100vh - 60px);
  overflow:scroll;
}
</style>

