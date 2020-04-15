<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="filter.orderNo" placeholder="订单编号" style="width: 200px;" class="filter-item" clearable />
      <el-select v-model="filter.customerName" filterable remote clearable :remote-method="fetchCustomer" placeholder="客户" @change="queryData">
        <el-option v-for="customer in customerList" :key="customer.id" :value="customer.userName" :label="customer.userName" />
      </el-select>
      <!-- <el-input v-model="filter.customerName" placeholder="客户" style="width: 200px;" class="filter-item" clearable /> -->
      <el-input v-model="filter.createName" placeholder="制单人" style="width: 200px;" class="filter-item" clearable />
      <el-select v-model="filter.makingType" placeholder="单据类型" style="width: 200px;" class="filter-item" clearable>
        <el-option label="销售单" :value="1" />
        <el-option label="退货单" :value="2" />
      </el-select>
      <el-select v-model="filter.userType" placeholder="制单人类型" style="width: 200px;" class="filter-item" clearable>
        <el-option label="客户" :value="2" />
        <el-option label="员工" :value="1" />
      </el-select>
      <el-select v-model="filter.orderType" placeholder="销售类型" style="width: 200px;" class="filter-item" clearable>
        <el-option v-for="(orderType,index) in orderTypeList" :key="index" :label="orderType.name" :value="orderType.id" />
      </el-select>
      <el-select v-model="filter.status" placeholder="订单状态" style="width: 200px;" class="filter-item" clearable>
        <el-option label="全部" :value="null" />
        <el-option v-for="(flow,index) in flowList" :key="index" :label="flow.workName" :value="flow.workStatus" />
      </el-select>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="queryData">查询</el-button>
      <router-link :to="{ name: 'OrderManageAdd' }">
        <el-button class="filter-item" icon="el-icon-plus">创建销售单</el-button>
      </router-link>
      <router-link :to="{ name: 'OrderManageReturnAdd'}">
        <el-button class="filter-item" icon="el-icon-plus">创建退货单</el-button>
      </router-link>
    </div>

    <div class="total-data">
      <el-row :gutter="5">
        <el-col :span="4">
          <div>
            <span>总 订/退 购产品数:</span>
            <span>{{ summary.totalOrderExts }}</span>
          </div>
        </el-col>
        <el-col :span="4">
          <div>
            <span>总 出/入库数:</span>
            <span>{{ summary.totalOrderExpresses }}</span>
          </div>
        </el-col>
        <el-col :span="4">
          <div>
            <span>总 金额:</span>
            <span>{{ summary.totalAmount }}</span>
          </div>
        </el-col>
      </el-row>
    </div>

    <el-table :key="tableKey" v-loading="listLoading" show-summary :data="orderList" border fit highlight-current-row style="width: 100%;">
      <el-table-column type="index" width="50" align="center" />
      <el-table-column label="订单号" prop="orderNo" align="center" width="140">
        <template slot-scope="scope">
          <el-button type="text" @click="detail(scope.row)">{{ scope.row.orderNo }}</el-button>
        </template>
      </el-table-column>
      <el-table-column label="客户" prop="customerName" align="center" />
      <el-table-column label="单据类型" prop="makingTypeName" align="center">
        <template slot-scope="scope">
          <el-tag :type=" scope.row.makingType === 1 ? 'primary' : 'danger'" size="mini">{{ scope.row.makingTypeName }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="制单人类型" prop="userTypeName" align="center" width="100" />
      <el-table-column label="制单人" prop="createBy" align="center" />
      <el-table-column label="订/退 购产品" prop="createBy" align="center">
        <template slot-scope="scope">
          <el-popover placement="right" width="300px" trigger="click" @show="getDetailById(scope.row.id)">
            <div v-loading="!orderInfo.orderExts">
              <el-table v-if="!!orderInfo.orderExts" :data="orderInfo.orderExts">
                <el-table-column prop="requirement" label="产品编号/名称" align="center" show-overflow-tooltip width="150">
                  <template slot-scope="scoped">
                    <el-tag type="info" size="mini">{{ `${scoped.row.product && scoped.row.product.productNo} / ${scoped.row.product && scoped.row.product.name}` }}</el-tag>
                  </template>
                </el-table-column>
                <el-table-column prop="requirement" label="要求" show-overflow-tooltip align="center" />
                <el-table-column prop="width" label="宽度(cm)" align="center" />
                <el-table-column prop="weight" label="克重(g)" align="center" />
                <el-table-column v-if="orderInfo && orderInfo.orderType === 2" prop="goodsNumber" label="个数" align="center" />
                <el-table-column v-if="orderInfo && orderInfo.orderType === 1" prop="goodsLength" label="长度(cm)" align="center" />
                <el-table-column v-if="orderInfo && orderInfo.orderType === 1" prop="goodsNumber" label="条数" align="center" />
                <el-table-column prop="totalDeliveryNumber" label="已出库" align="center" />

                <el-table-column prop="price" label="单价(吨)" align="center">
                  <template slot-scope="scoped">
                    <div v-if="scoped.row.price" style="color:#f40;">{{ scoped.row.price }} ¥</div>
                  </template>
                </el-table-column>
                <el-table-column prop="remark" label="备注" align="center" show-overflow-tooltip />
              </el-table>
            </div>
            <el-button slot="reference" type="text" size="mini">{{ scope.row.orderExtNumber }}</el-button>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="出/入 库记录" prop="createBy" align="center">
        <template slot-scope="scope">
          <el-popover placement="right" width="300px" trigger="click" @show="getDetailById(scope.row.id)">
            <div v-loading="!orderInfo.orderExpressList">
              <el-table v-if="!!orderInfo.orderExpressList" :data="orderInfo.orderExpressList">
                <el-table-column prop="productNo" label="产品编号/名称" align="center" width="140" show-overflow-tooltip>
                  <template slot-scope="scoped">
                    <el-tag type="info" size="mini">{{ `${scoped.row.productNo} / ${scoped.row.productName}` }}</el-tag>
                  </template>
                </el-table-column>
                <el-table-column prop="requirement" label="要求" show-overflow-tooltip align="center" />
                <el-table-column prop="width" label="宽度(CM)" align="center" />
                <el-table-column prop="weight" label="克重(G)" align="center" />
                <el-table-column v-if="orderInfo.orderType === 1" prop="goodsLength" label="长度" align="center" />
                <el-table-column v-if="orderInfo.orderType === 1" prop="productNumber" label="条数" align="center" />
                <el-table-column prop="totalWeight" label="重量(KG)" align="center" />
                <el-table-column prop="tareWeight" label="车皮" align="center" />
                <el-table-column prop="price" label="单价(吨)" align="center" />
                <el-table-column prop="netWeight" label="净重" align="center" />
                <el-table-column prop="totalPrice" label="金额" align="center" />
                <el-table-column prop="number" label="出库个数" align="center" show-overflow-tooltip />
                <el-table-column prop="createBy" label="记录人/时间" align="center" width="180" show-overflow-tooltip>
                  <template slot-scope="scoped">
                    <div>{{ `${scoped.row.createBy}/${scoped.row.createTime}` }}</div>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <el-button slot="reference" type="text" size="mini">{{ scope.row.orderExpressNumber }}</el-button>
          </el-popover>
        </template>
      </el-table-column>

      <el-table-column label="金额(元)" prop="totalPrice" align="center">
        <template slot-scope="scope">
          <div v-if="scope.row.totalPrice" style="color:#f40;">{{ scope.row.makingType === 2 ? `-${ scope.row.totalPrice}` : scope.row.totalPrice }}</div>
        </template>
      </el-table-column>
      <el-table-column label="状态" prop="statusName" align="center">
        <template slot-scope="scope">
          <div>
            <el-tag v-if="scope.row.makingType === 1" :type="scope.row.status == 5 ? 'info': 'success'" size="mini">{{ scope.row.statusName }}</el-tag>
            <el-tag v-if="scope.row.makingType === 2" :type="scope.row.status == 3 ? 'info': 'success'" size="mini">{{ scope.row.statusName }}</el-tag>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="下单日期" prop="orderTime" align="center" sortable="custom" width="120">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          {{ scope.row.orderTime | moment('YYYY-MM-DD') }}
        </template>
      </el-table-column>
      <el-table-column label="更新时间" prop="updateTime" align="center" width="160" />
      <el-table-column label="操作" prop="id" sortable="custom" align="left" width="210">
        <template slot-scope="scope">
          <!-- <el-button size="mini" @click="detail(scope.row)">查看</el-button> -->
          <el-button v-if="scope.row.status == 0" type="primary" size="mini" @click="edit(scope.row)">编辑</el-button>
          <el-popover v-if="(scope.row.makingType === 1 && scope.row.status !== 5) || ( scope.row.makingType === 2 && scope.row.status !== 3)" :ref="scope.row.id" placement="top" width="300" trigger="click">
            <p>确定要关闭该订单吗？关闭后，该订单将不再可操作!!</p>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="()=>{$refs[scope.row.id].doClose()}">取消</el-button>
              <el-button type="danger" size="mini" plain @click="close(scope.row)">确 定</el-button>
            </div>
            <el-button slot="reference" type="danger" size="mini">完成</el-button>
          </el-popover>
          <el-button type="danger" size="mini" @click="showConfirm = !showConfirm, orderId = scope.row.id">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="block">
      <el-pagination v-show="total>0" :current-page="filter.pageIndex" :page-sizes="[10, 20, 50, 100]" :page-size="filter.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>

    <el-dialog title="添加出库记录" :visible.sync="showOutStock">
      <el-form :model="history">
        <el-form-item label="出库备注" :label-width="formLabelWidth">
          <el-input v-model="history.remark" autocomplete="off" placeholder="请输入出库备注" type="textarea" maxlength="500" show-word-limit />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showOutStock = false">取 消</el-button>
        <el-button type="primary" @click="saveHistory">保 存</el-button>
      </div>
    </el-dialog>

    <el-dialog title="提示" :visible.sync="showConfirm" width="300px">
      <span>确定要删除该订单吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showConfirm = false">取 消</el-button>
        <el-button type="danger" @click="confirmDelete()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getOrders,
  getOrderTypes,
  getOrderFlowNodes,
  deleteOrderById,
  closeOrder,
  addRemark,
  getOrderById
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
      filter: {},
      orderList: [],
      summary: {
        totalOrderExts: null,
        totalOrderExpresses: null,
        totalAmount: null
      },
      orderTypeList: [],
      flowList: [],
      formLabelWidth: '80px',
      showOutStock: false,
      history: {
        orderId: '',
        remark: ''
      },
      orderInfo: {},
      orderId: null,
      showConfirm: false
    }
  },
  created() {
    this.filter =
            JSON.parse(sessionStorage.getItem('filter')).filter === undefined
              ? {
                pageIndex: 1,
                pageSize: 10
              }
              : JSON.parse(sessionStorage.getItem('filter')).filter
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
      // this.$store.dispatch('filter/setFilter', this.filter)
      sessionStorage.setItem(
        'filter',
        JSON.stringify({
          filter: {
            ...this.filter
          }
        })
      )
      getOrders(params).then(res => {
        if (res.code === 10000) {
          this.orderList = res.data
          this.summary = res.summary
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
    edit(obj) {
      if (obj.makingType === 1) {
        this.$router.push({
          name: 'OrderManageEdit',
          params: {
            id: obj.id
          }
        })
      } else if (obj.makingType === 2) {
        this.$router.push({
          name: 'OrderManageReturnEdit',
          params: {
            id: obj.id
          }
        })
      }
    },
    detail(obj) {
      let routeData = null
      if (obj.makingType === 1) {
        routeData = this.$router.resolve({
          name: 'OrderManageDetail',
          params: {
            id: obj.id
          },
          query: {
            title: obj.customerName
          }
        })
      } else if (obj.makingType === 2) {
        routeData = this.$router.resolve({
          name: 'OrderManageReturnDetail',
          params: {
            id: obj.id
          },
          query: {
            title: obj.customerName
          }
        })
      }
      window.open(routeData.href, '_blank')
    },
    outStock(obj) {
      this.history.orderId = obj.id
      this.showOutStock = !this.showOutStock
    },
    saveHistory() {
      addRemark(this.history).then(res => {
        if (res.code === 10000) {
          this.$message({
            message: '添加出库成功！',
            type: 'success'
          })
        }
        this.showOutStock = !this.showOutStock
      })
    },
    close(obj) {
      closeOrder(obj.id).then(res => {
        if (res.code === 10000) {
          this.$message({
            message: '操作成功！',
            type: 'success'
          })
          this.getOrderList()
        }
      })
      this.$refs[obj.id].doClose()
    },
    getDetailById(orderId) {
      this.orderInfo = {}
      getOrderById(orderId)
        .then(res => {
          if (res.code === 10000) {
            this.orderInfo = res.data
          }
        })
        .catch(err => {
          this.$message({
            type: 'error',
            message: err.message
          })
        })
    },
    // 删除订单
    confirmDelete() {
      deleteOrderById(this.orderId).then(res => {
        if (res.code === 10000) {
          this.$message({
            type: 'success',
            message: '删除成功！'
          })
          this.getOrderList()
        }
      })
      this.showConfirm = !this.showConfirm
    },
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
.block {
    padding-top: 15px;
}

.total-data {
    line-height: 38px;
    font-size: 14px;
    color: #909399;
}
</style>
