<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="filter.orderNo" placeholder="订单编号" style="width: 200px;" class="filter-item" clearable />
      <el-input v-model="filter.customerName" placeholder="下单人" style="width: 200px;" class="filter-item" clearable />
      <el-input v-model="filter.createName" placeholder="制单人" style="width: 200px;" class="filter-item" clearable />
      <el-select v-model="filter.userType" placeholder="制单人类型" style="width: 200px;" class="filter-item" clearable>
        <el-option label="客户" :value="2" />
        <el-option label="员工" :value="1" />
      </el-select>
      <el-select v-model="filter.orderType" placeholder="销售类型" style="width: 200px;" class="filter-item" clearable>
        <el-option v-for="(orderType,index) in orderTypeList" :key="index" :label="orderType.name" :value="orderType.id" />
      </el-select>
      <el-select v-model="filter.status" placeholder="订单状态" style="width: 200px;" class="filter-item" clearable>
        <el-option v-for="(flow,index) in flowList" :key="index" :label="flow.workName" :value="flow.workStatus" />
      </el-select>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="getOrderList">查询</el-button>
      <el-button class="filter-item" icon="el-icon-plus" @click="addInit">创建订单</el-button>
    </div>

    <el-table :key="tableKey" v-loading="listLoading" :data="orderList" border fit highlight-current-row style="width: 100%;">
      <el-table-column type="selection" align="center" width="55" />
      <el-table-column type="index" width="50" align="center" />
      <el-table-column label="订单编号" prop="orderNo" align="center" sortable="custom" />
      <el-table-column label="下单人" prop="customerName" align="center" />
      <el-table-column label="销售类型" prop="orderTypeName" align="center">
        <template slot-scope="scope">
          <el-tag type="primary" size="mini">{{ scope.row.orderTypeName }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="制单人类型" prop="userTypeName" align="center" />
      <el-table-column label="制单人" prop="createBy" align="center" />
      <el-table-column label="总价(元)" prop="totalPrice" align="center" />
      <el-table-column label="状态" prop="statusName" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status == 3 ? 'info': 'success'" size="mini">{{ scope.row.statusName }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="下单时间" prop="orderTime" align="center" sortable="custom" width="180">
        <template slot-scope="scope">
          <i class="el-icon-time" /> {{ scope.row.orderTime }}
        </template>
      </el-table-column>

      <el-table-column label="操作" prop="id" sortable="custom" align="left" width="210">
        <template slot-scope="scope">
          <el-button size="mini" @click="detail(scope.row)">查看</el-button>
          <el-button v-if="scope.row.status == 0" type="primary" size="mini" @click="edit(scope.row)">编辑</el-button>
          <el-button v-if="scope.row.status == 2" type="warning" size="mini" @click="outStock(scope.row)">出库</el-button>
          <el-popover v-if="scope.row.status != 3" :ref="scope.row.id" placement="top" width="300" trigger="click">
            <p>确定要关闭该订单吗？关闭后，该订单将不再可操作!!</p>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="()=>{$refs[scope.row.id].doClose()}">取消</el-button>
              <el-button type="danger" size="mini" plain @click="close(scope.row)">确 定</el-button>
            </div>
            <el-button slot="reference" type="danger" size="mini">关闭</el-button>
          </el-popover>
        </template>
      </el-table-column>

    </el-table>
    <div class="block">
      <el-pagination v-show="total>0" :current-page="filter.pageIndex" :page-sizes="[10, 20, 50, 100]" :page-size="filter.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>

    <el-dialog title="添加出库记录" :visible.sync="showOutStock">
      <el-form :model="history">
        <el-form-item label="出库备注" :label-width="formLabelWidth">
          <el-input
            v-model="history.remark"
            autocomplete="off"
            placeholder="请输入出库备注"
            type="textarea"
            maxlength="500"
            show-word-limit
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showOutStock = false">取 消</el-button>
        <el-button type="primary" @click="saveHistory">保 存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getOrders, getOrderTypes, getOrderFlowNodes, closeOrder, addRemark } from '@/api/order'
export default {
  data() {
    return {
      listLoading: true,
      tableKey: 0,
      total: 0,
      filter: {
        pageIndex: 1,
        pageSize: 10
      },
      orderList: [],
      orderTypeList: [],
      flowList: [],
      formLabelWidth: '80px',
      showOutStock: false,
      history: {
        orderId: '',
        remark: ''
      }
    }
  },
  mounted() {
    this.getOrderList()
    this.getOrderTypeList()
    this.getFlowList()
  },
  methods: {
    getOrderList() {
      this.listLoading = true
      const params = {
        ...this.filter
      }
      getOrders(params).then(res => {
        if (res.code === 10000) {
          this.orderList = res.data
          this.total = res.total
        }
        this.listLoading = false
      })
    },
    getOrderTypeList() {
      getOrderTypes().then(res => {
        if (res.code === 10000) this.orderTypeList = res.data
      })
    },
    getFlowList() {
      getOrderFlowNodes().then(res => {
        if (res.code === 10000) this.flowList = res.data
      })
    },
    addInit() {
      this.$router.push({ name: 'OrderManageAdd' })
    },
    edit(obj) {
      this.$router.push({ name: 'OrderManageEdit', params: { id: obj.id }})
    },
    detail(obj) {
      this.$router.push({ name: 'OrderManageDetail', params: { id: obj.id }})
    },
    outStock(obj) {
      this.history.orderId = obj.id
      this.showOutStock = !this.showOutStock
    },
    saveHistory() {
      addRemark(this.history).then(res => {
        if (res.code === 10000) {
          this.$message({ message: '添加出库成功！', type: 'success' })
        }
        this.showOutStock = !this.showOutStock
      })
    },
    close(obj) {
      closeOrder(obj.id).then(res => {
        if (res.code === 10000) {
          this.$message({ message: '操作成功！', type: 'success' })
          this.getOrderList()
        }
      })
      this.$refs[obj.id].doClose()
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
.block{
  padding-top: 15px;
}
</style>
