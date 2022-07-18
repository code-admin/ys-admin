<template>
  <div class="page">
    <!-- status -->
    <div class="card">
      <el-steps :active="orderInfo.status + 1" finish-status="success" align-center>
        <el-step title="制单" />
        <el-step title="待接单" />
        <el-step title="已接单" />
        <el-step title="待出库" />
        <el-step title="配送" />
        <el-step title="签收" />
        <el-step title="完成" />
      </el-steps>
    </div>

    <!-- info -->
    <div class="card mt20">
      <el-divider content-position="left">订单信息</el-divider>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form
            ref="ruleForm"
            :model="orderInfo"
            :rules="rules"
            label-width="100px"
            size="mini"
          >
            <el-form-item label="制单人" prop="name">
              <el-button type="text" size="mini">{{ name }}</el-button>
            </el-form-item>
            <el-form-item label="配送员" prop="name">
              <el-select
                v-model="orderInfo.deliverUserId"
                placeholder="请选择配送员"
                filterable
                style="width: 100%"
              >
                <el-option v-for="(user,index) in userList" :key="index"  :label="user.userName" :value="user.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="发货地址" prop="name">
              <el-select
                v-model="orderInfo.shippingAddressId"
                placeholder="请选择发货"
                filterable
                style="width: 100%"
                @change="changeShippingAddress"
              >
                <el-option
                  v-for="source in sourceList"
                  :key="source.id"
                  :label="source.remark"
                  :value="source.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="筒布数" prop="totalNumber" required>
              <el-input-number v-model="orderInfo.totalNumber" style="width: 100%" />
            </el-form-item>
            <el-form-item label="预估重量" prop="totalWeight" required>
              <el-input v-model="orderInfo.totalWeight">
                <template slot="append">KG</template>
              </el-input>
            </el-form-item>
            <el-form-item label="预估运费" prop="amount" required>
              <el-input v-model="orderInfo.amount">
                <template slot="append">元</template>
              </el-input>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="12">
          <div class="amap-box" style="width: 100%; height: 180px">
            <el-amap
              vid="delivery_order_add"
              map-style="fresh"
              :expand-zoom-range="false"
              :amap-manager="amapManager"
              :center="mapCenter"
              :zoom="10"
              :plugin="mapPlugin"
              :events="mapEvents"
            >
              <el-amap-marker
                :position="warehouse"
                :content="`<img src='http://asher.cn-sh2.ufileos.com/agabus.png' style='width:60px;height:60px;'></img>`"
              />
            </el-amap>
            <el-alert v-if="alertTitle" :title="alertTitle" type="warning" show-icon />
          </div>
        </el-col>
      </el-row>

      <el-table
        v-if="orderInfo.orderExts"
        :data="orderInfo.orderExts"
        style="width: 100%"
        size="mini"
      >
        <el-table-column type="selection" width="50" />
        <el-table-column
          prop="requirement"
          label="产品编号/名称"
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
          v-if="orderInfo.orderType === 1"
          prop="goodsLength"
          label="长度(cm)"
          align="center"
        />
        <el-table-column
          v-if="orderInfo.orderType === 1"
          prop="number"
          label="条数"
          align="center"
        />
        <el-table-column prop="totalDeliveryNumber" label="已出库" align="center" />

        <el-table-column prop="price" label="单价(吨)" align="center">
          <template slot-scope="scope">
            <div v-if="scope.row.price" style="color: #f40">
              {{ scope.row.price }} ¥
              <!-- <el-button
                type="text"
                size="mini"
                @click="initPrice(scope.row, scope.$index, 0)"
              >调价</el-button> -->
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="remark"
          label="备注"
          align="center"
          show-overflow-tooltip
        />
        <el-table-column
          v-if="orderInfo.status === 2 || orderInfo.status === 3"
          label="操作"
          align="center"
        >
          <template slot-scope="scope">
            <el-button type="text" size="mini" @click="showOutStock(scope.row, true)"
              >出库</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- order -->
    <div class="card mt20">
      <el-divider content-position="left">关联订单</el-divider>
      <el-card
        v-for="(order, index) in orderInfo.orderList"
        :key="index"
        class="box-card mb20"
      >
        <div slot="header" class="clearfix">
          <span class="title">订单号: {{ order.orderNo }}</span>
          <el-button
            style="float: right; padding: 3px 0"
            type="text"
            @click="deleteSelectByIndex(index)"
            >删除</el-button
          >
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
          <el-table-column type="selection" width="50" />
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
            v-if="orderInfo.orderType === 1"
            prop="goodsLength"
            label="长度(cm)"
            align="center"
          />
          <el-table-column
            v-if="orderInfo.orderType === 1"
            prop="number"
            label="条数"
            align="center"
          />
          <el-table-column prop="totalDeliveryNumber" label="已出库" align="center" />

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
          <el-table-column
            v-if="orderInfo.status === 2 || orderInfo.status === 3"
            label="操作"
            align="center"
          >
            <template slot-scope="scope">
              <el-button type="text" size="mini" @click="showOutStock(scope.row, true)"
                >出库</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </el-card>
      <el-button
        round
        size="medium"
        icon="el-icon-plus"
        plain
        style="width: 100%"
        @click="getConsumerOrder"
        >加入销售订单</el-button
      >
    </div>

    <div class="card mt20 flex-end">
      <el-button icon="el-icon-back" size="mini" @click="$router.back()">返回</el-button>
      <el-button type="primary" icon="el-icon-edit" size="mini" @click="saveData"
        >保存</el-button
      >
    </div>

    <!-- 弹框选择订单 -->
    <el-dialog
      title="请选择需要配送的订单"
      :visible.sync="dialogVisible"
      width="90%"
      :before-close="handleClose"
    >
      <el-table
        key="2"
        :data="consumerOrderList"
        size="mini"
        @selection-change="selectTable"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column label="下单日期" prop="orderTime" align="center" width="120">
          <template slot-scope="scope">
            <i class="el-icon-time" />
            {{ scope.row.orderTime | moment("YYYY-MM-DD") }}
          </template>
        </el-table-column>
        <el-table-column label="订单号" prop="orderNo" align="center" width="140">
          <template slot-scope="scope">
            <el-button type="text" @click="detail(scope.row)">{{
              scope.row.orderNo
            }}</el-button>
          </template>
        </el-table-column>
        <el-table-column label="客户" prop="customerName" align="center" />
        <el-table-column label="制单人" prop="createBy" align="center" />
        <el-table-column label="订购产品" prop="createBy" align="center">
          <template slot-scope="scope">
            <el-popover
              placement="right"
              width="300px"
              trigger="click"
              @show="getOrderDetailById(scope.row.id)"
            >
              <div v-loading="!consumerOrder.orderExts">
                <el-table
                  v-if="!!consumerOrder.orderExts"
                  :data="consumerOrder.orderExts"
                >
                  <el-table-column
                    prop="requirement"
                    label="产品编号/名称"
                    align="center"
                    show-overflow-tooltip
                    width="150"
                  >
                    <template slot-scope="scoped">
                      <el-tag type="info" size="mini">{{
                        `${scoped.row.product && scoped.row.product.productNo} / ${
                          scoped.row.product && scoped.row.product.name
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
                  <el-table-column
                    v-if="orderInfo && orderInfo.orderType === 2"
                    prop="goodsNumber"
                    label="个数"
                    align="center"
                  />
                  <el-table-column
                    v-if="orderInfo && orderInfo.orderType === 1"
                    prop="goodsLength"
                    label="长度(cm)"
                    align="center"
                  />
                  <el-table-column
                    v-if="orderInfo && orderInfo.orderType === 1"
                    prop="goodsNumber"
                    label="条数"
                    align="center"
                  />
                  <el-table-column
                    prop="totalDeliveryNumber"
                    label="已出库"
                    align="center"
                  />

                  <el-table-column prop="price" label="单价(吨)" align="center">
                    <template slot-scope="scoped">
                      <div v-if="scoped.row.price" style="color: #f40">
                        {{ scoped.row.price }} ¥
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="remark"
                    label="备注"
                    align="center"
                    show-overflow-tooltip
                  />
                </el-table>
              </div>
              <el-button slot="reference" type="text" size="mini">{{
                scope.row.orderExtNumber
              }}</el-button>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column label="出/入 库记录" prop="createBy" align="center">
          <template slot-scope="scope">
            <el-popover
              placement="left"
              width="300px"
              trigger="click"
              @show="getOrderDetailById(scope.row.id)"
            >
              <div v-loading="!consumerOrder.orderExpressList">
                <el-table
                  v-if="!!consumerOrder.orderExpressList"
                  :data="consumerOrder.orderExpressList"
                >
                  <el-table-column
                    prop="productNo"
                    label="产品编号/名称"
                    align="center"
                    width="140"
                    show-overflow-tooltip
                  >
                    <template slot-scope="scoped">
                      <el-tag type="info" size="mini">{{
                        `${scoped.row.productNo} / ${scoped.row.productName}`
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
                    v-if="orderInfo.orderType === 1"
                    prop="goodsLength"
                    label="长度"
                    align="center"
                  />
                  <el-table-column
                    v-if="orderInfo.orderType === 1"
                    prop="productNumber"
                    label="条数"
                    align="center"
                  />
                  <el-table-column prop="totalWeight" label="重量(KG)" align="center" />
                  <el-table-column prop="tareWeight" label="车皮" align="center" />
                  <el-table-column prop="price" label="单价(吨)" align="center" />
                  <el-table-column prop="netWeight" label="净重" align="center" />
                  <el-table-column prop="totalPrice" label="金额" align="center" />
                  <el-table-column
                    prop="number"
                    label="出库个数"
                    align="center"
                    show-overflow-tooltip
                  />
                  <el-table-column
                    prop="createBy"
                    label="记录人/时间"
                    align="center"
                    width="180"
                    show-overflow-tooltip
                  >
                    <template slot-scope="scoped">
                      <div>{{ `${scoped.row.createBy}/${scoped.row.createTime}` }}</div>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
              <el-button slot="reference" type="text" size="mini">{{
                scope.row.orderExpressNumber
              }}</el-button>
            </el-popover>
          </template>
        </el-table-column>

        <el-table-column label="金额(元)" prop="totalPrice" align="center">
          <template slot-scope="scope">
            <div v-if="scope.row.totalPrice" style="color: #f40">
              {{
                scope.row.makingType === 2
                  ? `-${scope.row.totalPrice}`
                  : scope.row.totalPrice
              }}
            </div>
          </template>
        </el-table-column>

        <el-table-column label="订单状态" prop="statusName" align="center">
          <template slot-scope="scope">
            <div>
              <el-tag
                v-if="scope.row.makingType === 1"
                :type="scope.row.status == 5 ? 'info' : 'success'"
                size="mini"
                >{{ scope.row.statusName }}</el-tag
              >
              <el-tag
                v-if="scope.row.makingType === 2"
                :type="scope.row.status == 3 ? 'info' : 'success'"
                size="mini"
                >{{ scope.row.statusName }}</el-tag
              >
            </div>
          </template>
        </el-table-column>
      </el-table>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmSelect">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { getOrgId } from "@/utils/auth";
import { AMapManager } from "vue-amap";
const amapManager = new AMapManager();
import { getOrders, getOrderById } from "@/api/order";
import { getShippingAddress } from "@/api/org";
import { getStaffList } from "@/api/user";
import { saveData, detail } from "@/api/delivery.js";
import { devide } from "@/utils/tools.js";

export default {
  data() {
    return {
      amapManager,
      mapCenter: [120.42638, 27.52558],
      mapPlugin: [
        {
          pName: "Scale",
        },
        {
          pName: "Driving",
        },
      ],
      mapEvents: {
        init() {},
      },
      sourceList: [],
      orgId: getOrgId() || "1",
      alertTitle: null,
      warehouse: [120.42638, 27.52558],
      orderInfo: {
        status: 0, // 状态
        shippingAddressId: 1, // 发货地址
        shippingAddress: {
          longitude: 120.42638,
          latitude: 27.52558,
        },
        orderList: [], // 关联订单
      },
      rules: {},
      consumerOrder: {},
      consumerOrderList: [],
      dialogVisible: false,
      selectArr: [],
      userList:[]
    };
  },
  computed: {
    ...mapGetters(["sidebar", "name", "avatar"]),
  },
  mounted() {
    const orderId = this.$route.params.id;
    if (orderId) {
      this.getDetailById(orderId);
    }
    this.getSourceList();
    this.getDeliveryUser();
  },
  methods: {
    // 配送员
    getDeliveryUser() {
      getStaffList({ pageIndex: 1, pageSize: 100000 }).then((res) => {
        this.userList = res.data;
      });
    },

    // 选择发货地
    changeShippingAddress(addressId) {
      const wareHouse = this.sourceList.find((item) => {
        return item.id === addressId;
      });
      this.orderInfo.shippingAddress.Longitude = wareHouse.longitude;
      this.orderInfo.shippingAddress.Latitude = wareHouse.latitude;
      this.orderInfo.shippingAddress.address = wareHouse.address;
      this.warehouse = [wareHouse.longitude, wareHouse.latitude];
      console.log("this.orderInfo.shippingAddress", this.orderInfo.shippingAddress);
    },

    // 获取发货仓库
    getSourceList() {
      getShippingAddress(this.orgId).then((res) => {
        if (res.code === 10000) {
          this.sourceList = res.data;
          this.orderInfo.shippingAddress.Longitude = this.sourceList[0].longitude;
          this.orderInfo.shippingAddress.Latitude = this.sourceList[0].latitude;
          this.orderInfo.shippingAddress.address = this.sourceList[0].address;

          this.mapCenter = [this.sourceList[0].longitude, this.sourceList[0].latitude];
          this.warehouse = [this.sourceList[0].longitude, this.sourceList[0].latitude];
        }
      });
    },

    // 获取详情信息
    getDetailById(id) {
      detail(id).then((res) => {
        this.orderInfo = res.data;
      });
    },

    // 订单详情
    getOrderDetailById(id) {
      getOrderById(id).then((res) => {
        this.consumerOrder = res.data;
      });
    },
    // 获取待配送的订单数据
    getConsumerOrder() {
      const ags = {
        status: 2,
        makingType: 1,
        loadingExtFlag: true,
        pageIndex: 1,
        pageSize: 100,
      };
      getOrders(ags).then((res) => {
        this.consumerOrderList = res.data;
        this.dialogVisible = !this.dialogVisible;
      });
    },
    handleClose() {
      this.dialogVisible = !this.dialogVisible;
    },
    selectTable(select) {
      this.selectArr = select;
    },
    confirmSelect() {
      this.orderInfo.orderList = this.orderInfo.orderList.concat(this.selectArr);
      this.orderInfo.orderList = devide(this.orderInfo.orderList);
      const origin = new window.AMap.LngLat(
        this.orderInfo.shippingAddress.Longitude,
        this.orderInfo.shippingAddress.Latitude
      );

      console.log("origin======", origin);

      let destination;
      const opts = {
        waypoints: [],
      };
      this.orderInfo.orderIds = [];
      this.orderInfo.orderList.map((item, index) => {
        this.orderInfo.orderIds.push(item.id);
        if (index) {
          opts.waypoints.push(new window.AMap.LngLat(item.longitude, item.latitude));
        } else {
          destination = new window.AMap.LngLat(item.longitude, item.latitude);
        }
      });
      this.getRouter(origin, destination, opts); // 驾车线路
      this.dialogVisible = !this.dialogVisible;
    },
    deleteSelectByIndex(index) {
      this.orderInfo.orderList.splice(index, 1);

      const origin = new window.AMap.LngLat(
        this.orderInfo.shippingAddress.Longitude,
        this.orderInfo.shippingAddress.Latitude
      );
      let destination;
      const opts = {
        waypoints: [],
      };

      this.orderInfo.orderIds = [];

      this.orderInfo.orderList.map((item, index) => {
        this.orderInfo.orderIds.push(item.id);
        if (index) {
          opts.waypoints.push(new window.AMap.LngLat(item.longitude, item.latitude));
        } else {
          destination = new window.AMap.LngLat(item.longitude, item.latitude);
        }
      });
      this.getRouter(origin, destination, opts); // 驾车线路
    },
    // 获取路线
    getRouter(origin, destination, opts) {
      const that = this;
      // 驾车路线规划
      const driving = new window.AMap.Driving({
        // 驾车路线规划策略，AMap.DrivingPolicy.LEAST_TIME是最快捷模式
        policy: window.AMap.DrivingPolicy.LEAST_TIME,
        // map 指定将路线规划方案绘制到对应的AMap.Map对象上
        map: amapManager.getMap(),
      });

      driving.clear(); // 清除路线规划

      driving.search(origin, destination, opts, (status, result) => {
        if (status === "complete") {
          that.orderInfo.distance = result.routes[0].distance / 1000;
          that.orderInfo.requireTime = (result.routes[0].time / 60 / 60).toFixed(2);
          this.alertTitle = `全程${result.routes[0].distance / 1000}公里；大约需要${(
            result.routes[0].time /
            60 /
            60
          ).toFixed(2)}小时`;
        }
      });
    },
    saveData() {
      console.log("orderInfo", this.orderInfo);
      saveData(this.orderInfo).then((res) => {
        this.$message({
          type: "success",
          message: res.message,
        });
        this.$router.back();
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.page {
  padding: 20px;
  background: #f2f2f2;
  height: calc(100vh - 50px);
  overflow: scroll;

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

  .mt20 {
    margin-top: 20px;
  }

  .mb20 {
    margin-bottom: 20px;
  }

  .flex-end {
    display: flex;
    justify-content: flex-end;
  }
}
</style>
