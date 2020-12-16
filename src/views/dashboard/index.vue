<template>
<div v-loading="loading" class="dashboard-content">
    <el-row :gutter="20">
        <el-col :sm="24" :md="6">
            <div class="total-card">
                <span>本年销重量: </span>
                <countTo :startVal='0' :endVal='transitionNumber(totalData.year,1000,3)' :duration='1000' :decimals='3'></countTo>
                <span>(吨)</span>
            </div>
        </el-col>
        <el-col :sm="24" :md="6">
            <div class="total-card">
                <span>本月销售总重量: </span>
                <countTo :startVal='0' :endVal='transitionNumber(totalData.month,1000,3) ' :duration='1000' :decimals='3'></countTo>
                <span>(吨)</span>
            </div>
        </el-col>
        <el-col :sm="24" :md="6">
            <div class="total-card">
                <span>今日销售总重量: </span>
                <countTo :startVal='0' :endVal='transitionNumber(totalData.dayWeight,1000,3)' :duration='1000' :decimals='3'></countTo>
                <span>(吨)</span>
            </div>
        </el-col>
        <el-col :sm="24" :md="6">
            <div class="total-card">
                <span>今日销售数量: </span>
                <countTo :startVal='0' :endVal='transitionNumber(totalData.dayNumber,1,0)' :duration='1000'></countTo>
                <span> (个)</span>
            </div>
        </el-col>
        <el-col :sm="24" :md="8">
            <div class="card">
                <div class="box">
                    <div class="number-card flex justify-between">
                        <div class="content" style="background:	#87CEFA;color:#ffffff;">
                            <svg-icon icon-class="order" class="icon" />
                        </div>
                        <div class="right">
                            <div class="box">
                                <p>当前待审核订单</p>
                                <router-link :to="{name:'OrderApproval'}"> <span>{{ ringData && ringData.totalAuditOrder ? ringData.totalAuditOrder : 0 }}</span></router-link>
                            </div>
                        </div>
                    </div>

                    <div class="number-card mt20 flex justify-between">
                        <div class="content" style="background:#FFA500; color:#ffffff;">
                            <svg-icon icon-class="feed_back" class="icon" />
                        </div>
                        <div class="right">
                            <div class="box">
                                <p>当前待回馈</p>
                                <router-link :to="{name:'FeedbackList'}">
                                    <span>{{ ringData && ringData.totalFeedback ? ringData.totalFeedback : 0 }}</span>
                                </router-link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </el-col>
        <el-col :sm="24" :md="8">
            <div class="card">
                <ring-chart v-if="ringData" title="订单类型占比" :repot-data="ringData" />
            </div>
        </el-col>
        <el-col :sm="24" :md="8">
            <div class="card">
                <pillar-chart v-if="pillarData" title="过去7天反馈统计" :repot-data="pillarData" />
            </div>
        </el-col>
    </el-row>
    <el-row :gutter="20">
        <el-col :span="24">
            <div class="card">
                <line-chart v-if="lineData" title="过去10天订单数增长趋势" :repot-data="lineData" />
            </div>
        </el-col>
    </el-row>
</div>
</template>

<script>
import RingChart from './RingChart'
import PillarChart from './PillarChart'
import LineChart from './LineChart'
import countTo from 'vue-count-to'

import {
    weightRepor,
    getTotalReport,
    getFeedbackReport,
    getOrderReport
} from '@/api/dashboard'

export default {
    name: 'Dashboard',
    components: {
        countTo,
        RingChart,
        PillarChart,
        LineChart
    },
    data() {
        return {
            loading: false,
            ringData: null,
            reportData: null,
            pillarData: null,
            lineData: null,
            totalData: {
                year: 0,
                month: 0,
                dayWeight: 0,
                dayNumber: 0
            }
        }
    },
    computed: {
        transitionNumber: (num, params, fixed) => {
            return function (num, params, fixed) {
                let val = 0
                if (num && params) {
                    val = (num / params).toFixed(fixed)
                }
                return parseFloat(val)
            }

        }
    },
    mounted() {
        this.getRingData()
        this.getPillarData()
        this.getLineData()
        this.getTotalData()
    },
    methods: {
        getTotalData() {
            weightRepor({}).then(res => {
                if (res.code === 10000) {
                    this.totalData = res.data
                }
            })
        },
        getRingData() {
            this.loading = !this.loading
            getTotalReport().then(res => {
                if (res.code === 10000) {
                    this.ringData = res.data
                }
            })
        },
        getPillarData() {
            getFeedbackReport({}).then(res => {
                if (res.code === 10000) {
                    this.pillarData = res.data
                }
            })
        },
        getLineData() {
            getOrderReport({}).then(res => {
                if (res.code === 10000) {
                    this.lineData = res.data
                }
                this.loading = !this.loading
            })
        }
    }
}
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
    justify-content: space-between
}
</style>
