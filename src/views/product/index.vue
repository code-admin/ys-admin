<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="filter.productNo" placeholder="产品编号" style="width: 200px;" class="filter-item" clearable />
      <el-input v-model="filter.productName" placeholder="产品名称" style="width: 200px;" class="filter-item" clearable />
      <el-input v-model="filter.requirement" placeholder="要求" style="width: 200px;" class="filter-item" clearable />
      <el-input v-model="filter.width" placeholder="宽度" style="width: 200px;" class="filter-item" clearable />
      <el-input v-model="filter.weight" placeholder="克重" style="width: 200px;" class="filter-item" clearable />
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="queryData">查询</el-button>
      <el-button class="filter-item" icon="el-icon-plus" @click="addInit">添加</el-button>
    </div>
    <div class="tool-bar">
      <el-checkbox v-model="filter.hasStock" label="显示0库存" border size="small" @change="queryData" />
      <el-checkbox v-model="filter.hasCheckOut" label="显示0出库" border size="small" @change="queryData" />
      <el-checkbox v-model="filter.hasSaledProduct" label="显示0预售" border size="small" @change="queryData" />
    </div>
    <el-table :key="tableKey" v-loading="listLoading" :data="productList" border fit highlight-current-row style="width: 100%;">
      <el-table-column type="index" width="50" align="center" />
      <el-table-column label="产品编号" prop="productNo" align="center" show-overflow-tooltip width="120" />
      <el-table-column label="产品名称" prop="name" align="center" show-overflow-tooltip width="150">
        <template slot-scope="scope">
          <el-tag size="mini" type="info" effect="plain">{{ scope.row.name }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="要求" prop="requirement" align="center" show-overflow-tooltip width="120" />
      <el-table-column label="宽度(CM)" prop="width" align="center" />
      <el-table-column label="克重(G)" prop="weight" align="center" />
      <el-table-column label="米数(M)" prop="length" align="center" />
      <el-table-column label="重量(KG)" prop="netWeight" align="center" />
      <el-table-column label="库存(个)" prop="stockNumber" align="center" />
      <el-table-column label="价格" prop="price" align="center">
        <template slot-scope="scope">
          <div v-if="scope.row.price" style="color:#f40;">
            {{ scope.row.price }} ¥
          </div>
        </template>
      </el-table-column>
      <el-table-column label="今日入库" prop="todayStockNumber" align="center" />
      <el-table-column label="今日出库" prop="todaySaledNumber" align="center" />
      <el-table-column label="预售" prop="preSaledNumber" align="center" />
      <el-table-column label="在产数" prop="productingNumber" align="center" />
      <el-table-column label="描述" prop="description" show-overflow-tooltip />
      <el-table-column label="下架/上架" prop="status" align="center">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.enable" @change="handleEnable(scope.row)" />
        </template>
      </el-table-column>
      <el-table-column label="操作" prop="id" align="center" width="90">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="editInit(scope.row)">
            修改
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="block">
      <el-pagination v-show="total>0" :current-page="filter.pageIndex" :page-sizes="[10, 20, 50, 100]" :page-size="filter.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>

    <el-drawer ref="drawer" :title="title" size="30%" :visible.sync="dialogFormVisible" direction="rtl" custom-class="demo-drawer">
      <div class="demo-drawer__content">
        <el-form :model="product">
          <!-- <el-form-item label="产品编号" :label-width="formLabelWidth">
            <el-input v-model="product.productNo" placeholder="请输入产品编号" />
          </el-form-item> -->
          <el-form-item label="产品名称" :label-width="formLabelWidth">
            <el-input v-model="product.name" placeholder="请输入产品名称" />
          </el-form-item>
          <el-form-item label="要求" :label-width="formLabelWidth">
            <el-input v-model="product.requirement" placeholder="请输入要求" />
          </el-form-item>
          <el-form-item label="宽度" :label-width="formLabelWidth">
            <el-input v-model="product.width" placeholder="宽度(cm)" />
          </el-form-item>
          <el-form-item label="克重" :label-width="formLabelWidth">
            <el-input v-model="product.weight" placeholder="克重(g)" />
          </el-form-item>
          <el-form-item label="米数" :label-width="formLabelWidth">
            <el-input v-model="product.length" placeholder="米数(M)" />
          </el-form-item>
          <el-form-item label="价格" :label-width="formLabelWidth">
            <el-input v-model="product.price" placeholder="请输入基准价(元/吨)" />
          </el-form-item>
          <!--<el-form-item label="库存" :label-width="formLabelWidth">
            <el-input v-model="product.stockNumber" placeholder="请输入库存数" />
          </el-form-item>
          <el-form-item label="重量" :label-width="formLabelWidth">
            <el-input v-model="product.netWeight" placeholder="请输入库存重量(KG)" />
          </el-form-item>
        <el-form-item label="今日入库" :label-width="formLabelWidth">
            <el-input v-model="product.todayStockNumber" placeholder="请输今日入库数" />
          </el-form-item>
          <el-form-item label="今日出库" :label-width="formLabelWidth">
            <el-input v-model="product.todaySaledNumber" placeholder="请输入库存数" />
          </el-form-item> -->
          <el-form-item label="在产数" :label-width="formLabelWidth">
            <el-input v-model="product.productingNumber" placeholder="请输入库存数" />
          </el-form-item>

          <el-form-item label="下架/上架" :label-width="formLabelWidth">
            <el-switch v-model="product.enable" />
          </el-form-item>
          <el-form-item label="描述" :label-width="formLabelWidth">
            <el-input v-model="product.description" type="textarea" placeholder="请输入描述" />
          </el-form-item>
        </el-form>
        <div class="demo-drawer__footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="saveProduct()">保 存</el-button>
        </div>
      </div>
    </el-drawer>

  </div>
</template>

<script>
import {
  getProducts,
  getProductTypes,
  disable,
  saveProductInfo
} from '@/api/product'
export default {
  data() {
    return {
      listLoading: true,
      tableKey: 0,
      total: 0,
      filter: {
        hasStock: false,
        hasSaledProduct: true,
        hasCheckOut: true,
        pageIndex: 1,
        pageSize: 10
      },
      productList: [],
      productTypeList: [],
      product: {},
      department: {},
      title: '',
      dialogFormVisible: false,
      formLabelWidth: '90px'
    }
  },

  mounted() {
    this.getProductList()
    this.getProductTypeList()
  },

  methods: {
    getProductList() {
      this.listLoading = true
      const params = {
        ...this.filter
      }
      getProducts(params).then(res => {
        if (res.code === 10000) {
          this.productList = res.data
          this.total = res.total
        }
        this.listLoading = false
      })
    },

    getProductTypeList() {
      getProductTypes().then(res => {
        if (res.code === 10000) this.productTypeList = res.data
      })
    },

    handleEnable(obj) {
      const params = {
        enable: obj.enable,
        productId: obj.id
      }
      disable(params).then(res => {
        res.code === 10000 && this.$message({
          message: '操作成功！',
          type: 'success'
        })
      })
    },

    addInit() {
      this.title = '添加商品信息'
      this.product = {}
      this.dialogFormVisible = !this.dialogFormVisible
    },
    editInit(obj) {
      this.title = '修改商品信息'
      this.product = obj
      this.dialogFormVisible = !this.dialogFormVisible
    },
    saveProduct() {
      saveProductInfo(this.product).then(res => {
        if (res.code === 10000) {
          this.$message({
            message: '保存成功！',
            type: 'success'
          })
          this.getProductList()
          this.dialogFormVisible = !this.dialogFormVisible
        }
      })
    },
    queryData() {
      this.filter.pageIndex = 1
      this.getProductList()
    },
    handleSizeChange(val) {
      this.filter.pageSize = val
      this.getProductList()
    },
    handleCurrentChange(val) {
      this.filter.pageIndex = val
      this.getProductList()
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
}
</style>
