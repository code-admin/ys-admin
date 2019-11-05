<template>
  <div class="page">
    <div class="card">
      <el-steps :active="1" finish-status="success" align-center>
        <el-step title="创建" />
        <el-step title="入库" />
        <el-step title="确认" />
        <el-step title="完成" />
      </el-steps>
    </div>

    <div class="card mt20">
      <div class="title">基本信息</div>
      <div class="content mt20">
        <el-form label-position="right" label-width="80px" :model="orderInfo">
          <el-form-item label="客户">
            <el-select v-model="orderInfo.orderUser" placeholder="请选择客户" filterable style="width:100%;">
              <el-option v-for="user in customeList" :key="user.loginName" :label="user.userName" :value="user.loginName" />
            </el-select>
          </el-form-item>
          <el-form-item label="下单日期">
            <el-date-picker v-model="orderInfo.orderTime" type="date" value-format="yyyy-MM-dd" placeholder="请选择下单日期" style="width:100%;" />
          </el-form-item>
          <el-form-item label="备注">
            <el-input
              v-model="orderInfo.remark"
              placeholder="请输入备注"
              type="textarea"
              :rows="2"
            />
          </el-form-item>
        </el-form>
      </div>
    </div>

    <div class="card mt20">
      <div class="title">产品信息</div>
      <div class="content mt20">
        <el-row :gutter="20">
          <el-col v-for="(goods,index) in orderInfo.orderExts" :key="index" :sm="24" :md="12" :lg="8" :xl="6">
            <el-card shadow="hover" style="min-height:578px">
              <el-form label-position="right" label-width="80px" :model="orderInfo">
                <el-form-item label="产品编号">
                  <el-input v-model="orderInfo.orderExts[index].productNo" placeholder="产品编号" disabled />
                </el-form-item>
                <el-form-item label="产品名称">
                  <el-select v-model="orderInfo.orderExts[index].productId" placeholder="请选择产品" filterable clearable style="width:100%;" @change="changeProduct(index)">
                    <el-option v-for="product in productList" :key="product.id" :label="`${product.name}${product.width}${product.weight}(${product.productNo})`" :value="product.id" />
                  </el-select>
                </el-form-item>
                <el-form-item label="要求">
                  <el-input v-model="orderInfo.orderExts[index].requirement" placeholder="请输入要求" disabled />
                </el-form-item>
                <el-form-item label="宽度">
                  <el-input v-model="orderInfo.orderExts[index].width" placeholder="宽度(cm)" disabled />
                </el-form-item>
                <el-form-item label="克重">
                  <el-input v-model="orderInfo.orderExts[index].weight" placeholder="克重(g)" disabled />
                </el-form-item>
                <div v-if="orderInfo.orderType === 2">
                  <el-form-item label="米数">
                    <el-input v-model="orderInfo.orderExts[index].length" placeholder="米数(M)/筒" disabled />
                  </el-form-item>
                  <el-form-item label="个数">
                    <el-input-number v-model="orderInfo.orderExts[index].goodsNumber" :min="1" placeholder="下单数量" style="width:100%" />
                  </el-form-item>
                </div>
                <div v-else>
                  <el-form-item label="长度">
                    <el-input v-model="orderInfo.orderExts[index].goodsLength" placeholder="长度(cm)/条" />
                  </el-form-item>
                  <el-form-item label="条数">
                    <el-input-number v-model="orderInfo.orderExts[index].goodsNumber" :min="1" placeholder="下单条数" style="width:100%" />
                  </el-form-item>
                </div>
                <el-form-item label="单价">
                  <el-input v-model="orderInfo.orderExts[index].price" type="number" placeholder="单价(元)" />
                </el-form-item>
              </el-form>
              <div v-if="index > 0" style="text-align: center;"><el-button icon="el-icon-delete" @click="deleteGoods(index)">删除</el-button></div>
            </el-card>
          </el-col>
          <el-col :sm="24" :md="12" :lg="8" :xl="6">
            <el-card shadow="hover">
              <div class="plus">
                <el-tooltip class="item" effect="dark" content="点击添加" placement="top">
                  <i class="el-icon-plus" @click="addGoods" />
                </el-tooltip>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>
    </div>

    <div class="card mt20">
      <el-button type="primary" icon="el-icon-edit-outline" @click="saveOrderInfo">保存</el-button>
      <el-button type="primary" icon="el-icon-position" @click="saveOrSubmitOrderInfo">保存并提交</el-button>
      <el-button icon="el-icon-back" @click="$router.back()">返回</el-button>
    </div>
  </div>
