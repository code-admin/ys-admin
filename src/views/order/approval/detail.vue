<template>
  <div>
    <div v-loading="loading" class="page">

      <div class="card flex justify-between">
        <div>
          <p class="title"> 订单号：{{ approval.order && approval.order.orderNo }}</p>
          <i class="el-icon-time time"> &nbsp;{{ approval.createTime }}</i>
        </div>
        <div class="lh85"><el-tag>{{ `${approval.roleName} ${approval.statusName}` }}</el-tag></div>
      </div>

      <div class="card">
        <el-row :gutter="20">
          <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
            <el-row :gutter="10">
              <el-col :span="8"><div class="lable">客户:</div></el-col>
              <el-col :span="16"><div class="val">{{ approval.order && approval.order.orderUserName }}</div></el-col>
            </el-row>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
            <el-row :gutter="10">
              <el-col :span="8"><div class="lable">制单人类型:</div></el-col>
              <el-col :span="16"><div class="val"><el-button type="text" size="mini">{{ approval.order && approval.order.userTypeName }}</el-button> </div></el-col>
            </el-row>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
            <el-row :gutter="10">
              <el-col :span="8"><div class="lable">制单人:</div></el-col>
              <el-col :span="16"><div class="val">{{ approval.order && approval.order && approval.order.createBy }}</div></el-col>
            </el-row>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
            <el-row :gutter="10">
              <el-col :span="8"><div class="lable">发货方式:</div></el-col>
              <el-col :span="16"><div class="val">{{ approval.order && approval.order.deliveryTypeName }}</div></el-col>
            </el-row>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
            <el-row :gutter="10">
              <el-col :span="8"><div class="lable">收货人:</div></el-col>
              <el-col :span="16"><div class="val">{{ approval.order && approval.order.customerName }}</div></el-col>
            </el-row>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
            <el-row :gutter="10">
              <el-col :span="8"><div class="lable">收货人电话:</div></el-col>
              <el-col :span="16"><div class="val">{{ approval.order && approval.order.phone }}</div></el-col>
            </el-row>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
            <el-row :gutter="10">
              <el-col :span="8"><div class="lable">收货地址:</div></el-col>
              <el-col :span="16"><div class="val">{{ approval.order && approval.order.provinceName+approval.order.cityName+approval.order.districtName+approval.order.address }}</div></el-col>
            </el-row>
          </el-col>
        </el-row>
      </div>

      <div v-if="approval.type === 2" class="card mt20">
        <div class="title">下单类型: {{ approval.order && approval.order.orderTypeName }}</div>
        <el-table v-if="approval.order && !!approval.order.orderExts" :data="approval.order.orderExts" size="mini" style="width: 100%">
          <el-table-column prop="requirement" label="产品编号/名称" align="center" show-overflow-tooltip>
            <template slot-scope="scope">
              <el-tag type="info" size="mini">{{ `${scope.row.product && scope.row.product.productNo} / ${scope.row.product && scope.row.product.name}` }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="requirement" label="要求" show-overflow-tooltip align="center" />
          <el-table-column prop="width" label="宽度(cm)" align="center" />
          <el-table-column prop="weight" label="克重(g)" align="center" />
          <el-table-column v-if="approval.order.orderType === 2" prop="goodsNumber" label="个数" align="center" />
          <el-table-column v-if="approval.order.orderType === 1" prop="goodsLength" label="长度(cm)" align="center" />
          <el-table-column v-if="approval.order.orderType === 1" prop="goodsNumber" label="条数" align="center" />
          <el-table-column prop="price" label="单价(吨)" align="center">
            <template slot-scope="scope">
              <div v-if="scope.row.price" style="color:#f40;">
                {{ scope.row.price }} ¥
              </div>
            </template>
          </el-table-column>
        </el-table>
        <div class="totalPrice">
          <p>总价: {{ approval.order && approval.order.totalPrice ? approval.order.totalPrice : '--' }} ¥</p>
        </div>
      </div>

      <div class="card mt20">
        <div class="title">待确认 出库明细</div>
        <el-table v-if="approval.order && approval.order.orderExpressList" :data="approval.order.orderExpressList" size="mini" style="width: 100%">
          <el-table-column prop="productNo" label="产品编号/名称" align="center" width="140" show-overflow-tooltip>
            <template slot-scope="scope">
              <el-tag type="info" size="mini">{{ `${scope.row.productNo} / ${scope.row.productName}` }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="requirement" label="要求" show-overflow-tooltip align="center" />
          <el-table-column prop="width" label="宽度(CM)" align="center" />
          <el-table-column prop="weight" label="克重(G)" align="center" />

          <el-table-column prop="number" label="出库个数" align="center" show-overflow-tooltip>
            <template slot-scope="scope">
              <div v-if="scope.row.confirmNumber && scope.row.confirmNumber !== scope.row.number">
                <span class="confirm-price">{{ scope.row.confirmNumber }} 个</span>
                <span class="price">{{ scope.row.number }} 个</span>
              </div>
              <div v-else>
                <span>{{ scope.row.number }} 个</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="totalWeight" label="重量(KG)" align="center" />
          <el-table-column prop="tareWeight" label="车皮" align="center" />
          <el-table-column prop="price" label="单价(吨)" align="center" width="200">
            <template slot-scope="scope">
              <div v-if="scope.row.confirmPrice && scope.row.confirmPrice !== scope.row.price">
                <span class="confirm-price">{{ scope.row.confirmPrice }} ¥</span>
                <span class="price">{{ scope.row.price }} ¥</span>
              </div>
              <div v-else>
                <span>{{ scope.row.price }} ¥</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="netWeight" label="净重(KG)" align="center" />
          <el-table-column prop="totalPrice" label="金额" align="center" width="120">
            <template slot-scope="scope">
              <div v-if="scope.row.confirmPrice && scope.row.confirmPrice !== scope.row.price">
                <span class="confirm-price">{{ scope.row.confirmPrice * scope.row.netWeight / 1000 }} ¥</span>
                <span class="price">{{ scope.row.price * scope.row.netWeight / 1000 }} ¥</span>
              </div>
              <div v-else>
                <span>{{ scope.row.price * scope.row.netWeight / 1000 }} ¥</span>
              </div>
            </template>
          </el-table-column>

        </el-table>
      </div>

      <div class="card mt20">
        <div class="title">审核记录</div>

        <div class="content">
          <div v-if="!!approval.historyList" class="block">
            <el-timeline>
              <el-timeline-item v-for="(item,index) in approval.historyList" :key="item.id" :icon="index ? '' : 'el-icon-more' " :type="index ? '' : 'primary' " :timestamp="item.createBy+'  '+item.createTime" placement="top">
                <el-card>
                  <p>{{ item.description }}</p>
                </el-card>
              </el-timeline-item>
            </el-timeline>
          </div>
        </div>
      </div>

    </div>

    <div v-if="type" class="foot-btn">
      <el-input v-model="audit.reason" type="textarea" placeholder="请输入审核意见" maxlength="100" :rows="3" show-word-limit />
      <el-popover v-model="action1" placement="top" width="160">
        <p>确认审核通过吗？</p>
        <div style="text-align: right; margin: 0">
          <el-button size="mini" type="text" @click="action1 = false">取 消</el-button>
          <el-button type="primary" size="mini" @click="checkOk">确 定</el-button>
        </div>
        <el-button slot="reference" type="primary" size="mini" icon="el-icon-check">通 过</el-button>
      </el-popover>
      <el-popover v-model="action2" placement="top" width="160">
        <p>确认驳回申请吗？</p>
        <div style="text-align: right; margin: 0">
          <el-button size="mini" type="text" @click="action2 = false">取 消</el-button>
          <el-button type="warning" size="mini" @click="checkReback">确 定</el-button>
        </div>
        <el-button slot="reference" type="warning" size="mini" icon="el-icon-refresh-left">驳 回</el-button>
      </el-popover>
      <el-popover v-model="action3" placement="top" width="160">
        <p>确认审核不通过吗？</p>
        <div style="text-align: right; margin: 0">
          <el-button size="mini" type="text" @click="action3 = false">取 消</el-button>
          <el-button type="danger" size="mini" @click="checkClose">确 定</el-button>
        </div>
        <el-button v-if="approval.type !== 2" slot="reference" type="danger" size="mini" icon="el-icon-close">不通过</el-button>
      </el-popover>
      <el-button size="mini" class="el-icon-back" @click="$router.back()">返 回</el-button>
    </div>

    <div v-else class="foot-btn">
      <el-button size="mini" class="el-icon-back" @click="$router.back()">返 回</el-button>
    </div>

  </div>
</template>

<script>
import { getAuditById, auditOrder } from '@/api/order'
export default {
  data() {
    return {
      loading: false,
      action1: false,
      action2: false,
      action3: false,
      id: this.$route.params.id,
      type: this.$route.params.type,
      approval: {},
      audit: {
        auditId: this.$route.params.id,
        reason: null,
        status: null
      }
    }
  },
  mounted() {
    this.getDetailById(this.id)
  },
  methods: {
    getDetailById(id) {
      this.loading = !this.loading
      getAuditById(id).then(res => {
        if (res.code === 10000) {
          this.approval = res.data
        }
        this.loading = !this.loading
      })
    },

    submit(status) {
      this.audit.status = status
      auditOrder(this.audit).then(res => {
        if (res.code === 10000) {
          this.$message({
            showClose: true,
            type: 'success',
            message: '操作成功！'
          })
          this.$router.back()
        }
      })
    },
    checkOk() {
      this.action1 = false
      this.submit(0)
    },
    checkReback() {
      this.action2 = false
      if (!this.audit.reason) {
        this.$notify.error({
          title: '错误',
          message: '请输入审核意见'
        })
        return
      }
      this.submit(1)
    },
    checkClose() {
      this.action3 = false
      if (!this.audit.reason) {
        this.$notify.error({
          title: '错误',
          message: '请输入审核意见'
        })
        return
      }
      this.submit(2)
    }

  }
}
</script>

<style lang="scss" scoped>
.page{
  padding: 20px;
  background: #f2f2f2;
  margin-bottom: 155px;
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
    .time{
      color:#999999;
      padding-left:5px;
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
      font-size: 14px;
      font-weight: 500;
      color: #f40;
    }
  }
  .confirm-price{
    font-size: 18px;
    font-weight: 500;
    color: #f40;
  }
  .price{
    font-size: 11px;
    color: #888888;
    text-decoration:line-through
  }
  .flex{
    display: flex;
  }
  .justify-between{
    justify-content: space-between
  }
  .lh85{
    line-height: 85px;
  }
  .mt20{
    margin-top: 20px;
  }
}
.foot-btn{
    position: fixed;
    bottom: 0;
    background: #ffffff;
    width: 100%;
    line-height: 60px;
    padding: 20px 70px 0 20px;
  }
</style>
