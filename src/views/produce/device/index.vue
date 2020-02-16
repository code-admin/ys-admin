<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="filter.deviceNo" placeholder="设备编号" style="width: 200px;" class="filter-item" clearable />
      <el-input v-model="filter.productName" placeholder="产品" style="width: 200px;" class="filter-item" clearable />
      <el-input v-model="filter.userName" placeholder="员工姓名" style="width: 200px;" class="filter-item" clearable />
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="queryData">查询</el-button>
    </div>

    <el-table v-loading="listLoading" :data="deviceList" border fit highlight-current-row style="width: 100%;">
      <el-table-column type="index" width="50" align="center" />
      <el-table-column label="设备编号" prop="deviceNo" align="center" />
      <el-table-column label="设备属性" prop="deviceName" align="center" />
      <el-table-column label="产品" prop="productName" align="center" show-overflow-tooltip width="150">
        <template slot-scope="scope">
          <div v-if="scope.row.width">
            {{ `${scope.row.productName}${scope.row.requirement}${scope.row.width}${scope.row.weight}` }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="单价" prop="price" align="center" />
      <el-table-column label="甲班员工" prop="firstStaffName" align="center" />
      <el-table-column label="备注" prop="firstRemark" align="center" />
      <el-table-column label="乙班员工" prop="secondStaffName" align="center" />
      <el-table-column label="备注" prop="secondRemark" align="center" />
      <el-table-column label="状态" prop="enable" align="center" width="120">
        <template slot-scope="scope">
          <div>
            {{ scope.row.status ? '禁用':'启用' }}
          </div>
        </template>
      </el-table-column>

      <el-table-column label="操作" prop="id" align="center" width="100">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="editInit(scope.row)"> 编 辑 </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 编辑弹框 -->
    <el-dialog :title="title" :visible.sync="dialogFormVisible" :close-on-click-modal="false">
      <el-form :model="device">
        <el-form-item label="设备编号" :label-width="formLabelWidth">
          <el-input v-model="device.deviceNo" readonly />
        </el-form-item>
        <el-form-item label="设备名称" :label-width="formLabelWidth">
          <el-input v-model="device.deviceName" readonly />
        </el-form-item>
        <el-form-item label="绑定产品" :label-width="formLabelWidth">
          <el-select v-model="device.productId" filterable style="width:100%">
            <el-option
              v-for="product in productList"
              :key="product.id"
              :value="product.id"
              :label="`${product.name}${product.width}${product.weight}(${product.productNo})`"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="甲班员工" :label-width="formLabelWidth">
          <el-select v-model="device.firstStaffId" filterable style="width:100%">
            <el-option v-for="user in userList" :key="user.id" :value="user.id" :label="user.userName" />
          </el-select>
        </el-form-item>
        <el-form-item label="备注" :label-width="formLabelWidth">
          <el-input v-model="device.firstRemark" />
        </el-form-item>
        <el-form-item label="乙班员工" :label-width="formLabelWidth">
          <el-select v-model="device.secondStaffId" filterable style="width:100%">
            <el-option v-for="user in userList" :key="user.id" :value="user.id" :label="user.userName" />
          </el-select>
        </el-form-item>
        <el-form-item label="备注" :label-width="formLabelWidth">
          <el-input v-model="device.secondRemark" />
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
import { getDeviceRelInfoList, bindDevice } from '@/api/device'
import { getAllProducts, getProducts } from '@/api/product'
import { getStaffList } from '@/api/user'
export default {
  data() {
    return {
      listLoading: true,
      dialogFormVisible: false,
      total: 0,
      filter: {
        pageIndex: 1,
        pageSize: 300
      },
      deviceList: [],
      productList: [],
      userList: [],
      title: '',
      formLabelWidth: '80px',
      device: {}
    }
  },
  created() {
    // this.getProductList()
    this.getUserList()

    this.getValidateProductList()
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
      getDeviceRelInfoList(params).then(res => {
        if (res.code === 10000) {
          this.deviceList = res.data
          this.total = res.total
        }
        this.listLoading = false
      })
    },
    getValidateProductList() {
      const loading = this.$loading({
        lock: true,
        text: '正在加载产品数据……',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      getAllProducts().then(res => {
        if (res.code === 10000) {
          this.productList = res.data
        }
        loading.close()
      }).catch(() => {
        loading.close()
      })
    },
    // 获取产品数据
    getProductList() {
      getProducts({ pageIndex: 1, pageSize: 100000 }).then(res => {
        if (res.code === 10000) {
          this.productList = res.data
        }
      })
    },
    // 获取员工数据
    getUserList() {
      getStaffList({ pageIndex: 1, pageSize: 100000 }).then(res => {
        if (res.code === 10000) {
          this.userList = res.data
        }
      })
    },
    // 编辑(弹框)
    editInit(obj) {
      this.title = '修改绑定'
      this.device = { ...obj }
      this.dialogFormVisible = !this.dialogFormVisible
    },
    // 保存绑定
    saveOrUpdate() {
      bindDevice(this.device).then(res => {
        if (res.code === 10000) {
          this.dialogFormVisible = !this.dialogFormVisible
          this.$message({
            message: '保存成功！',
            type: 'success'
          })
          this.getDevices()
        }
      })
    },

    queryData(val) {
      this.filter.pageIndex = 1
      this.getDevices()
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

