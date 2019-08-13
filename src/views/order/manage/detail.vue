<template>
  <div v-loading="loading" class="page">
    <div class="card ">
      <div style="text-align: right"> <el-button icon="el-icon-back" size="mini" @click="$router.back()">返回</el-button> </div>
      <el-steps :active="orderInfo.status+1" finish-status="success" align-center>
        <el-step title="创建" />
        <el-step title="审核中" />
        <el-step title="出库" />
        <el-step title="结束" />
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
      <!-- <el-divider /> -->
      <el-table
        v-if="orderInfo.orderExts"
        :data="orderInfo.orderExts"
        style="width: 100%"
      >
        <el-table-column prop="requirement" label="产品/类型" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-tag type="info" size="mini">{{ `${scope.row.product.name} / ${scope.row.product.typeName}` }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="product.name" label="要求" show-overflow-tooltip align="center" />
        <el-table-column prop="width" label="宽度(cm)" align="center" />
        <el-table-column prop="weight" label="克重(g)" align="center" />
        <el-table-column v-if="orderInfo.orderType === 1" prop="width" label="长度(cm)" align="center" />
        <el-table-column v-if="orderInfo.orderType === 2" prop="number" label="个数" align="center" />
        <el-table-column prop="price" label="单价(元)" align="center">
          <template slot-scope="scope">
            <div v-if="scope.row.price" style="color:#f40;">
              {{ scope.row.price }} ¥
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div class="totalPrice">
        <p>总价: {{ orderInfo.totalPrice ? orderInfo.totalPrice : '--' }} ¥</p>
      </div>
    </div>

    <div class="card mt20">
      <div class="title">订单流转记录</div>
      <el-divider />

      <div class="content">
        <div v-if="!!orderInfo.orderHistoryList" class="block">
          <el-timeline>
            <el-timeline-item v-for="(item,index) in orderInfo.orderHistoryList" :key="item.id" :icon="index ? '' : 'el-icon-more' " :type="index ? '' : 'primary' " :timestamp="item.updateBy+'  '+item.updateTime" placement="top">
              <el-card>
                <p>{{ item.remark }}</p>
              </el-card>
            </el-timeline-item>
          </el-timeline>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getOrderById } from '@/api/order'
export default {
  data() {
    return {
      loading: false,
      orderInfo: {}
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
      padding-right:5%;
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
