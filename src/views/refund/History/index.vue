<template>
<div class="app-container">
    <div class="filter-container">
        <el-input v-model="filter.refundNo" placeholder="退筒单号" style="width: 200px;" class="filter-item" clearable />
        <el-select v-model="filter.customerId" :loading="showCustomer" filterable default-first-option clearable placeholder="客户" @change="queryData">
            <el-option v-for="customer in customerList" :key="customer.id" :value="customer.id" :label="customer.userName" />
        </el-select>
        <el-date-picker v-model="filter.queryDate" clearable class="filter-item" value-format="yyyy-MM-dd" :format="'yyyy-MM-dd'" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" />
        <el-button class="filter-item" type="primary" icon="el-icon-search" @click="queryData">查询</el-button>
    </div>

    <el-table v-loading="listLoading" :data="dataList" border style="width: 100%;" size="mini">
        <el-table-column label="退筒时间" prop="refundTime" align="center" width="160" />
        <el-table-column label="退筒单号" prop="refundNo" align="center" width="120">
            <template slot-scope="{row}">
                <div>
                    <el-button slot="reference" type="text" size="mini">{{row.refundNo}}</el-button>
                </div>
            </template>
        </el-table-column>
        <el-table-column label="客户" prop="customerName" align="center" width="180" show-overflow-tooltip />
        <el-table-column label="品名" prop="userTypeName" align="center" show-overflow-tooltip>
            <template slot-scope="{row}">
                <div>
                    {{row.description}}
                </div>
            </template></el-table-column>

        <el-table-column label="总个数" prop="returnNumber" align="center" width="80" />
        <el-table-column label="总重量(KG)" prop="returnWeight" align="center" width="120" />
        <el-table-column label="总金额" prop="returnAmount" align="left" width="280">
            <template slot-scope="{row}">
                <div>
                    <span style="color:#f40f40">{{row.returnAmount}} 元</span>
                    大写:【{{row.returnAmount | capitalAmount}}】
                </div>
            </template>
        </el-table-column>
        <el-table-column label="备注" prop="remark" align="left" />
        <el-table-column label="制单人" prop="createByName" align="center" width="80" />
        <el-table-column label="操作" align="center" width="220">
            <template slot-scope="{row}">
                <el-button slot="reference" type="text" icon="el-icon-zoom-in">明细</el-button>
                <el-divider direction="vertical"></el-divider>
                <el-popconfirm :key="row.id" confirm-button-text="确定" confirm-button-type="danger" cancel-button-text="取消" icon="el-icon-info" icon-color="red" title="您确定要删除该退筒单吗?" @onConfirm="handleDelete(row)">
                    <el-button slot="reference" type="text" icon="el-icon-delete" size="small">
                        删除
                    </el-button>
                </el-popconfirm>
                <el-divider direction="vertical"></el-divider>
                <el-button slot="reference" type="text" size="small" icon="el-icon-printer">打印</el-button>
            </template>
        </el-table-column>
    </el-table>
    <div class="block">
        <el-pagination v-show="total>0" :current-page="filter.pageIndex" :page-sizes="[15, 30, 50, 100]" :page-size="filter.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>
</div>
</template>

<script>
import {
  refundList,
  cancelRefund,
  getRefundOrderDetails
} from '@/api/refund'
import {
  getCustomes
} from '@/api/user'

export default {
  name: '',
  data() {
    return {
      showCustomer: true,
      customerList: [],
      filter: {
        refundNo: null,
        customerId: null,
        queryDate: [],
        pageIndex: 1,
        pageSize: 15
      },
      listLoading: false,
      dataList: [],
      total: 0
    }
  },
  mounted() {
    this.fetchCustomer()
    this.getDataList()
  },
  methods: {
    // 搜索客户
    fetchCustomer() {
      this.customerList = []
      getCustomes().then(res => {
        this.customerList = res.data
        this.showCustomer = !this.showCustomer
      })
    },
    getDataList() {
      this.listLoading = !this.listLoading
      refundList(this.filter).then(res => {
        this.dataList = res.data
        this.total = res.total
        this.listLoading = !this.listLoading
      }).catch(err => {
        this.$message({
          message: err.message,
          type: 'error'
        })
        this.listLoading = !this.listLoading
      })
    },
    handleDelete(obj) {
      cancelRefund(obj.id).then(res => {
        this.$message({
          type: 'success',
          message: res.message
        })
        this.getDataList()
      })
    },

    // 根据ID获取明细
    getDetailListById(id) {
      getRefundOrderDetails(id).then(res => {
        console.log(res.data)
      })
    },

    queryData() {
      this.filter.pageIndex = 1
      this.getDataList()
    },
    handleSizeChange(val) {
      this.filter.pageSize = val
      this.getDataList()
    },
    handleCurrentChange(val) {
      this.filter.pageIndex = val
      this.getDataList()
    }
  }
}
</script>

<style lang="scss">

</style>
