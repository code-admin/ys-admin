<template>
  <div class="page">
    <div class="card flex-sa">
      <div class="title">订单编号: {{ orderDeliver.deliverNumber }}</div>
      <el-button
        size="mini"
        icon="el-icon-back"
        @click="$router.back()"
      >返回</el-button>
    </div>

    <div class="card mt20">
      <el-steps
        :active="orderDeliver.status + 1"
        finish-status="success"
        align-center
      >
        <el-step title="制单" />
        <el-step title="发布" />
        <el-step title="接单" />
        <el-step title="出库" />
        <el-step title="配送" />
        <el-step title="签收" />
        <el-step title="完成" />
      </el-steps>
    </div>

    <div class="card mt20">
      <!-- <div class="title">订单信息</div> -->
      <el-divider content-position="left">订单信息</el-divider>
      <el-row :gutter="20">
        <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
          <el-row :gutter="10">
            <el-col :span="8">
              <div class="lable">制单人:</div>
            </el-col>
            <el-col :span="16">
              <div class="val">{{ orderDeliver.createByName }}</div>
            </el-col>
          </el-row>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
          <el-row :gutter="10">
            <el-col :span="8">
              <div class="lable">发货地址:</div>
            </el-col>
            <el-col :span="16">
              <div class="val">
                <el-button type="text" size="mini">{{
                  orderDeliver.shippingAddress
                    ? orderDeliver.shippingAddress.address
                    : "--"
                }}</el-button>
              </div>
            </el-col>
          </el-row>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
          <el-row :gutter="10">
            <el-col :span="8">
              <div class="lable">筒布数:</div>
            </el-col>
            <el-col :span="16">
              <div class="val">{{ orderDeliver.totalNumber }}(个)</div>
            </el-col>
          </el-row>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
          <el-row :gutter="10">
            <el-col :span="8">
              <div class="lable">预估重量:</div>
            </el-col>
            <el-col :span="16">
              <div class="val">{{ orderDeliver.totalWeight }} (KG)</div>
            </el-col>
          </el-row>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
          <el-row :gutter="10">
            <el-col :span="8">
              <div class="lable">预估运费:</div>
            </el-col>
            <el-col :span="16">
              <div class="val">{{ orderDeliver.amount }} (元)</div>
            </el-col>
          </el-row>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
          <el-row :gutter="10">
            <el-col :span="8">
              <div class="lable">送货司机:</div>
            </el-col>
            <el-col :span="16">
              <div class="val">建华 / 13773075845</div>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </div>

    <div class="card mt20">
      <el-divider content-position="left">关联订单</el-divider>
      <el-row :gutter="10" type="flex" justify="space-between">
        <el-col :span="20">
          <el-alert
            title="完成出库后司机才能开启配送！"
            type="warning"
            show-icon
          />
        </el-col>
        <el-col :span="4">
          <el-popover v-model="showConfirmExpress" placement="top" width="160">
            <p style="color:#F56C6C;">确认已完成了所有商品的出库了吗？</p>
            <div style="text-align: right; margin: 0">
              <el-button
                size="mini"
                type="text"
                @click="showConfirmExpress = false"
              >取消</el-button>
              <el-button
                type="primary"
                size="mini"
                @click="confirmExpress"
              >确定</el-button>
            </div>
            <el-button
              slot="reference"
              type="warning"
              icon="el-icon-finished"
              style="float: right"
            >完成出库</el-button>
          </el-popover>
        </el-col>
      </el-row>
      <el-card
        v-for="order in orderDeliver.orderList"
        :key="order.id"
        class="box-card mt20"
      >
        <div slot="header" class="clearfix">
          <span class="title">订单号: {{ order.orderNo }}</span>

          <el-button
            size="mini"
            icon="el-icon-printer"
            @click="extractedGoods(order.id)"
          >打印提货单</el-button>
          <el-button
            v-if="orderDeliver.status === 2"
            type="primary"
            size="mini"
            icon="el-icon-truck"
            @click="batchInit(order)"
          >批量出库</el-button>
        </div>
        <el-row :gutter="20">
          <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
            <el-row :gutter="10">
              <el-col :span="8">
                <div class="lable">客户:</div>
              </el-col>
              <el-col :span="16">
                <div class="val">{{ order.customerName }}</div>
              </el-col>
            </el-row>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
            <el-row :gutter="10">
              <el-col :span="8">
                <div class="lable">制单人:</div>
              </el-col>
              <el-col :span="16">
                <div class="val">{{ order.createBy }}</div>
              </el-col>
            </el-row>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
            <el-row :gutter="10">
              <el-col :span="8">
                <div class="lable">发货方式:</div>
              </el-col>
              <el-col :span="16">
                <div class="val">配送</div>
              </el-col>
            </el-row>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
            <el-row :gutter="10">
              <el-col :span="8">
                <div class="lable">收货人:</div>
              </el-col>
              <el-col :span="16">
                <div class="val">{{ order.orderUserName }}</div>
              </el-col>
            </el-row>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
            <el-row :gutter="10">
              <el-col :span="8">
                <div class="lable">收货人电话:</div>
              </el-col>
              <el-col :span="16">
                <div class="val">{{ order.phone }}</div>
              </el-col>
            </el-row>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
            <el-row :gutter="10">
              <el-col :span="8">
                <div class="lable">收货地址:</div>
              </el-col>
              <el-col :span="16">
                <div class="val">
                  {{ order.address }}
                </div>
              </el-col>
            </el-row>
          </el-col>
        </el-row>

        <el-divider />
        <el-table :data="order.orderExts" style="width: 100%" size="mini">
          <el-table-column
            prop="requirement"
            label="筒布"
            align="center"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <el-tag type="info" size="mini">{{
                `${scope.row.product && scope.row.product.productNo} / ${
                  scope.row.product && scope.row.product.name
                }`
              }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            prop="requirement"
            label="要求"
            show-overflow-tooltip
            align="center"
          />
          <el-table-column prop="width" label="宽度(cm)" align="center" />
          <el-table-column prop="weight" label="克重(g)" align="center" />
          <el-table-column prop="goodsNumber" label="个数" align="center" />
          <el-table-column
            v-if="order.orderType === 1"
            prop="goodsLength"
            label="长度(cm)"
            align="center"
          />
          <el-table-column
            v-if="order.orderType === 1"
            prop="number"
            label="条数"
            align="center"
          />
          <el-table-column
            prop="totalDeliveryNumber"
            label="已出库"
            align="center"
          />

          <el-table-column prop="price" label="单价(吨)" align="center">
            <template slot-scope="scope">
              <div v-if="scope.row.price" style="color: #f40">
                {{ scope.row.price }} ¥
                <!-- <el-button type="text" size="mini" @click="initPrice(scope.row, scope.$index, 0)">调价</el-button> -->
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="remark"
            label="备注"
            align="center"
            show-overflow-tooltip
          />
          <!-- <el-table-column v-if="orderDeliver.status === 2 || orderDeliver.status === 3" label="操作" align="center">
            <template slot-scope="scope">
              <el-button type="text" size="mini" @click="showOutStock(scope.row,true)">出库</el-button>
            </template>
          </el-table-column> -->
        </el-table>
      </el-card>
    </div>

    <div class="card mt20">
      <el-divider content-position="left">出库记录</el-divider>
      <el-table
        :data="orderDeliver.orderExpressList"
        style="width: 100%"
        size="mini"
        @selection-change="changePrint"
      >
        <el-table-column
          prop="orderId"
          label="销售订单编号"
          align="center"
          width="140"
        >
          <template slot-scope="{ row }">
            <el-button type="text" size="mini" @click="orderDetail(row)">{{
              row.orderId
            }}</el-button>
          </template>
        </el-table-column>
        <el-table-column
          prop="productNo"
          label="产品编号/名称"
          align="center"
          width="140"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <el-tag type="info" size="mini">{{
              `${scope.row.productNo} / ${scope.row.productName}`
            }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="requirement"
          label="要求"
          show-overflow-tooltip
          align="center"
        />
        <el-table-column prop="width" label="宽度(CM)" align="center" />
        <el-table-column prop="weight" label="克重(G)" align="center" />
        <el-table-column
          v-if="orderDeliver.orderType === 1"
          prop="goodsLength"
          label="长度(cm)"
          align="center"
        />
        <el-table-column
          v-if="orderDeliver.orderType === 1"
          prop="productNumber"
          label="条数"
          align="center"
        />
        <el-table-column prop="totalWeight" label="重量(KG)" align="center" />
        <el-table-column prop="tareWeight" label="车皮" align="center" />
        <el-table-column label="审核状态" align="center">
          <template slot-scope="scope">
            <div>
              <span v-if="scope.row.status === 2">审核中...</span>
              <span v-if="scope.row.status === 3">审核通过</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="price"
          label="单价(吨)"
          align="center"
          width="160"
        >
          <template slot-scope="scope">
            <div
              v-if="
                scope.row.confirmPrice &&
                  scope.row.confirmPrice !== scope.row.price
              "
            >
              <span class="confirm-price">{{ scope.row.confirmPrice }} ¥</span>
              <span class="price">{{ scope.row.price }} ¥</span>
              <!-- <el-button v-if="orderDeliver.status === 2 && (scope.row.status ===1 || scope.row.status ===3)" type="text" size="mini" @click="initPrice(scope.row, scope.$index, 1)">调价</el-button> -->
            </div>
            <div v-else>
              <span>{{ scope.row.price }} ¥</span>
              <!-- <el-button v-if="orderDeliver.status === 2 && (scope.row.status ===1 || scope.row.status ===3)" type="text" size="mini" @click="initPrice(scope.row, scope.$index, 1)">调价</el-button> -->
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="number"
          label="出库个数"
          align="center"
          width="180"
        >
          <template slot-scope="scope">
            <div
              v-if="
                scope.row.confirmNumber &&
                  scope.row.confirmNumber !== scope.row.number
              "
            >
              <span
                class="confirm-price"
              >{{ scope.row.confirmNumber }} 个</span>
              <span class="price">{{ scope.row.number }} 个</span>
              <!-- <el-button v-if="orderDeliver.status === 2 && (scope.row.status ===1 || scope.row.status ===3) || orderDeliver.status === 4 && (scope.row.status ===1 || scope.row.status ===3)" type="text" size="mini" @click="initNumber(scope.row, scope.$index)">修改</el-button> -->
            </div>
            <div v-else>
              <span>{{ scope.row.number }} 个</span>
              <!-- <el-button v-if="orderDeliver.status === 2 && (scope.row.status ===1 || scope.row.status ===3) || orderDeliver.status === 4 && (scope.row.status ===1 || scope.row.status ===3)" type="text" size="mini" @click="initNumber(scope.row, scope.$index)">修改</el-button> -->
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="netWeight" label="净重(KG)" align="center" />
        <el-table-column prop="totalPrice" label="金额" align="center" />
        <el-table-column prop="expressTime" label="出库日期" width="90" />
        <el-table-column
          prop="createBy"
          label="记录人/时间"
          align="center"
          width="180"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <div>
              {{ `${scope.row.createBy}/${scope.row.createTime}` }}
            </div>
          </template>
        </el-table-column>
        <!-- <el-table-column v-if="orderDeliver.status === 2 || orderDeliver.status === 3" label="操作" align="center" fixed="right" width="140">
          <template slot-scope="scope">
            <div v-if="scope.row.status === 0">
              <el-button type="text" size="mini" @click="deleteOutStock(scope.row.id)">删除</el-button>
              <el-button type="text" size="mini" @click="showOutStock(scope.row,false)">提交出库</el-button>
            </div>
          </template>
        </el-table-column> -->
      </el-table>
    </div>

    <div class="card mt20">
      <el-divider content-position="left">物流信息</el-divider>

      <el-row :gutter="10">
        <el-col :span="12">
          <el-timeline>
            <el-timeline-item
              v-for="(activity, index) in orderDeliver.histories"
              :key="index"
              :timestamp="activity.createTime"
            >
              {{ activity.remark }}
            </el-timeline-item>
          </el-timeline>
        </el-col>
        <el-col :span="12">
          <div class="amap-box" style="width: 100%; height: 300px">
            <el-amap
              vid="delivery_order_edit"
              map-style="fresh"
              :expand-zoom-range="false"
              :amap-manager="amapManager"
              :center="mapCenter"
              :zoom="10"
              :plugin="mapPlugin"
              :events="mapEvents"
            >
              <el-amap-marker
                :position="[120.426486, 27.525621]"
                :content="`<img src='http://asher.cn-sh2.ufileos.com/agabus.png' style='width:60px;height:60px;'></img>`"
              />
            </el-amap>
          </div>
        </el-col>
      </el-row>
    </div>

    <el-dialog
      :close-on-click-modal="false"
      :title="`添加 ( ${order.orderNo} ) 订单出库`"
      :visible.sync="outStockVisible"
      width="80%"
    >
      <div style="text-align: right; margin-bottom: 10px">
        <el-button
          type="primary"
          size="mini"
          @click="getDelivery"
        >获取出库数据</el-button>
      </div>
      <el-table :data="outStockList" size="mini">
        <el-table-column
          property="name"
          label="产品编号/名称"
          align="center"
          width="140"
          show-overflow-tooltip
        />
        <el-table-column
          property="requirement"
          label="要求"
          align="center"
          show-overflow-tooltip
        />
        <el-table-column property="width" label="宽度" align="center" />
        <el-table-column property="weight" label="克重" align="center" />
        <el-table-column prop="stockNumber" label="库存" align="center" />
        <el-table-column
          property="number"
          label="出库个数"
          align="center"
          width="160"
        >
          <template slot-scope="scope">
            <el-input-number
              v-model="scope.row.number"
              :min="0"
              size="mini"
              :max="scope.row.stockNumber"
              placeholder="当前出库个数"
            />
          </template>
        </el-table-column>
        <el-table-column
          v-if="order.orderType === 1"
          prop="goodsLength"
          label="长度"
          align="center"
          width="160"
        />
        <el-table-column
          v-if="order.orderType === 1"
          prop="productNumber"
          label="出库条数"
          align="center"
          width="160"
        >
          <template slot-scope="scope">
            <el-input-number
              v-model="scope.row.productNumber"
              :min="0"
              size="mini"
            />
          </template>
        </el-table-column>
        <el-table-column
          prop="totalWeight"
          label="重量(KG)"
          align="center"
          width="160"
        >
          <template slot-scope="scope">
            <el-input-number
              v-model="scope.row.totalWeight"
              :min="0"
              size="mini"
              placeholder="请输入重量"
            />
          </template>
        </el-table-column>
        <el-table-column
          prop="tareWeight"
          label="车皮(KG)"
          align="center"
          width="160"
        >
          <template slot-scope="scope">
            <el-input-number
              v-model="scope.row.tareWeight"
              :min="0"
              size="mini"
              placeholder="请输入车皮重量"
            />
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
            <div v-if="scope.row.price" style="color: #f40">
              {{
                (
                  ((scope.row.totalWeight - scope.row.tareWeight) / 1000) *
                  scope.row.price
                ).toFixed(2)
              }}
              ¥
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          prop="index"
          align="center"
          fixed="right"
          width="80"
          type="index"
        >
          <template slot-scope="scope">
            <div>
              <el-button
                type="text"
                size="mini"
                @click="changeNumber(scope.$index, scope.row)"
              >调换货</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="outStockVisible = false">取 消</el-button>
        <el-button
          type="primary"
          icon="el-icon-finished"
          :loading="submitOutstockLoading"
          @click="saveExpress"
        >保存并出库</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import axios from 'axios'
import { MESConfig } from '../../../settings.js'
import { AMapManager } from 'vue-amap'
const amapManager = new AMapManager()
import { detail, submitExpressOrder, updateStatus } from '@/api/delivery.js'

export default {
  data() {
    return {
      amapManager,
      mapCenter: [120.42638, 27.52558],
      mapPlugin: [{ pName: 'Scale' }, { pName: 'Driving' }],
      mapEvents: {
        init() {}
      },
      orderDeliver: {},
      activities: [
        {
          content: '完成出库',
          timestamp: '2018-04-15 14:32:21'
        },
        {
          content: '已接单',
          timestamp: '2018-04-13 14:32:21'
        },
        {
          content: '创建成功',
          timestamp: '2018-04-11 14:32:21'
        }
      ],
      order: {},

      outStockVisible: false,
      innerVisible: false,
      outStockList: [],
      saveOutStockLoading: false,
      submitOutstockLoading: false,
      showConfirmExpress: false
    }
  },
  mounted() {
    this.getDetailById(this.$route.params.id)
  },
  methods: {
    getDetailById(id) {
      detail(id).then((res) => {
        this.orderDeliver = res.data
      })
    },

    changePrint() {},

    // 打印提货单
    extractedGoods(id) {
      this.$router.push({
        name: 'ExtractedPrint',
        params: {
          id: id
        }
      })
    },

    // 勾选需要出库的产品
    handleSelectionChange(val) {
      this.tempProducts = val
    },

    // 批量出库
    batchInit(order) {
      this.outStockList = []
      this.order = order
      this.order.orderExts.map((obj) => {
        this.outStockList.push({
          orderId: order.orderNo,
          orderExtId: obj.id,
          productId: obj.productId,
          stockNumber: obj.product.stockNumber,
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
      this.outStockVisible = !this.outStockVisible
    },
    saveExpress() {
      this.submitOutstockLoading = !this.submitOutstockLoading
      submitExpressOrder({
        deliverId: parseInt(this.$route.params.id),
        deliver: {
          address: this.order.address,
          latitude: this.order.latitude,
          longitude: this.order.longitude
        },
        orderExpressList: this.outStockList
      })
        .then((res) => {
          if (res.code === 10000) {
            this.$message({
              message: '提交出库成功！',
              type: 'success',
              duration: 500
            })
            // this.getDetailById(this.$route.params.id)
            this.outStockVisible = !this.outStockVisible
            this.$router.push({
              name: 'OrderPrinting',
              params: {
                id: this.order.id
              },
              query: {
                arr: res.data
              }
            })
          }
          this.submitOutstockLoading = !this.submitOutstockLoading
        })
        .catch(() => {
          this.submitOutstockLoading = !this.submitOutstockLoading
        })
    },

    getDelivery() {
      const orderId = this.order.id || ''
      axios
        .get(
          `${MESConfig.baseUrl}/aps/foreign/sale/getDelivery?orderNumber=${orderId}&companyId=${MESConfig.companyId}`
        )
        .then((res) => {
          if (res.status === 200) {
            if (res.data.code === 200) {
              console.log('tag', res.data.data)
            }
          }
        })
        .catch((err) => {
          this.$message({
            type: 'error',
            message: err.data.msg
          })
        })
    },
    orderDetail(obj) {
      let routeData = null
      routeData = this.$router.resolve({
        name: 'OrderManageDetail',
        params: {
          id: obj.customerOrderId
        },
        query: {
          title: obj.customerName
        }
      })
      window.open(routeData.href, '_blank')
    },
    // 确认完成出库
    confirmExpress() {
      const ags = {
        id: this.$route.params.id,
        status: 3
      }
      updateStatus(ags).then(res => {
        if (res.code === 10000) {
          this.$message({
            type: 'success',
            message: res.message
          })
          this.getDetailById(this.$route.params.id)
          this.showConfirmExpress = !this.showConfirmExpress
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.page {
  padding: 20px;
  background: #f2f2f2;
  height: auto;
  .card {
    padding: 10px;
    background: #ffffff;
    border-radius: 4px;
    font-size: 12px;
    line-height: 30px;
    .title {
      font-size: 14px;
      font-weight: 500;
    }
    .lable {
      color: #777777;
      text-align: right;
    }

    .value {
      color: #555555;
    }
  }
  .flex-sa {
    display: flex;
    justify-content: space-between;
  }
  .mt20 {
    margin-top: 20px;
  }
  .mb20 {
    margin-bottom: 20px;
  }
}
</style>
