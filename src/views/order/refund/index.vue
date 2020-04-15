<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="filter.orderNo" placeholder="订单编号" style="width: 200px;" class="filter-item" clearable />
      <el-select v-model="filter.customerName" filterable remote clearable :remote-method="fetchCustomer" placeholder="客户" @change="queryData">
        <el-option v-for="customer in customerList" :key="customer.id" :value="customer.userName" :label="customer.userName" />
      </el-select>
      <!-- <el-input v-model="filter.customerName" placeholder="客户" style="width: 200px;" class="filter-item" clearable /> -->
      <el-input v-model="filter.productNo" placeholder="产品编号" style="width: 200px;" class="filter-item" clearable />
      <el-input v-model="filter.productName" placeholder="产品名称" style="width: 200px;" class="filter-item" clearable />
      <el-date-picker v-model="filter.queryDate" clearable class="filter-item" value-format="yyyy-MM-dd" :format="'yyyy-MM-dd'" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" />
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="queryData">查询</el-button>
      <el-button class="filter-item" @click="addReturn()">添加退筒</el-button>
    </div>

    <el-form :inline="true" :model="batchData" size="mini" class="batchData">
      <el-form-item label="已选择产品:">
        <span> {{ batchData.productNumber }}</span>
      </el-form-item>
      <el-form-item label="可退筒个数:">
        <span>{{ batchData.acceptableNumber }}</span>
      </el-form-item>
      <el-form-item label="退筒总个数:">
        <el-input v-model="batchData.returnNumber" placeholder="请输入想要退筒的个数" />
      </el-form-item>
      <el-form-item label="总重量:">
        <el-input v-model="batchData.returnWeight1" placeholder="请输入想要退筒的重量" />
      </el-form-item>
      <el-form-item label="皮量:">
        <el-input v-model="batchData.returnWeight2" placeholder="请输入想要退筒的重量" />
      </el-form-item>
      <el-form-item label="退筒净重:">
        <span>{{ returnWeight }}</span>
      </el-form-item>
      <el-form-item>
        <el-button type="success" @click="batchSubmit()">批量退筒</el-button>
      </el-form-item>
    </el-form>

    <el-checkbox v-model="filter.isNeedFlag" @change="showAll">显示已退</el-checkbox>

    <el-table :key="tableKey" v-loading="listLoading" :data="orderList" border style="width: 100%;" @selection-change="selectTable">
      <!-- <el-table-column type="selection" align="center" width="55" /> -->
      <el-table-column type="selection" width="55" :selectable="(row, index)=>{ return row.checkOutNumber === row.returnNumber ? false : true}" />
      <!-- <el-table-column type="index" width="50" align="center" /> -->
      <el-table-column label="订购日期" prop="orderTime" align="center" width="120">
        <template slot-scope="scope">
          <div>
            {{ scope.row.orderTime | moment('YYYY-MM-DD') }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="订单编号" prop="orderNo" align="center" width="140" />
      <el-table-column label="客户" prop="customerName" align="center" />
      <el-table-column label="产品编号/名称" prop="userTypeName" align="center" width="180" show-overflow-tooltip>
        <template slot-scope="scope">
          <div>
            {{ `${ scope.row.productNo} / ${ scope.row.productName}` }}
          </div>
        </template></el-table-column>
      <el-table-column label="要求" prop="requirement" align="center" />
      <el-table-column label="宽度" prop="productWidth" align="center" />
      <el-table-column label="克重" prop="productWeight" align="center" />
      <el-table-column label="个数" prop="goodsNumber" align="center" />
      <el-table-column label="已出库" prop="checkOutNumber" align="center" />
      <el-table-column label="单价" prop="price" align="center" />
      <el-table-column label="退筒个数" prop="returnNumber" align="center" />
      <el-table-column label="退筒重量(KG)" prop="returnWeight" align="center" width="120" />
      <el-table-column label="退筒金额" prop="returnPrice" align="center" />
      <el-table-column label="备注" prop="remark" align="center" />
    </el-table>
    <div class="block">
      <el-pagination v-show="total>0" :current-page="filter.pageIndex" :page-sizes="[10, 20, 50, 100]" :page-size="filter.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>
  </div>
</template>

<script>
import {
  returnOrderDetailList
} from '@/api/order'
import {
  getUsers
} from '@/api/user'
export default {
  data() {
    return {
      listLoading: true,
      tableKey: 0,
      total: 0,
      customerList: [],
      filter: {
        isNeedFlag: true,
        queryDate: [],
        pageIndex: 1,
        pageSize: 10
      },
      orderList: [],
      returnList: [],
      batchData: {
        productNumber: 0,
        acceptableNumber: 0,
        returnNumber: 0,
        returnWeight: 0,
        returnWeight1: 0,
        returnWeight2: 0
      }
    }
  },
  computed: {
    returnWeight() {
      let weight = 0
      if (this.batchData.returnWeight1 >= 0) {
        weight = this.batchData.returnWeight1 - this.batchData.returnWeight2
      }
      return weight
    }
  },
  created() {
    this.filter = JSON.parse(sessionStorage.getItem('returnOrderDetailList')).params === undefined ? {
      pageIndex: 1,
      pageSize: 10
    } : JSON.parse(sessionStorage.getItem('returnOrderDetailList')).params
  },
  mounted() {
    this.getOrderList()
  },
  methods: {
    // 搜索客户
    fetchCustomer(keywords) {
      const option = {
        userType: '2',
        userName: keywords,
        departmentId: null,
        pageIndex: 1,
        pageSize: 10000000
      }
      getUsers(option).then(res => {
        this.customerList = res.data
      })
    },
    selectTable(select) {
      this.batchData.productNumber = select.length // 退筒个数;
      let tempNumber = 0
      select.length && select.map(item => {
        tempNumber = tempNumber + (item.checkOutNumber - item.returnNumber)
      })
      this.batchData.acceptableNumber = tempNumber
      this.returnList = select
      window.localStorage.setItem('returnList', JSON.stringify(select))
    },
    batchSubmit() {
      this.batchData.returnWeight = this.batchData.returnWeight1 - this.batchData.returnWeight2
      if (this.returnList.length < 1) {
        this.$notify({
          title: '提示',
          message: '您还未选择任何数据',
          type: 'warning'
        })
        return
      }
      const customerId = this.returnList[0].customerId
      const status = this.returnList && this.returnList.some(item => {
        return customerId !== item.customerId
      })
      if (status) {
        this.$notify({
          title: '提示',
          message: '请先过滤客户信息',
          type: 'warning'
        })
        return
      } else if (this.batchData.acceptableNumber === 0) {
        this.$notify({
          title: '提示',
          message: '没有选择可退产品！！',
          type: 'warning'
        })
        return
      } else if (this.batchData.acceptableNumber < this.batchData.returnNumber) {
        this.$notify({
          title: '提示',
          message: '您选择的产品达不到您批量退筒的个数',
          type: 'warning'
        })
        return
      } else if (this.batchData.returnWeight <= 0) {
        this.$notify({
          title: '提示',
          message: '退筒净重不能为空！！',
          type: 'warning'
        })
        return
      }
      this.$router.push({
        name: 'OrderRefundBatch',
        params: {
          number: this.batchData.returnNumber,
          weight: this.batchData.returnWeight
        }
      })
    },
    addReturn() {
      if (this.returnList.length < 1) {
        this.$notify({
          title: '提示',
          message: '您还未选择任何数据',
          type: 'warning'
        })
        return
      }
      const customerId = this.returnList[0].customerId
      const status = this.returnList && this.returnList.some(item => {
        return customerId !== item.customerId
      })
      if (status) {
        this.$notify({
          title: '提示',
          message: '请先过滤客户信息',
          type: 'warning'
        })
        return
      } else if (this.returnList.length > 0 && this.returnList.length <= 5) {
        this.$router.push({
          name: 'OrderRefundAdd'
        })
      } else if (this.returnList.length > 5) {
        this.$notify({
          title: '提示',
          message: '一次不得超过5个产品',
          type: 'warning'
        })
      } else {
        this.$notify({
          title: '提示',
          message: '您还没有选择需要退筒的产品',
          type: 'warning'
        })
      }
    },
    getOrderList() {
      this.listLoading = true
      const params = {
        ...this.filter
      }
      sessionStorage.setItem('returnOrderDetailList', JSON.stringify({
        params: {
          ...this.filter
        }
      }))
      returnOrderDetailList(params).then(res => {
        if (res.code === 10000) {
          this.orderList = res.data
          this.total = res.total
        }
        this.listLoading = false
        window.localStorage.removeItem('returnList')
      })
    },
    showAll() {
      this.getOrderList()
    },
    queryData() {
      this.filter.pageIndex = 1
      this.getOrderList()
    },
    handleSizeChange(val) {
      this.filter.pageSize = val
      this.getOrderList()
    },
    handleCurrentChange(val) {
      this.filter.pageIndex = val
      this.getOrderList()
    }
  }
}
</script>

<style lang="scss" scoped>
.batchData {
    span {
        font-size: 14px;
        font-weight: 600;
        color: #409EFF;
    }
}

.block {
    padding-top: 15px;
}
</style>
