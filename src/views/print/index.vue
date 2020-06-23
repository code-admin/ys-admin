<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="filter.printNumber" placeholder="流水号" style="width: 200px;" class="filter-item" clearable />
      <el-input v-model="filter.functionNo" placeholder="单号" style="width: 200px;" class="filter-item" clearable />
      <el-input v-model="filter.customerName" placeholder="客户" style="width: 200px;" class="filter-item" clearable />
      <el-select v-model="filter.type" placeholder="类型" style="width: 200px;" class="filter-item" clearable>
        <el-option label="提货单" :value="1" />
        <el-option label="结算单" :value="2" />
        <el-option label="退货单" :value="3" />
        <el-option label="退筒单" :value="4" />
        <el-option label="收袋款" :value="5" />
        <el-option label="其他款" :value="6" />
      </el-select>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="queryData">查询</el-button>
    </div>

    <el-table v-loading="listLoading" :data="dataList" border fit highlight-current-row size="mini" :span-method="objectSpanMethod">
      <el-table-column label="流水号" prop="printNumber" align="center" width="140">
        <template slot-scope="{row}">
          <div>
            <el-button type="text" size="mini" @click="handleView(row)">{{ row.printNumber }}</el-button>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="打印时间" prop="printTime" align="center" width="140" />
      <el-table-column label="类型" prop="type" align="center">
        <template slot-scope="{row}">
          <div>
            <el-tag size="mini"> {{ getTypeName(row.type) }}</el-tag>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="单号" prop="functionNo" align="center" width="140" />
      <el-table-column label="订单日期" prop="functionTime" align="center" width="100">
        <template slot-scope="{row}">
          <div>
            {{ row.functionTime | moment('YYYY-MM-DD') }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="客户" prop="customerName" align="center" />
      <el-table-column label="产品名称" prop="productName" align="center" />
      <el-table-column label="要求" prop="requirement" align="center" />
      <el-table-column label="宽度" prop="width" align="center" />
      <el-table-column label="克重" prop="weight" align="center" />
      <el-table-column label="个数" prop="goodsNumber" align="center" />
      <el-table-column label="条数" prop="productNumber" align="center" />
      <el-table-column label="单价" prop="price" align="center" />
      <el-table-column label="备注" prop="detailRemark" align="center" />
      <el-table-column label="发货方式" prop="delivery" align="center" width="220" show-overflow-tooltip />
      <el-table-column label="净重" prop="totalNetWeight" align="center" />
      <el-table-column label="金额" prop="totalAmount" align="center" />
      <el-table-column label="打印备注" prop="remark" align="center" />
      <el-table-column label="制单" prop="createName" align="center" />
      <el-table-column label="审核" prop="auditBy" align="center" />
      <el-table-column label="操作" align="center" fixed="right">
        <template slot-scope="{row}">
          <el-button type="text" size="mini" @click="handleView(row)">打印</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="block">
      <el-pagination v-show="total>0" :current-page="filter.pageIndex" :page-sizes="[30, 50, 100, 300]" :page-size="filter.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>
  </div>
</template>

<script>
import {
  setTable
} from './setTable'
import {
  queryList
} from '@/api/print.js'

export default {
  name: 'TakeDeliveryOfGoods',
  data() {
    return {
      listLoading: true,
      filter: {
        pageIndex: 1,
        pageSize: 30
      },
      dataList: null,
      total: 0
    }
  },
  computed: {
    getTypeName() {
      return function(type) {
        if (type === 1) {
          return '提货单'
        } else if (type === 2) {
          return '结算单'
        } else if (type === 3) {
          return '退货单'
        } else if (type === 4) {
          return '退筒单'
        } else if (type === 5) {
          return '收袋款'
        } else if (type === 6) {
          return '其他款'
        }
      }
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    getData() {
      this.listLoading = true
      queryList(this.filter).then(res => {
        this.dataList = res.data
        this.total = res.total
        this.listLoading = false
      })
    },
    handleView(obj) {
      let routeData = null
      if (obj.type === 1) {
        routeData = this.$router.resolve({
          name: 'PrintHistoryView',
          params: {
            id: obj.printNumber
          }
        })
      } else if (obj.type === 2) {
        routeData = this.$router.resolve({
          name: 'PrintHistoryView2',
          params: {
            id: obj.printNumber
          }
        })
      } else if (obj.type === 3) {
        routeData = this.$router.resolve({
          name: 'PrintHistoryView3',
          params: {
            id: obj.printNumber
          }
        })
      } else if (obj.type === 4) {
        routeData = this.$router.resolve({
          name: 'PrintHistoryView4',
          params: {
            id: obj.printNumber
          }
        })
      } else if (obj.type === 5) {
        routeData = this.$router.resolve({
          name: 'PrintHistoryView5',
          params: {
            id: obj.printNumber
          }
        })
      } else if (obj.type === 6) {
        routeData = this.$router.resolve({
          name: 'PrintHistoryView5',
          params: {
            id: obj.printNumber
          }
        })
      }
      window.open(routeData.href, '_blank')
    },
    queryData() {
      this.filter.pageIndex = 1
      this.getData()
    },
    handleSizeChange(val) {
      this.filter.pageSize = val
      this.getData()
    },
    handleCurrentChange(val) {
      this.filter.pageIndex = val
      this.getData()
    },
    /**
         * 合并列
         */
    objectSpanMethod({
      row,
      column,
      rowIndex,
      columnIndex
    }) {
      if (columnIndex === 0 || columnIndex === 2 || columnIndex === 3 || columnIndex === 4 ||
                columnIndex === 5 || columnIndex === 14 || columnIndex === 15 || columnIndex === 16 ||
                columnIndex === 17 || columnIndex === 18 || columnIndex === 19 || columnIndex === 20) {
        const _row = (setTable(this.dataList, 'printNumber'))[rowIndex]
        const _col = _row > 0 ? 1 : 0
        return {
          rowspan: _row,
          colspan: _col
        }
      }
      if (columnIndex === 1) {
        const _row = (setTable(this.dataList, 'printTime'))[rowIndex]
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
