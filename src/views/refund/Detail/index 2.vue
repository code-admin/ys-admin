<template>
<div class="app-container">
    <el-table v-loading="listLoading" :data="dataList" border style="width: 100%;" size="mini">
        <el-table-column label="退筒时间" prop="refundTime" align="center" width="160" />
        <el-table-column label="订购日期" prop="orderTime" align="center" width="90">
            <template slot-scope="scope">
                <div>
                    {{ scope.row.orderTime | moment('YYYY-MM-DD') }}
                </div>
            </template>
        </el-table-column>
        <el-table-column label="订单编号" prop="orderNo" align="center" width="120" />
        <el-table-column label="客户" prop="customerName" align="center" />
        <el-table-column label="产品编号/名称" prop="userTypeName" align="center" width="140" show-overflow-tooltip>
            <template slot-scope="scope">
                <div>
                    {{ `${ scope.row.productNo} / ${ scope.row.productName}` }}
                </div>
            </template></el-table-column>
        <el-table-column label="要求" prop="requirement" align="center" />
        <el-table-column label="宽度" prop="width" align="center" width="50" />
        <el-table-column label="克重" prop="weight" align="center" width="50" />
        <el-table-column label="个数" prop="goodsNumber" align="center" width="50" />
        <!-- <el-table-column label="已出库" prop="checkOutNumber" align="center" width="60" /> -->
        <el-table-column label="单价" prop="price" align="center" />
        <!-- <el-table-column label="已退筒个数" prop="returnNumber" align="center" /> -->
        <el-table-column label="本次退筒个数" align="center">
            <template slot-scope="{row}">
                <div style="color:#f40;">
                    {{ row.returnNumber }}
                </div>
            </template>
        </el-table-column>
        <el-table-column label="本次退筒重量(KG)" prop="returnWeight" align="center" width="120" />
        <el-table-column label="本次退筒金额" prop="returnPrice" align="center" />
        <el-table-column label="制单人" prop="createByName" align="center" />
    </el-table>
</div>
</template>

<script>
import {
  getRefundOrderDetails
} from '@/api/refund'
export default {
  data() {
    return {
      listLoading: true,
      id: this.$route.params.id,
      dataList: []
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    getData() {
      getRefundOrderDetails(this.id).then(res => {
        this.listLoading = !this.listLoading
        this.dataList = res.data
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.flex {
    display: flex;
}

.justify-between {
    justify-content: space-between;
}

.tac {
    width: 200px;
    text-align: center;
}

.print-box {
    width: 760px;
    height: 562px;
    margin: 0px auto;
    padding: 30px 0px 0px;
    border: 1px dashed #f2f2f2;
    box-sizing: border-box;
    position: relative;

    .company {
        text-align: center;
        font-size: 26px;
        line-height: 30px;
    }

    .title {
        text-align: center;
        font-size: 17px;
        line-height: 30px;
    }

    .bar {
        height: 28px;
        line-height: 28px;
        font-size: 16px;

        .text {
            padding: 0 10px;
        }
    }

    .tr {
        font-size: 16px;
        height: 28px;
        line-height: 28px;

        td {
            border: 1px solid #000000;
            text-align: center;
        }
    }

    .foot {
        height: 44px;
        line-height: 44px;
        text-align: center;
        font-size: 13px;
        font-weight: 500;
    }

    .logo {
        widows: 65px;
        height: 56px;
        position: absolute;
        top: 20px;
        left: 100px;
    }

    .print {
        position: absolute;
        top: 10px;
        right: 20px;
    }
}
</style>