</template>

<script>
import { getCustomes } from '@/api/user'
import { getOrderTypes, getExpress, saveOrder, submitOrder } from '@/api/order'
import { getValidateProducts } from '@/api/product'
export default {
  data() {
    return {
      props: {
        lazy: true
      },
      orderInfo: {
        makingType: 2,
        orderType: 2,
        orderExts: [
          {
            length: null,
            number: null,
            price: null,
            productId: null,
            requirement: null,
            goodsLength: null,
            goodsNumber: 1,
            weight: null,
            width: null
          }
        ],
        pcc: null
      },
      customeList: [],
      orderTypeList: [],
      productList: [],
      expresList: []
    }
  },
  mounted() {
    this.getCustomeList()
    this.getOrderTypeList()
    this.getValidateProductList()
    this.getExpresList()
  },
  methods: {
    getCustomeList() {
      getCustomes().then(res => {
        if (res.code === 10000) this.customeList = res.data
      })
    },
    getOrderTypeList() {
      getOrderTypes().then(res => {
        if (res.code === 10000) this.orderTypeList = res.data
      })
    },
    getValidateProductList() {
      getValidateProducts().then(res => {
        if (res.code === 10000) this.productList = res.data
      })
    },
    getExpresList() {
      getExpress().then(res => {
        if (res.code === 10000) this.expresList = res.data
      })
    },
    addGoods() {
      this.orderInfo.orderExts.push({ productNo: null, requirement: null, length: null, number: null, price: null, productId: null, goodsLength: 1, goodsNumber: 1, weight: null, width: null })
    },
    deleteGoods(index) {
      if (this.orderInfo.orderExts < 2) return
      this.orderInfo.orderExts.splice(index, 1)
    },
    saveOrderInfo() {
      const params = {
        ...this.orderInfo
      }
      saveOrder(params).then(res => {
        if (res.code === 10000) {
          this.$message({ message: '保存成功！', type: 'success' })
          this.$router.back()
        }
      })
    },
    saveOrSubmitOrderInfo() {
      const params = {
        ...this.orderInfo
      }
      submitOrder(params).then(res => {
        if (res.code === 10000) {
          this.$message({ message: '保存成功！', type: 'success' })
          this.$router.back()
        }
      })
    },
    changeProduct(index) {
      // const changeId = this.orderInfo.orderExts[index].productId
      // this.orderInfo.orderExts[index] = { ...(this.productList.find(item => item.id === changeId)) }

      const changeId = this.orderInfo.orderExts[index].productId
      const product = this.productList.find(item => item.id === changeId)
      this.orderInfo.orderExts[index].productNo = product.productNo
      this.orderInfo.orderExts[index].requirement = product.requirement
      this.orderInfo.orderExts[index].width = product.width
      this.orderInfo.orderExts[index].weight = product.weight
      this.orderInfo.orderExts[index].length = product.length
      this.orderInfo.orderExts[index].price = product.price
    }
  }
}
</script>

<style lang="scss" scoped>
.page{
  padding: 20px;
  background: #f2f2f2;
  .card{
    padding: 20px;
    background: #ffffff;
    border-radius: 4px;
    .title{
      font-weight: 500;
    }

  }
  .plus{
    min-height: 535px;
    line-height: 510px;
    text-align: center;
    font-size: 48px;
    i{cursor:pointer;}
  }
}
.mt5{
  margin-top: 5px;
}
.mt20{
  margin-top: 20px;
}
</style>
