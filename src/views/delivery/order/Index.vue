<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="filter.deliverNumber" placeholder="配送单号" style="width: 200px;" class="filter-item" clearable />
      <el-input v-model="filter.orderNo" placeholder="订单号" style="width: 200px;" class="filter-item" clearable />
      <el-select v-model="filter.status" placeholder="配送状态" style="width: 200px;" class="filter-item" clearable>
        <el-option v-for="(item,index) in statusList" :key="index" :label="item" :value="index" />
      </el-select>
      <el-input v-model="filter.deliverUserName" placeholder="配送员" style="width: 200px;" class="filter-item" clearable />
      <el-date-picker key="queryDate" v-model="filter.queryDate" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" />
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="queryData">查询</el-button>
      <el-button class="filter-item" icon="el-icon-plus" @click="addData"> 新增 </el-button>
    </div>
    <div class="total-data" />
    <el-table v-loading="listLoading" :data="dataList" border size="small">
      <el-table-column label="配送单号" prop="deliverNumber" align="left" width="140">
        <template slot-scope="{row}">
          <el-button size="mini" type="text" @click="toDetail(row.id)">{{ row.deliverNumber }}</el-button>
        </template>
      </el-table-column>
      <el-table-column label="时间" prop="createTime" align="left" width="140" />
      <el-table-column label="关联订单" prop="shoppingOrder" align="left" width="130">
        <template slot-scope="{row}">
          <div>
            <el-tag v-for="(order,index) in row.relList" :key="index" size="mini">{{ order.orderNo }}</el-tag>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="总件数(个)" prop="totalNumber" align="left" />
      <el-table-column label="总重量(KG)" prop="totalWeight" align="left" />
      <el-table-column label="配送员/手机" prop="userName" align="left">
        <template slot-scope="{row}">
          <span>
            {{ `${row.deliverUserName ? row.deliverUserName:''}/${row.deliverUserPhone ? row.deliverUserPhone : ''}` }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="状态" prop="status" align="left">
        <template slot-scope="{row}">
          <div>
            <el-tag size="mini">
              {{ row.status | deliveryStatus }}
            </el-tag>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="配送距离(公里)" prop="distance" align="left" />
      <el-table-column label="配送价格(元)" prop="amount" align="left" />
      <el-table-column label="操作" prop="action" align="center" width="120">
        <template slot-scope="{row}">
          <div>
            <div v-if="row.status==0">
              <el-button type="text" size="mini" @click="toEdit(row.id)">修改</el-button>
              <el-divider direction="vertical" />
              <el-popover v-if="row.status==0" :ref="row.id" placement="top" width="300" trigger="click">
                <p>确定要发布此配送单吗！！？</p>
                <div style="text-align: right; margin: 0">
                  <el-button size="mini" type="text" @click="()=>{$refs[row.id].doClose()}">取消</el-button>
                  <el-button type="primary" size="mini" plain @click="publishOrderById(row.id,1)">确 定</el-button>
                </div>
                <el-button slot="reference" type="text" size="mini">发布</el-button>
              </el-popover>
            </div>
            <div v-if="row.status==1">
              <el-button type="text" size="mini" @click="publishOrderById(row.id,0)">撤消</el-button>
            </div>
            <div v-if="row.status>1 && row.status !==8">
               <el-popover :ref="row.id" placement="top" width="300" trigger="click">
                <p>确定要作废此配送单吗！！？</p>
                <div style="text-align: right; margin: 0">
                  <el-button size="mini" type="text" @click="()=>{$refs[row.id].doClose()}">取消</el-button>
                  <el-button type="primary" size="mini" plain @click="cancellation(row.id)">确 定</el-button>
                </div>
                <el-button slot="reference" type="text" size="mini">作废</el-button>
              </el-popover>
            </div>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-block">
      <el-pagination v-show="total>0" :current-page="filter.pageIndex" :page-sizes="[10, 20, 50, 100]" :page-size="filter.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>
  </div>
</template>

<script>
import { getDeliverList, updateStatus ,cancel} from '@/api/delivery'
export default {
  data() {
    return {
      statusList: ['制单', '待接单', '已接单', '待出库', '配送', '配送', '完成'],
      filter: {
        queryDate: [],
        pageIndex: 1,
        pageSize: 10
      },
      listLoading: false,
      dataList: [],
      total: 0
    }
  },
  mounted() {
    this.getDateList()
  },
  methods: {
    getDateList() {
      this.listLoading = !this.listLoading
      getDeliverList(this.filter).then(res => {
        this.dataList = res.data
        this.total = res.total
        this.listLoading = !this.listLoading
      }).catch(() => {
        this.listLoading = !this.listLoading
      })
    },
    addData() {
      this.$router.push(
        {
          name: 'DeliveryOrderAdd'
        }
      )
    },
    toEdit(orderId) {
      this.$router.push(
        {
          name: 'DeliveryOrderEdit',
          params: { id: orderId }
        }
      )
    },
    toDetail(orderId) {
      this.$router.push(
        {
          name: 'DeliveryOrderDetail',
          params: { id: orderId }
        }
      )
    },
    // 发布
    publishOrderById(id, status) {
      const ags = {
        id: id,
        status: status
      }
      updateStatus(ags).then(res => {
        if (res.code === 10000) {
          this.$message({
            type: 'success',
            message: res.message
          })
          this.getDateList()
        }
      })
    },
    // 作废
    cancellation(id){
      cancel(id).then(res => {
         this.$message({
            type: 'success',
            message: res.message
          })
        this.getDateList()
      })
    },
    // 查询
    queryData() {
      this.filter.pageIndex = 1
      this.getDateList()
    },
    handleSizeChange(val) {
      this.filter.pageSize = val
      this.getDateList()
    },
    handleCurrentChange(val) {
      this.filter.pageIndex = val
      this.getDateList()
    }
  }
}
</script>

<style lang="scss" scoped>
  .pagination-block{
    padding-top: 20px;
  }
</style>
