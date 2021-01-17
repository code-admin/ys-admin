<template>
  <div v-loading="loading" class="dashboard-content">
    <el-row :gutter="20">
      <el-col :sm="24" :md="6">
        <div class="total-card">
          <span>本年销重量: </span>
          <countTo
            :startVal="0"
            :endVal="transitionNumber(totalData.year, 1000, 3)"
            :duration="3000"
            :decimals="3"
          ></countTo>
          <span>(吨)</span>
        </div>
      </el-col>
      <el-col :sm="24" :md="6">
        <div class="total-card">
          <span>本月销售总重量: </span>
          <countTo
            :startVal="0"
            :endVal="transitionNumber(totalData.month, 1000, 3)"
            :duration="2000"
            :decimals="3"
          ></countTo>
          <span>(吨)</span>
        </div>
      </el-col>
      <el-col :sm="24" :md="6">
        <div class="total-card">
          <span>今日销售总重量: </span>
          <countTo
            :startVal="0"
            :endVal="transitionNumber(totalData.dayWeight, 1000, 3)"
            :duration="1000"
            :decimals="3"
          ></countTo>
          <span>(吨)</span>
        </div>
      </el-col>
      <el-col :sm="24" :md="6">
        <div class="total-card">
          <span>今日销售数量: </span>
          <countTo
            :startVal="0"
            :endVal="transitionNumber(totalData.dayNumber, 1, 0)"
            :duration="1000"
          ></countTo>
          <span> (个)</span>
        </div>
      </el-col>
      <el-col :sm="24" :md="8">
        <div class="card">
          <div class="box">
            <div class="number-card flex justify-between">
              <div class="content" style="background: #87cefa; color: #ffffff">
                <svg-icon icon-class="order" class="icon" />
              </div>
              <div class="right">
                <div class="box">
                  <p>待出库</p>
                  <router-link :to="{ name: 'OrderManage' }">
                    <countTo
                      :startVal="0"
                      :endVal="
                        transitionNumber(orderStatusCount.totalDeliver, 1, 0)
                      "
                      :duration="2000"
                    ></countTo>
                  </router-link>
                </div>
              </div>
            </div>

            <div class="number-card mt20 flex justify-between">
              <div class="content" style="background: #ffa500; color: #ffffff">
                <svg-icon icon-class="feed_back" class="icon" />
              </div>
              <div class="right">
                <div class="box">
                  <p>未完成</p>
                  <router-link :to="{ name: 'OrderManage' }">
                    <countTo
                      :startVal="0"
                      :endVal="
                        transitionNumber(
                          orderStatusCount.totalSaleConfirm,
                          1,
                          0
                        )
                      "
                      :duration="3000"
                    ></countTo>
                  </router-link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :sm="24" :md="8">
        <div class="card">
          <ring-chart
            v-if="ringDataLoading"
            title="订单类型占比"
            :repot-data="ringData"
          />
        </div>
      </el-col>
      <el-col :sm="24" :md="8">
        <div class="card">
          <line-chart
            v-if="orderNumberCountLoading"
            title="过去7天销售个统计"
            :repot-data="orderNumberCount"
          />
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="24">
        <div class="card">
          <pillar-chart
            v-if="orderWeightCountLoading"
            title="过去30天销售重量统计"
            :repot-data="orderWeightCount"
          />
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import RingChart from "./RingChart";
import PillarChart from "./PillarChart";
import LineChart from "./LineChart";
import countTo from "vue-count-to";

import {
  weightRepor,
  getTotalReport,
  getFeedbackReport,
  getOrderReport,
  newTotalReport,
  orderNumberReport,
  orderWeightReport,
} from "@/api/dashboard";

