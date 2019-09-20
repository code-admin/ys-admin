<template>
  <div v-loading="loading" class="page">
    <div class="card ">
      <div style="text-align: right"> <el-button icon="el-icon-back" size="mini" @click="$router.back()">返回</el-button> </div>
      <el-steps :active="orderInfo.status+1" finish-status="success" align-center>
        <el-step title="创建" />
        <el-step title="待入库" />
        <el-step title="待确认" />
        <el-step title="完成" />
      </el-steps>
    </div>

    <div class="card mt20 ">
      <div class="flex justify-between">
        <div class="title">订单号: {{ orderInfo.orderNo }}</div>
        <div class="value"> <i class="el-icon-time time">&nbsp; {{ orderInfo.orderTime }}</i>
        </div>
      </div>
      <el-divider />
      <div class="mt20">
        <el-row :gutter="20">
          <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
            <el-row :gutter="10">
              <el-col :span="8"><div class="lable">下单人:</div></el-col>
              <el-col :span="16"><div class="val">{{ orderInfo.orderUserName }}</div></el-col>
            </el-row>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
            <el-row :gutter="10">
              <el-col :span="8"><div class="lable">制单人类型:</div></el-col>
              <el-col :span="16"><div class="val"><el-button type="text" size="mini">{{ orderInfo.userTypeName }}</el-button> </div></el-col>
            </el-row>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
            <el-row :gutter="10">
              <el-col :span="8"><div class="lable">制单人:</div></el-col>
              <el-col :span="16"><div class="val">{{ orderInfo.createBy }}</div></el-col>
            </el-row>
          </el-col>
        </el-row>
      </div>
    </div>

    <div class="card mt20">
      <div class="flex justify-between">
        <div class="title">下单类型: <el-tag type="primary" size="mini">{{ orderInfo.orderTypeName }}</el-tag> </div>
        <el-button v-if="orderInfo.status === 1" type="primary" plain size="mini" @click="batchInit">批量入库</el-button>
      </div>

      <el-divider />

      <el-table v-if="orderInfo.orderExts" :data="orderInfo.orderExts" style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="30" />
        <el-table-column prop="requirement" label="产品编号/名称" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-tag type="info" size="mini">{{ `${scope.row.product && scope.row.product.productNo} / ${scope.row.product && scope.row.product.name}` }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="requirement" label="要求" show-overflow-tooltip align="center" />
        <el-table-column prop="width" label="宽度(cm)" align="center" />
        <el-table-column prop="weight" label="克重(g)" align="center" />
        <el-table-column prop="goodsNumber" label="个数" align="center" />
        <el-table-column prop="price" label="入库单价(吨)" align="center">
          <template slot-scope="scope">
            <div v-if="scope.row.price" style="color:#f40;">
              {{ scope.row.price }} ¥
            </div>
          </template>
        </el-table-column>
        <el-table-column v-if="orderInfo.status ===1" label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="text" size="mini" @click="showOutStock(scope.row,true)">入库</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div v-if="orderInfo.status > 0" class="card mt20">
      <div class="flex justify-between">
        <div class="title">入库记录</div>
        <el-popover
          v-if="orderInfo.orderExpressList && orderInfo.orderExpressList.length && orderInfo.status === 1"
          v-model="finishVisible"
          placement="top"
          width="160"
        >
          <p>确认要完成入库吗</p>
          <div style="text-align: right; margin: 0">
            <el-button size="mini" type="text" @click="finishVisible = false">取消</el-button>
            <el-button type="primary" size="mini" @click="confirmOutStock">确定</el-button>
          </div>
          <el-button v-if="!!orderInfo.orderExpressList" slot="reference" size="mini" type="danger">完成入库</el-button>
        </el-popover>
      </div>
      <el-divider />
      <el-table show-summary :data="orderInfo.orderExpressList" style="width: 100%">
        <el-table-column prop="productNo" label="产品编号/名称" align="center" width="140" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-tag type="info" size="mini">{{ `${scope.row.productNo} / ${scope.row.productName}` }}</el-tag>
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
        <el-table-column prop="number" label="入库个数" align="center" show-overflow-tooltip />
        <el-table-column prop="createBy" label="记录人/时间" align="center" width="180" show-overflow-tooltip>
          <template slot-scope="scope">
            <div>
              {{ `${scope.row.createBy}/${scope.row.createTime}` }}
            </div>
          </template>
        </el-table-column>
        <el-table-column v-if="orderInfo.status === 1" label="操作" align="center" fixed="right" width="140">
          <template slot-scope="scope">
            <div v-if="scope.row.status === 0">
              <el-button type="text" size="mini" @click="deleteOutStock(scope.row.id)">删除</el-button>
              <el-button type="text" size="mini" @click="showOutStock(scope.row,false)">提交入库</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <!-- <div class="totalPrice">
        <p>已入库总金额: {{ orderInfo.totalPrice ? orderInfo.totalPrice : '--' }} ¥</p>
      </div> -->
    </div>

    <div class="card mt20">
      <div class="title">订单流转记录</div>
      <el-divider />
      <div class="content">
        <div v-if="!!orderInfo.orderHistoryList" class="block">
          <el-timeline>
            <el-timeline-item v-for="(item,index) in orderInfo.orderHistoryList" :key="item.id" :icon="index ? '' : 'el-icon-more' " :type="index ? '' : 'primary' " :timestamp="item.updateBy+'  '+item.updateTime" placement="top">
              <el-card>
                <span>{{ item.remark }}</span>
              </el-card>
            </el-timeline-item>
          </el-timeline>
        </div>
      </div>
    </div>

    <!-- 添加入库窗口 -->
    <!-- :span-method="objectSpanMethod" -->
    <el-dialog :close-on-click-modal="false" :title="`添加 ( ${orderInfo.orderNo} ) 订单入库`" :visible.sync="outStockVisible" width="80%">
      <el-table :data="outStockList">
        <el-table-column property="name" label="产品编号/名称" align="center" width="140" show-overflow-tooltip />
        <el-table-column property="requirement" label="要求" align="center" show-overflow-tooltip />
        <el-table-column property="width" label="宽度" align="center" />
        <el-table-column property="weight" label="克重" align="center" />
        <el-table-column property="number" label="入库个数" align="center" width="160">
          <template slot-scope="scope">
            <el-input-number v-model="scope.row.number" :min="0" size="mini" placeholder="当前入库数" />
          </template>
        </el-table-column>
        <el-table-column prop="totalWeight" label="重量(KG)" align="center" width="160">
          <template slot-scope="scope">
            <el-input-number v-model="scope.row.totalWeight" :min="0" size="mini" placeholder="请输入重量" />
          </template>
        </el-table-column>
        <el-table-column prop="tareWeight" label="车皮(KG)" align="center" width="160">
          <template slot-scope="scope">
            <el-input-number v-model="scope.row.tareWeight" :min="0" size="mini" placeholder="请输入车皮重量" />
          </template>
        </el-table-column>
        <el-table-column prop="price" label="单价(吨)" align="center" />
        <el-table-column prop="" label="净重(KG)" align="center">
          <template slot-scope="scope">
            <div>{{ scope.row.totalWeight - scope.row.tareWeight }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="e" label="金额" align="center" width="100">
          <template slot-scope="scope">
            <div v-if="scope.row.price" style="color:#f40;">
              {{ ((scope.row.totalWeight - scope.row.tareWeight)/1000*scope.row.price).toFixed(2) }} ¥
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="outStockVisible = false">取 消</el-button>
        <el-button type="primary" icon="el-icon-edit-outline" @click="saveOutStock">保 存</el-button>
        <el-button type="primary" icon="el-icon-finished" @click="submitOutstock">保存并入库</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getOrderById, saveWarehousingOrder, deleteDeliveryOrder, submitWarehousingOrder, confirmOut } from '@/api/order'
import { getUsers } from '@/api/user'
export default {
  data() {
    return {
      loading: false,
      loadingUser: false,
      outStockVisible: false,
      finishVisible: false,
      orderInfo: {},
      outStockList: null,
      userList: [],
      tempProducts: [],
      spanArr: []
    }
  },
  mounted() {
    this.getDetailById(this.$route.params.id)
    this.getUserList('')
  },
  methods: {
    getDetailById(id) {
      this.loading = !this.loading
      getOrderById(id).then(res => {
        if (res.code === 10000) this.orderInfo = res.data
        // 合并行
        // this.rowspan(this.orderInfo.orderExts)
        this.loading = !this.loading
      })
    },
    // 入库用户数据
    getUserList(userName) {
      this.loadingUser = !this.loadingUser
      getUsers({ userName: `${userName}`.trim(), userType: '1', pageIndex: 1, pageSize: 100000 }).then(res => {
        this.loadingUser = !this.loadingUser
        if (res.code === 10000) this.userList = res.data
      })
    },
    // 入库
    showOutStock(obj, isAdd) {
      console.log('?????????', obj)
      this.outStockList = []
      this.outStockList.push({
        id: isAdd ? null : obj.id,
        orderId: this.orderInfo.orderNo,
        orderExtId: isAdd ? obj.id : obj.orderExtId,
        productId: obj.productId,
        name: `${obj.product.productNo} / ${obj.product.name}`,
        requirement: obj.requirement,
        width: obj.width,
        weight: obj.weight,
        price: obj.price,
        number: isAdd ? 0 : obj.number,
        goodsLength: obj.goodsLength,
        productNumber: obj.productNumber || 0,
        totalWeight: obj.totalWeight || 0,
        tareWeight: obj.tareWeight || 0,
        driverLoginName: obj.driverLoginName || '',
        driverName: obj.driverName || '',
        driverPhone: obj.driverPhone || ''
      })
      this.outStockVisible = !this.outStockVisible
    },
    saveOutStock() {
      saveWarehousingOrder({ orderExpressList: this.outStockList }).then(res => {
        if (res.code === 10000) {
          this.$message({ message: '添加入库成功！', type: 'success' })
          this.getDetailById(this.$route.params.id)
          this.outStockVisible = !this.outStockVisible
        }
      })
    },
    submitOutstock() {
      submitWarehousingOrder({ orderExpressList: this.outStockList }).then(res => {
        if (res.code === 10000) {
          this.$message({ message: '提交入库成功！', type: 'success' })
          this.getDetailById(this.$route.params.id)
          this.outStockVisible = !this.outStockVisible
        }
      })
    },
    deleteOutStock(id) {
      deleteDeliveryOrder(id).then(res => {
        this.$message({ message: '删除成功！', type: 'success' })
        this.getDetailById(this.$route.params.id)
      })
    },
    confirmOutStock() {
      confirmOut(this.$route.params.id).then(res => {
        if (res.code === 10000) {
          this.$message({ message: '入库已完成！', type: 'success' })
          this.getDetailById(this.$route.params.id)
        }
      })
    },
    setUser(i) {
      const driverLoginName = this.outStockList[i].driverLoginName
      const user = this.userList.find(item => item.loginName === driverLoginName)
      this.outStockList[i].driverName = user.userName
      this.outStockList[i].driverPhone = user.phone
    },
    handleSelectionChange(val) {
      this.tempProducts = val
    },
    batchInit() {
      if (this.tempProducts.length) {
        this.outStockList = []
        this.tempProducts.map(obj => {
          this.outStockList.push({
            orderId: this.orderInfo.orderNo,
            orderExtId: obj.id,
            productId: obj.productId,
            name: `${obj.product.productNo} / ${obj.product.name}`,
            requirement: obj.requirement,
            width: obj.width,
            weight: obj.weight,
            price: obj.price,
            goodsLength: obj.goodsLength,
            number: 0,
            productNumber: 0,
            totalWeight: 0,
            tareWeight: 0,
            driverLoginName: '',
            driverName: '',
            driverPhone: ''
          })
        })
        // 合并行
        this.rowspan(this.outStockList)
        this.outStockVisible = !this.outStockVisible
      } else {
        this.$notify({
          title: '提示',
          message: '请选择需要入库的商品'
        })
      }
    },

    rowspan(arrData) {
      let contactDot = 0
      arrData.forEach((item, index) => {
        item.index = index

        if (index === 0) {
          this.spanArr.push(1)
        } else {
          if (item.price === arrData[index - 1].price) {
            this.spanArr[contactDot] += 1
            this.spanArr.push(0)
          } else {
            this.spanArr.push(1)
            contactDot = index
          }
        }
      })
    },

    // 合并
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 4) {
        const _row = this.spanArr[rowIndex]
        const _col = _row > 0 ? 1 : 0
        return {
          rowspan: _row,
          colspan: _col
        }
      }
      if (columnIndex === 5) {
        const _row = this.spanArr[rowIndex]
        const _col = _row > 0 ? 1 : 0
        return {
          rowspan: _row,
          colspan: _col
        }
      }
      if (columnIndex === 7) {
        const _row = this.spanArr[rowIndex]
        const _col = _row > 0 ? 1 : 0
        return {
          rowspan: _row,
          colspan: _col
        }
      }
      if (columnIndex === 8) {
        const _row = this.spanArr[rowIndex]
        const _col = _row > 0 ? 1 : 0
        return {
          rowspan: _row,
          colspan: _col
        }
      }
    }
  }
}
</script>

<style  lang="scss" scoped>
.page{
  padding: 20px;
  background: #f2f2f2;
   .card{
    padding: 20px;
    background: #ffffff;
    border-radius: 4px;
    font-size: 12px;
    line-height: 30px;
     .title{
      font-size:14px;
      font-weight: 500;
    }
    .lable{
      color: #777777;
      text-align: right;
    }
    .value{
      color: #555555;
    }
    .totalPrice{
      text-align: right;
      padding-right:20px;
      font-size: 18px;
      font-weight: 500;
      color: #f40;
    }
   }
}
.mt20{
  margin-top: 20px;
}
.flex{
  display: flex;
}
.justify-between{
  justify-content: space-between
}
</style>
