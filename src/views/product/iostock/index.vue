<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="filter.productNo" placeholder="产品编号" style="width: 200px;" class="filter-item" clearable />
      <el-input v-model="filter.productName" placeholder="产品名称" style="width: 200px;" class="filter-item" clearable />
      <el-input v-model="filter.requirement" placeholder="要求" style="width: 200px;" class="filter-item" clearable />
      <el-input v-model="filter.width" placeholder="宽度" style="width: 200px;" class="filter-item" clearable />
      <el-input v-model="filter.weight" placeholder="克重" style="width: 200px;" class="filter-item" clearable />
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="queryData">查询</el-button>
      <el-button class="filter-item" type="primary" icon="el-icon-s-operation" @click="initExchange">调换货</el-button>
      <el-button class="filter-item" icon="el-icon-plus" @click="addInit">添加</el-button>
    </div>

    <el-table v-loading="listLoading" :data="historyList" border fit highlight-current-row style="width: 100%;">
      <el-table-column type="index" width="50" align="center" />
      <el-table-column label="订单编号" prop="productNo" align="center" show-overflow-tooltip width="120">
        <template slot-scope="scope">
          <router-link v-if=" scope.row.orderId" :to="{name: scope.row.makingType === 1 ? 'OrderManageDetail' : 'OrderManageReturnDetail', params: { id: scope.row.orderId } }">
            <el-button size="mini" type="text">{{ `${scope.row.orderNo}` }}</el-button>
          </router-link>
        </template>
      </el-table-column>
      <el-table-column label="客户/公司" prop="productNo" align="center" show-overflow-tooltip width="160">
        <template slot-scope="scope">
          <div v-if="scope.row.companyName">
            {{ `${scope.row.customerName} / ${scope.row.companyName}` }}
          </div>
          <div v-else>
            {{ scope.row.customerName }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="产品编号" prop="productNo" align="center" show-overflow-tooltip width="120" />
      <el-table-column label="产品名称" prop="name" align="center" show-overflow-tooltip width="150">
        <template slot-scope="scope">
          <el-tag size="mini" type="info" effect="plain">{{ scope.row.name }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="要求" prop="requirement" align="center" show-overflow-tooltip width="120" />
      <el-table-column label="宽度(cm)" prop="width" align="center" />
      <el-table-column label="克重(g)" prop="weight" align="center" />
      <el-table-column label="出入库类型" prop="operationNumber" align="center">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.operation === 1" type="success" size="mini">入库</el-tag>
          <el-tag v-if="scope.row.operation === 2" type="danger" size="mini">出库</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="重量(KG)" prop="netWeight" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.operation === 1" style="color:#67C23A;"> + {{ scope.row.netWeight }}</span>
          <span v-if="scope.row.operation === 2" style="color:#F56C6C;"> - {{ scope.row.netWeight }}</span>
        </template>
      </el-table-column>
      <el-table-column label="数量" prop="operationNumber" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.operation === 1" style="color:#67C23A;"> + {{ scope.row.operationNumber }}</span>
          <span v-if="scope.row.operation === 2" style="color:#F56C6C;"> - {{ scope.row.operationNumber }}</span>
        </template>
      </el-table-column>
      <el-table-column label="记录人" prop="operationName" align="center" />
      <el-table-column label="记录时间" prop="operationTime" align="center" width="160" />
      <el-table-column label="备注" prop="remark" show-overflow-tooltip />
    </el-table>
    <div class="block">
      <el-pagination v-show="total>0" :current-page="filter.pageIndex" :page-sizes="[10, 20, 50, 100]" :page-size="filter.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>

    <el-drawer ref="drawer" :title="title" size="30%" :visible.sync="dialogFormVisible" direction="rtl" custom-class="demo-drawer">
      <div class="demo-drawer__content">
        <el-alert class="alert" title="选择产品编号必须为产品库中已存在的商品，若没有找到对应的产品编号，请与相关人员联系。入库商品数请仔细核对，一但保存成功将不能删除！请谨慎操作！！" type="warning" show-icon />
        <el-form :model="history">
          <el-form-item label="出入库类型" :label-width="formLabelWidth">
            <el-select v-model="history.operation" placeholder="请选择产品" style="width:100%">
              <el-option label="入库" :value="1" />
              <el-option label="出库" :value="2" disabled />
            </el-select>
          </el-form-item>
          <el-form-item label="产品编号" :label-width="formLabelWidth">
            <el-select v-model="history.productId" filterable remote reserve-keyword :remote-method="getProductList" :loading="loading" placeholder="请选择产品" style="width:100%" @change="changeProduct">
              <el-option v-for="(product,index) in productList" :key="index" :label="`${product.name} / ${product.productNo}`" :value="product.id" />
            </el-select>
          </el-form-item>
          <el-form-item label="产品名称" :label-width="formLabelWidth">
            <el-input v-model="history.name" placeholder="请输入产品名称" disabled />
          </el-form-item>
          <el-form-item label="要求" :label-width="formLabelWidth">
            <el-input v-model="history.requirement" placeholder="请输入要求" disabled />
          </el-form-item>
          <el-form-item label="宽度" :label-width="formLabelWidth">
            <el-input v-model="history.width" placeholder="宽度(cm)" disabled />
          </el-form-item>
          <el-form-item label="克重" :label-width="formLabelWidth">
            <el-input v-model="history.weight" placeholder="克重(g)" disabled />
          </el-form-item>
          <el-form-item label="重量" :label-width="formLabelWidth">
            <el-input v-model="history.netWeight" placeholder="请输入重量(KG)" />
          </el-form-item>
          <el-form-item label="数量" :label-width="formLabelWidth">
            <el-input v-model="history.number" placeholder="请输入数量" />
          </el-form-item>
          <el-form-item label="备注" :label-width="formLabelWidth">
            <el-input v-model="history.remark" type="textarea" placeholder="请输入备注" />
          </el-form-item>
        </el-form>
        <div class="demo-drawer__footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="saveHistory()">保 存</el-button>
        </div>
      </div>
    </el-drawer>

    <el-drawer ref="drawer2" title="产品调换货" size="30%" :visible.sync="showExchange" direction="ltr" custom-class="demo-drawer">
      <div style="padding:20px">
        <el-form :model="exchange">
          <el-form-item label="入库产品" :label-width="formLabelWidth">
            <el-select v-model="exchange.plusStockProductId" filterable remote reserve-keyword :remote-method="getProductList" :loading="loading" placeholder="请选择入库产品" style="width:100%">
              <el-option v-for="(product,index) in productList" :key="index" :label="`${product.name} / ${product.productNo}[${product.stockNumber}]`" :value="product.id" />
            </el-select>
          </el-form-item>
        </el-form>
        <el-form :model="exchange">
          <el-form-item label="出库商品" :label-width="formLabelWidth">
            <el-select v-model="exchange.reduceStockProductId" filterable remote reserve-keyword :remote-method="getProductList2" :loading="loading" placeholder="请选择入库产品" style="width:100%">
              <el-option v-for="(product,index) in productList2" :key="index" :label="`${product.name} / ${product.productNo}[${product.stockNumber}]`" :value="product.id" />
            </el-select>
          </el-form-item>
          <el-form-item label="重量" :label-width="formLabelWidth">
            <el-input-number v-model="exchange.netWeight" :min="1" placeholder="重量(KG)" />
          </el-form-item>
          <el-form-item label="数量" :label-width="formLabelWidth">
            <el-input-number v-model="exchange.stockNumber" :min="1" placeholder="克重(个)" />
          </el-form-item>
        </el-form>
        <div class="demo-drawer__footer">
          <el-button @click="showExchange = false">取 消</el-button>
          <el-button type="primary" @click="saveExchange">保 存</el-button>
        </div>
      </div>
    </el-drawer>

  </div>
</template>

<script>
import {
  getProducts,
  getProductLogList,
  createProductLog,
  exchangeProductStock
} from '@/api/product'
export default {
  data() {
    return {
      listLoading: true,
      loading: false,
      showExchange: false,
      total: 0,
      filter: {
        pageIndex: 1,
        pageSize: 10
      },
      productList: [],
      productList2: [],
      historyList: [],
      history: {},
      title: '',
      dialogFormVisible: false,
      formLabelWidth: '90px',
      exchange: {}
    }
  },

  mounted() {
    this.getHistoryList()
  },

  methods: {
    getHistoryList() {
      this.listLoading = true
      const params = {
        ...this.filter
      }
      getProductLogList(params).then(res => {
        if (res.code === 10000) {
          this.historyList = res.data
          this.total = res.total
        }
        this.listLoading = false
      })
    },
    getProductList(kw) {
      this.loading = !this.loading
      getProducts({
        productNo: kw,
        pageIndex: 1,
        pageSize: 1000000
      }).then(res => {
        this.loading = !this.loading
        if (res.code === 10000) {
          this.productList = res.data
        }
      })
    },
    getProductList2(kw) {
      this.loading = !this.loading
      getProducts({
        productNo: kw,
        pageIndex: 1,
        pageSize: 1000000
      }).then(res => {
        this.loading = !this.loading
        if (res.code === 10000) {
          this.productList2 = res.data
        }
      })
    },
    addInit() {
      this.getProductList('')
      this.title = '添加出入库'
      this.history = {
        operation: 1
      }
      this.dialogFormVisible = !this.dialogFormVisible
    },
    changeProduct() {
      this.history.productId
      const p = this.productList.find(item => item.id === this.history.productId)
      this.history.name = p.name
      this.history.requirement = p.requirement
      this.history.width = p.width
      this.history.weight = p.weight
    },
    saveHistory() {
      createProductLog(this.history).then(res => {
        if (res.code === 10000) {
          this.$message({
            message: '保存成功！',
            type: 'success'
          })
          this.getHistoryList()
        }
      })
      this.dialogFormVisible = !this.dialogFormVisible
    },
    initExchange() {
      this.exchange = {
        plusStockProductId: null,
        reduceStockProductId: null,
        netWeight: 1,
        stockNumber: 1
      }
      this.getProductList('')
      this.getProductList2('')
      this.showExchange = !this.showExchange
    },
    saveExchange() {
      exchangeProductStock(this.exchange).then(res => {
        if (res.code === 10000) {
          this.$message({
            message: '操作成功！',
            type: 'success'
          })
          this.getHistoryList()
        }
      })
      this.showExchange = !this.showExchange
    },
    queryData() {
      this.filter.pageIndex = 1
      this.getHistoryList()
    },
    handleSizeChange(val) {
      this.filter.pageSize = val
      this.getHistoryList()
    },
    handleCurrentChange(val) {
      this.filter.pageIndex = val
      this.getHistoryList()
    }
  }
}
</script>

<style lang="scss" scoped>
.block {
    padding-top: 15px;
}

.demo-drawer__content {
    padding: 20px;
    height: calc(100vh - 60px);
    overflow: scroll;

    .alert {
        margin-bottom: 10px;
    }
}
</style>
