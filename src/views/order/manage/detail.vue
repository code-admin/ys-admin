<template>
  <div v-loading="loading" class="page">
    <div class="card ">
      <div style="text-align: right"> <el-button icon="el-icon-back" size="mini" @click="$router.back()">返回</el-button> </div>
      <el-steps :active="orderInfo.status+1" finish-status="success" align-center>
        <el-step title="创建" />
        <el-step title="待审核" />
        <el-step title="待出库" />
        <el-step title="待签收" />
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
          <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
            <el-row :gutter="10">
              <el-col :span="8"><div class="lable">发货方式:</div></el-col>
              <el-col :span="16"><div class="val">{{ orderInfo.deliveryTypeName }}</div></el-col>
            </el-row>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
            <el-row :gutter="10">
              <el-col :span="8"><div class="lable">联系方式:</div></el-col>
              <el-col :span="16"><div class="val">{{ orderInfo.phone }}</div></el-col>
            </el-row>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
            <el-row :gutter="10">
              <el-col :span="8"><div class="lable">收货地址:</div></el-col>
              <el-col :span="16"><div class="val">{{ orderInfo.provinceName+orderInfo.cityName+orderInfo.districtName+orderInfo.address }}</div></el-col>
            </el-row>
          </el-col>
        </el-row>
      </div>
    </div>

    <div class="card mt20">
      <div class="title">下单类型: <el-tag type="primary" size="mini">{{ orderInfo.orderTypeName }}</el-tag> </div>
      <el-divider />
      <el-table
        v-if="orderInfo.orderExts"
        :data="orderInfo.orderExts"
        style="width: 100%"
      >
        <el-table-column type="selection" width="30" />
        <el-table-column prop="requirement" label="产品编号/名称" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-tag type="info" size="mini">{{ `${scope.row.product.productNo} / ${scope.row.product.name}` }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="requirement" label="要求" show-overflow-tooltip align="center" />
        <el-table-column prop="width" label="宽度(cm)" align="center" />
        <el-table-column prop="weight" label="克重(g)" align="center" />
        <el-table-column v-if="orderInfo.orderType === 1" prop="width" label="长度(cm)" align="center" />
        <el-table-column v-if="orderInfo.orderType === 2" prop="number" label="条数" align="center" />
        <el-table-column prop="number" label="数量" align="center" />
        <el-table-column prop="price" label="单价(元)" align="center">
          <template slot-scope="scope">
            <div v-if="scope.row.price" style="color:#f40;">
              {{ scope.row.price }} ¥
            </div>
          </template>
        </el-table-column>

        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="text" @click="showOutStock(scope.row)">出库</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="totalPrice">
        <p>总价: {{ orderInfo.totalPrice ? orderInfo.totalPrice : '--' }} ¥</p>
      </div>
    </div>

    <div class="card mt20">
      <div class="title">出库记录</div>
      <el-divider />
      <el-table :data="orderInfo.orderExts" style="width: 100%">
        <el-table-column prop="requirement" label="产品编号/名称" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-tag type="info" size="mini">{{ `${scope.row.product.productNo} / ${scope.row.product.name}` }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="requirement" label="要求" show-overflow-tooltip align="center" />
        <el-table-column prop="width" label="宽度(cm)" align="center" />
        <el-table-column prop="weight" label="克重(g)" align="center" />
        <el-table-column prop="requirement" label="出库数" align="center" show-overflow-tooltip />
        <el-table-column prop="requirement" label="司机/电话" align="center" show-overflow-tooltip />
        <el-table-column prop="requirement" label="记录人" align="center" show-overflow-tooltip />
        <el-table-column prop="requirement" label="时间" align="center" show-overflow-tooltip />
      </el-table>
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

    <el-dialog :title="`添加 ( ${orderInfo.orderNo} ) 订单出库`" :visible.sync="outStockVisible" width="80%">
      <el-table :data="outStockList">
        <el-table-column property="name" label="产品编号/名称" align="center" width="120" show-overflow-tooltip />
        <el-table-column property="requirement" label="要求" align="center" show-overflow-tooltip />
        <el-table-column property="width" label="宽度" align="center" />
        <el-table-column property="weight" label="克重" align="center" />
        <el-table-column property="number" label="出库数量" align="center" width="160">
          <template slot-scope="scope">
            <div>
              <el-input-number v-model="scope.row.number" :min="1" size="mini" placeholder="当前出库数量" />
            </div>
          </template>
        </el-table-column>
        <el-table-column property="loginName" label="司机/电话" align="center" width="200">
          <template slot-scope="scope">
            <el-select
              v-model="scope.row.loginName"
              placeholder="请选择送司机"
              size="mini"
              filterable
              remote
              reserve-keyword
              :remote-method="getUserList"
              :loading="loadingUser"
              clearable
              @change="setUser(0)"
            >
              <el-option v-for="user in userList" :key="user.loginName" :label="`${user.userName} / ${user.phone}`" :value="user.loginName" />
            </el-select>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="outStockVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveOutStock">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getOrderById, deliveryOrder } from '@/api/order'
import { getUsers } from '@/api/user'
export default {
  data() {
    return {
      loading: false,
      loadingUser: false,
      outStockVisible: false,
      orderInfo: {},
      outStockList: null,
      userList: []
    }
  },
  mounted() {
    this.getDetailById(this.$route.params.id)
  },
  methods: {
    getDetailById(id) {
      this.loading = !this.loading
      getOrderById(id).then(res => {
        if (res.code === 10000) this.orderInfo = res.data
        this.loading = !this.loading
      })
    },
    // 出库用户数据
    getUserList(userName) {
      this.loadingUser = !this.loadingUser
      getUsers({ userName: `${userName}`.trim(), userType: '1', pageIndex: 1, pageSize: 100000 }).then(res => {
        this.loadingUser = !this.loadingUser
        if (res.code === 10000) this.userList = res.data
      })
    },
    // 出库
    showOutStock(obj) {
      this.getUserList('')
      this.outStockList = []
      this.outStockList.push({
        // id: obj.id,
        productId: obj.productId,
        name: `${obj.product.productNo} / ${obj.product.name}`,
        requirement: obj.requirement,
        width: obj.width,
        weight: obj.weight,
        number: null,
        loginName: '',
        userName: '',
        phone: ''
      })
      this.outStockVisible = !this.outStockVisible
    },
    saveOutStock() {
      const row = this.outStockList && this.outStockList[0]
      console.log(row)
      deliveryOrder({ ...row, orderId: this.orderInfo.orderNo }).then(res => {
        if (res.code === 10000) {
          this.$message({ message: '添加出库成功！', type: 'success' })
          this.getDetailById(this.$route.params.id)
        }
      })
      this.outStockVisible = !this.outStockVisible
    },
    setUser(i) {
      const loginName = this.outStockList[i].loginName
      const user = this.userList.find(item => item.loginName === loginName)
      this.outStockList[i].userName = user.userName
      this.outStockList[i].phone = user.phone
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
      padding-right:16%;
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