export default {
  name: "Dashboard",
  components: {
    countTo,
    RingChart,
    PillarChart,
    LineChart,
  },
  data() {
    return {
      loading: false,
      ringDataLoading: false,
      orderNumberCountLoading: false,
      orderWeightCountLoading: false,
      ringData: null,
      lineData: null,
      // 头部数据统计
      totalData: {
        year: 0,
        month: 0,
        dayWeight: 0,
        dayNumber: 0,
      },
      orderStatusCount: {}, // 订单状态 数量统计
      orderNumberCount: {}, // 过去7天销售个数统计
      orderWeightCount: {}, //  过去30天销售重量统计
    };
  },
  computed: {
    transitionNumber: (num, params, fixed) => {
      return function (num, params, fixed) {
        let val = 0;
        if (num && params) {
          val = (num / params).toFixed(fixed);
        }
        return parseFloat(val);
      };
    },
  },
  mounted() {
    this.getRingData();
    // this.getPillarData()
    // this.getLineData()
    this.getTotalData();
    this.getOrderStatusCount();
    this.getOrderNumberCount();
    this.getOrderWeightCount();
  },
  methods: {
    // 销售数据统计
    getTotalData() {
      weightRepor({}).then((res) => {
        if (res.code === 10000) {
          this.totalData = res.data;
        }
      });
    },

    // 订单类型占比
    getRingData() {
      this.loading = !this.loading;
      getTotalReport().then((res) => {
        this.ringData = res.data;
        this.loading = !this.loading;
        this.ringDataLoading = !this.ringDataLoading;
      });
    },
    // 反馈统计
    getPillarData() {
      getFeedbackReport({}).then((res) => {
        this.pillarData = res.data;
      });
    },

    // 订单增长趋势
    getLineData() {
      getOrderReport({}).then((res) => {
        this.lineData = res.data;
      });
    },

    // 订单状态 数量统计
    getOrderStatusCount() {
      newTotalReport().then((res) => {
        this.orderStatusCount = res.data;
      });
    },
    // 过去7天销售个数统计
    getOrderNumberCount() {
      orderNumberReport({}).then((res) => {
        this.orderNumberCount = res.data;
        this.orderNumberCountLoading = !this.orderNumberCountLoading;
      });
    },
    //  过去30天销售重量统计
    getOrderWeightCount() {
      orderWeightReport({}).then((res) => {
        this.orderWeightCount = res.data;
        this.orderWeightCountLoading = !this.orderWeightCountLoading;
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.dashboard-content {
  width: 100%;
  background: #f2f2f2f2;
  padding: 10px 20px;
  box-sizing: border-box;

  .total-card {
    height: 100px;
    line-height: 100px;
    background: #ffffff;
    border-radius: 4px;
    text-align: center;
    margin: 10px 0;

    span:first-child {
      font-size: 16px;
      font-weight: 500;
      color: #929eaa;
    }

    span:nth-child(2) {
      font-size: 32px;
      color: #576573;
    }

    span:last-child {
      font-size: 12px;
      color: #999999;
    }
  }

  .card {
    height: calc(50vh - 115px);
    background: #ffffff;
    border-radius: 4px;
    margin: 10px 0;

    .box {
      height: 100%;
      background: #f2f2f2f2;

      .number-card {
        height: calc(50% - 10px);
        background: #ffffff;
        border-radius: 4px;

        .content {
          width: 240px;
          height: 100%;
          line-height: 100%;
          border-radius: 4px;
          font-size: 50px;
          position: relative;

          .icon {
            position: absolute;
            top: 50%;
            left: 50%;
            margin: -25px 0 0 -25px;
          }
        }

        .right {
          width: 100%;
          height: 100%;
          line-height: 100%;
          position: relative;

          .box {
            height: 80px;
            padding: 0 10px;
            position: absolute;
            top: 50%;
            right: 0px;
            margin-top: -40px;
            background: #ffffff;
            text-align: right;

            p {
              font-size: 16px;
              font-weight: 500;
              color: #929eaa;
            }

            span {
              font-size: 32px;
              color: #576573;
            }
          }
        }
      }
    }
  }
}

.mt20 {
  margin-top: 20px;
}

.flex {
  display: flex;
}

.justify-between {
  justify-content: space-between;
}
</style>
