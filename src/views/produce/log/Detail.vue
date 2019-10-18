<template>
  <div class="app-container">
    <el-button size="mini" class="filter-item" icon="el-icon-plus" @click="addInit">增加</el-button>
    <el-button size="mini" class="filter-item" icon="el-icon-back" @click="$router.back()">返回</el-button>
    <div v-loading="listLoading" style="margin-top:20px;">
      <el-table v-if="!!tempData" :data="tempData" border>
        <el-table-column type="index" width="50" align="center" />
        <el-table-column prop="className" label="班次" align="center" width="50" />
        <el-table-column prop="productDate" label="日期" align="center" width="100" />
        <el-table-column prop="deviceNo" label="机号" align="center" width="100" />
        <el-table-column prop="staffNumber" label="员工编号" align="center" width="140" />
        <el-table-column prop="staffName" label="姓名" align="center" width="100" />
        <el-table-column prop="productName" label="名称" align="center" width="100" />
        <el-table-column prop="requirement" label="要求" align="center" width="120" />
        <el-table-column prop="productWidth" label="宽" align="center" width="40" />
        <el-table-column prop="productWeight" label="克重" align="center" width="50" />
        <el-table-column prop="productLength" label="米数" align="center" width="80" />
        <el-table-column prop="totalWeight" label="重量/公斤" align="center" width="90" />
        <el-table-column prop="realWeight" label="实际克重" align="center" width="80" />
        <el-table-column prop="diffWeight" label="克重差" align="center" width="70" />
        <el-table-column prop="salaryRate" label="工资率" align="center" width="80" />
        <el-table-column prop="salary" label="工资" align="center" width="70" />
        <el-table-column prop="bonus" label="奖金" align="center" width="70" />
        <el-table-column prop="penalty" label="罚款" align="center" width="70" />
        <el-table-column prop="realSalary" label="实际工资" align="center" width="80" />
      </el-table>
    </div>

    <el-dialog title="创建日志" :visible.sync="dialogFormVisible" :close-on-click-modal="false">
      <el-form :model="logInfo">
        <el-form-item label="班次" :label-width="formLabelWidth">
          <el-select v-model="logInfo.classId" style="width:100%" @change="changeClass">
            <el-option label="甲班" :value="1" />
            <el-option label="乙班" :value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="生产日期" :label-width="formLabelWidth">
          <el-date-picker v-model="logInfo.productDate" style="width:100%" readonly value-format="yyyy-MM-dd" format="yyyy-MM-dd" type="date" placeholder="选择日期" />
        </el-form-item>
        <el-form-item label="员工编号" :label-width="formLabelWidth">
          <el-input v-model="logInfo.staffNumber" autocomplete="off" disabled />
        </el-form-item>
        <el-form-item label="姓名" :label-width="formLabelWidth">
          <el-select v-model="logInfo.staffId" style="width:100%" filterable @change="changeUser">
            <el-option v-for="user in userList" :key="user.id" :value="user.id" :label="user.userName" />
          </el-select>
        </el-form-item>
        <el-form-item label="机台号" :label-width="formLabelWidth">
          <el-select v-model="logInfo.deviceNo" placeholder="请选择" style="width:100%">
            <el-option v-for="item in deviceList" :key="item.deviceNumber" :label="item.deviceName" :value="item.deviceNumber" />
          </el-select>
        </el-form-item>
        <el-form-item label="产品名称" :label-width="formLabelWidth">
          <el-select v-model="logInfo.productId" style="width:100%" filterable @change="changeProduct">
            <el-option v-for=" product in productList" :key="product.id" :label="`${product.name}/${product.productNo}`" :value="product.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="要求" :label-width="formLabelWidth">
          <el-input v-model="logInfo.requirement" autocomplete="off" readonly />
        </el-form-item>
        <el-form-item label="宽度" :label-width="formLabelWidth">
          <el-input v-model="logInfo.productWidth" autocomplete="off" readonly />
        </el-form-item>
        <el-form-item label="克重" :label-width="formLabelWidth">
          <el-input v-model="logInfo.productWeight" autocomplete="off" readonly />
        </el-form-item>
        <el-form-item label="转数" :label-width="formLabelWidth">
          <el-input v-model="logInfo.deviceTurnNumber" type="number" autocomplete="off" />
        </el-form-item>
        <el-form-item label="米数" :label-width="formLabelWidth">
          <el-input v-model="productLength" autocomplete="off" type="number" readonly />
        </el-form-item>
        <el-form-item label="重量/公斤" :label-width="formLabelWidth">
          <el-input v-model="logInfo.totalWeight" type="number" autocomplete="off" />
        </el-form-item>
        <el-form-item label="实际克重" :label-width="formLabelWidth">
          <el-input v-model="realWeight" autocomplete="off" type="number" readonly />
        </el-form-item>
        <el-form-item label="克重差" :label-width="formLabelWidth">
          <el-input v-model="diffWeight" type="number" autocomplete="off" readonly />
        </el-form-item>
        <el-form-item label="工资率" :label-width="formLabelWidth">
          <el-input v-model="logInfo.salaryRate" type="number" autocomplete="off" />
        </el-form-item>
        <el-form-item label="工资" :label-width="formLabelWidth">
          <el-input v-model="salary" type="number" autocomplete="off" />
        </el-form-item>
        <el-form-item label="奖金" :label-width="formLabelWidth">
          <el-input v-model="logInfo.bonus" type="number" autocomplete="off" />
        </el-form-item>
        <el-form-item label="罚款" :label-width="formLabelWidth">
          <el-input v-model="logInfo.penalty" type="number" autocomplete="off" />
        </el-form-item>
        <el-form-item label="实际工资" :label-width="formLabelWidth">
          <el-input v-model="realSalary" autocomplete="off" readonly />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveData">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getStaffProductRecordsByFileId,
  submitOneStaffProductRecord
} from '@/api/produce'
import {
  getStaffsByClassId
} from '@/api/user'
import {
  getValidateProducts
} from '@/api/product'
import {
  getDevicesByUserId
} from '@/api/device'
export default {
  data() {
    return {
      listLoading: true,
      tempData: null,
      spanArr: [],
      dialogFormVisible: false,
      formLabelWidth: '90px',
      logInfo: {

      },
      userList: [],
      deviceList: [],
      productList: [],
      p1: 0.49,
      p2: 0.0000098

    }
  },
  computed: {
    diffWeight() {
      const that = this
      if (that.logInfo.productWeight && that.realWeight) {
        that.logInfo.diffWeight = (that.logInfo.productWeight - that.realWeight).toFixed(2)
        return that.logInfo.diffWeight
      } else {
        that.logInfo.diffWeight = null
        return that.logInfo.diffWeight
      }
    },
    salary() {
      const that = this
      if (that.logInfo.productLength && that.logInfo.salaryRate) {
        that.logInfo.salary = (that.logInfo.productLength * that.logInfo.salaryRate).toFixed(0)
        return that.logInfo.salary
      } else {
        that.logInfo.salary = null
        return that.logInfo.salary
      }
    },
    realSalary() {
      const that = this
      if (that.logInfo.productLength && that.logInfo.salaryRate) {
        that.logInfo.realSalary = ((that.logInfo.productLength * that.logInfo.salaryRate + (that.logInfo.bonus ? parseFloat(that.logInfo.bonus) : 0) - (that.logInfo.penalty ? parseFloat(that.logInfo.penalty) : 0))).toFixed(2)
        return that.logInfo.realSalary
      } else {
        that.logInfo.realSalary = null
        return that.logInfo.realSalary
      }
    },
    productLength() {
      const that = this
      if (that.logInfo.deviceTurnNumber) {
        that.logInfo.productLength = (that.logInfo.deviceTurnNumber * that.p1).toFixed(2)
        return that.logInfo.productLength
      } else {
        that.logInfo.realSalary = null
        return that.logInfo.productLength
      }
    },
    realWeight() {
      const that = this
      if (that.logInfo.totalWeight && that.logInfo.productWidth && that.logInfo.deviceTurnNumber) {
        that.logInfo.realWeight = (that.logInfo.totalWeight / that.logInfo.productWidth / that.logInfo.deviceTurnNumber / that.p2).toFixed(2)
        return that.logInfo.realWeight
      } else {
        that.logInfo.realSalary = null
        return that.logInfo.realWeight
      }
    }
  },
  mounted() {
    this.getDataById(this.$route.params.id)
    this.getValidateProductList()
  },
  methods: {
    getDataById(id) {
      this.listLoading = true
      getStaffProductRecordsByFileId(id).then(res => {
        this.listLoading = !this.listLoading
        if (res.code === 10000) {
          this.tempData = res.data
        } else {
          this.$message({
            message: res.message,
            type: 'error'
          })
        }
      })
    },
    addInit() {
      this.logInfo = {
        fileId: this.$route.params.id,
        productDate: this.$route.params.reportTime,
        staffNumber: '',
        staffId: '',
        deviceNo: '',
        bonus: 0,
        penalty: 0
      }
      this.dialogFormVisible = !this.dialogFormVisible
    },
    changeClass() {
      this.userList = []
      this.logInfo.staffNumber = ''
      this.logInfo.staffId = ''
      this.logInfo.deviceNo = ''
      this.$loading({
        lock: true,
        text: '正在加载员工数据，请稍后……',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      getStaffsByClassId(this.logInfo.classId).then(res => {
        if (res.code === 10000) {
          this.userList = res.data
        }
        this.$loading().close()
      }).catch(err => {
        this.$message({
          message: err.message,
          type: 'error'
        })
        this.$loading().close()
      })
    },
    changeUser() {
      this.logInfo.deviceNo = ''
      getDevicesByUserId(this.logInfo.staffId).then(res => {
        if (res.code === 10000) {
          this.deviceList = res.data
        }
      })
      this.userList.some(item => {
        if (item.id === this.logInfo.staffId) {
          this.logInfo.staffNumber = item.jobNumber
        }
      })
    },
    changeDevice() {
      console.log(this.logInfo.deviceNo)
    },
    changeProduct() {
      this.productList.some(item => {
        if (item.id === this.logInfo.productId) {
          this.logInfo.requirement = item.requirement
          this.logInfo.productWidth = item.width
          this.logInfo.productWeight = item.weight
        }
      })
    },
    getValidateProductList() {
      getValidateProducts().then(res => {
        if (res.code === 10000) this.productList = res.data
      })
    },
    saveData() {
      submitOneStaffProductRecord(this.logInfo).then(res => {
        if (res.code === 10000) {
          this.getDataById(this.$route.params.id)
          this.$message({
            message: '新增成功！',
            type: 'success'
          })
          this.dialogFormVisible = !this.dialogFormVisible
        } else {
          this.$message({
            message: res.message,
            type: 'error'
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.el-table .warning-row {
    background: oldlace;
}

.el-table .success-row {
    background: #f0f9eb;
}
</style>
