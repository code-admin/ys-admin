<template>
  <div class="app-container">

    <div class="filter-container">
      <el-input v-model="filter.orderNo" placeholder="流水号" style="width: 200px;" class="filter-item" clearable />
      <el-input v-model="filter.customerName" placeholder="客户名称" style="width: 200px;" class="filter-item" clearable />
      <!-- <el-input v-model="filter.createName" placeholder="制单人" style="width: 200px;" class="filter-item" clearable /> -->
      <el-select v-model="filter.feeType" placeholder="收款类型" style="width: 200px;" class="filter-item" clearable>
        <el-option label="收袋款" :value="1" />
        <el-option label="其他款" :value="2" />
        <el-option label="退筒单" :value="5" />
      </el-select>
      <el-date-picker v-model="filter.queryDate" clearable class="filter-item" value-format="yyyy-MM-dd" :format="'yyyy-MM-dd'" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" />
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="queryData">查询</el-button>
      <el-button class="filter-item" icon="el-icon-plus" @click="editInit">新增收款</el-button>
      <router-link :to="{name:'BillReceiptAddReturn'}">
        <el-button class="filter-item" icon="el-icon-plus"> 新增退筒单据</el-button>
      </router-link>
    </div>

    <div class="total-data">
      <el-row :gutter="5">
        <el-col :span="4">
          <div>
            <span>
              总金额:
            </span>
            <span>
              {{ summary.totalBillAmount }}
            </span>
          </div>
        </el-col>
      </el-row>
    </div>

    <el-table v-loading="listLoading" :data="billList" border>
      <!-- <el-table-column type="index" width="50" align="center" /> -->
      <!-- <el-table-column :type="feeType === 5 ? 'selection' : null" width="55" /> -->
      <el-table-column type="selection" width="55" />
      <el-table-column label="流水号" prop="billNo" align="center" width="140" />
      <el-table-column label="日期" prop="collectionTime" align="center" width="120">
        <template slot-scope="scope">
          {{ scope.row.collectionTime | moment('YYYY-MM-DD') }}
        </template>
      </el-table-column>
      <el-table-column label="客户" prop="userName" align="center" width="120" />
      <el-table-column label="单据类型" prop="feeTypeName" align="center" width="80">
        <template slot-scope="scope">
          <div>
            <el-tag v-if="scope.row.feeType === 1" size="mini">{{ scope.row.feeTypeName }}</el-tag>
            <el-tag v-if="scope.row.feeType === 2" size="mini" type="info">{{ scope.row.feeTypeName }}</el-tag>
            <el-tag v-if="scope.row.feeType === 5" size="mini" type="danger">{{ scope.row.feeTypeName }}</el-tag>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="品名" prop="productName" align="center" width="150" show-overflow-tooltip />
      <el-table-column label="要求" prop="requirement" align="center" width="150" show-overflow-tooltip />
      <el-table-column label="宽度" prop="width" align="center" width="150" />
      <el-table-column label="克重" prop="weight" align="center" width="150" />
      <el-table-column label="长度" prop="goodsLength" align="center" width="150" />
      <el-table-column label="个" prop="goodsNumber" align="center" width="150" />
      <el-table-column label="条数" prop="productNumber" align="center" width="150" />
      <el-table-column label="单价" prop="price" align="center" width="150" />
      <el-table-column label="重量" prop="netWeight" align="center" width="150" />
      <el-table-column label="车皮" prop="tareWeight" align="center" width="150" />

      <el-table-column label="金额(元)" prop="amount" align="center" width="150">
        <template slot-scope="scope">
          <div v-if="scope.row.feeType === 5" :class="'decrease'">
            {{ - scope.row.amount }}
          </div>
          <div v-else :class=" scope.row.amount > 0 ? 'increase' : 'decrease'">
            {{ scope.row.amount }}
          </div>
        </template>
      </el-table-column>
      <!-- <el-table-column label="记录时间" prop="createTime" align="center" width="180">
        <template slot-scope="scope">
          <i class="el-icon-time" /> {{ scope.row.createTime }}
        </template>
      </el-table-column> -->
      <el-table-column label="备注" prop="remark" align="center" show-overflow-tooltip />
      <el-table-column label="操作" prop="id" align="center" width="100">
        <template slot-scope="scope">
          <!-- <el-button v-if="scope.row.status == 0" type="primary" size="mini" @click="edit(scope.row)">编辑</el-button> -->
          <el-popover :ref="scope.row.id" placement="top" width="300" trigger="click">
            <p>确定要删除该笔收款吗！！？</p>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="()=>{$refs[scope.row.id].doClose()}">取消</el-button>
              <el-button type="danger" size="mini" plain @click="deleteBill(scope.row)">确 定</el-button>
            </div>
            <el-button v-if="scope.row.status !== 5" slot="reference" type="danger" size="mini">删除</el-button>
          </el-popover>
        </template>
      </el-table-column>

    </el-table>
    <div class="block">
      <el-pagination v-show="total>0" :current-page="filter.pageIndex" :page-sizes="[10, 20, 50, 100]" :page-size="filter.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>

    <el-dialog title="添加收款" :visible.sync="dialogFormVisible">
      <el-form :model="bill">
        <el-form-item label="收款日期" :label-width="formLabelWidth">
          <el-date-picker v-model="bill.collectionTime" type="date" value-format="yyyy-MM-dd" format="yyyy-MM-dd" placeholder="选择收款日期" />
        </el-form-item>
        <el-form-item label="收款类型" :label-width="formLabelWidth">
          <el-select v-model="bill.feeType" placeholder="请选择活动区域" @change="bill.amount = null">
            <el-option label="收袋款" :value="1" />
            <el-option label="其他款" :value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="付款人(客户)" :label-width="formLabelWidth">
          <el-select v-model="bill.userId" placeholder="请选择付款人(客户)" filterable>
            <el-option v-for="user in customeList" :key="user.loginName" :label="user.userName" :value="user.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="收款金额(元)" :label-width="formLabelWidth">
          <el-input-number v-model="bill.amount" controls-position="right" /> <span v-if="bill.amount" class="amount">{{ bill.amount }} ¥</span>
        </el-form-item>
        <el-form-item label="备注" :label-width="formLabelWidth">
          <el-input v-model="bill.remark" type="textarea" placeholder="请输入备注" maxlength="100" show-word-limit />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveBill">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getCustomes
} from '@/api/user'
import {
  getOrderBillList,
  submitOrderBill,
  deleteOrderBillById
} from '@/api/bill'
export default {
  data() {
    return {
      listLoading: true,
      dialogFormVisible: false,
      total: 0,
      filter: {
        queryDate: [],
        pageIndex: 1,
        pageSize: 10
      },
      billList: [],
      summary: {},
      customeList: [],
      bill: {
        collectionTime: null
      },
      formLabelWidth: '100px'

    }
  },
  mounted() {
    this.getBillList()
    this.getCustomeList()
  },
  methods: {
    getBillList() {
      this.listLoading = true
      getOrderBillList(this.filter).then(res => {
        if (res.code === 10000) {
          this.billList = res.data
          this.summary = res.summary
          this.total = res.total
        }
        this.listLoading = false
      })
    },
    getCustomeList() {
      getCustomes().then(res => {
        if (res.code === 10000) this.customeList = res.data
      })
    },

    editInit() {
      const date = new Date()
      this.bill = {
        feeType: 1,
        collectionTime: `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
      }
      this.dialogFormVisible = !this.dialogFormVisible
    },
    saveBill() {
      submitOrderBill(this.bill).then(res => {
        if (res.code === 10000) {
          this.$message({
            message: '保存成功！',
            type: 'success'
          })
          this.getBillList()
          this.dialogFormVisible = !this.dialogFormVisible
        }
      })
    },
    deleteBill(obj) {
      console.log(obj)
      deleteOrderBillById(obj.id).then(res => {
        if (res.code === 10000) {
          this.$message({
            message: '操作成功！',
            type: 'success'
          })
          this.getBillList()
        }
      })
      this.$refs[obj.id].doClose()
    },
    queryData() {
      this.filter.pageIndex = 1
      this.getBillList()
    },
    handleSizeChange(val) {
      this.filter.pageSize = val
      this.getBillList()
    },
    handleCurrentChange(val) {
      this.filter.pageIndex = val
      this.getBillList()
    }

  }
}
</script>

<style lang="scss" scoped>
.block {
    padding-top: 15px;
}

.increase {
    color: #67C23A;
}

.decrease {
    color: #f40;
}

.total-data {
    line-height: 38px;
    font-size: 14px;
    color: #909399;
}
</style>
