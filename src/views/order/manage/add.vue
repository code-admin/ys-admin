<template>
  <div class="page">
    <div class="card">
      <el-steps :active="1" finish-status="success" align-center>
        <el-step title="创建" />
        <el-step title="审核" />
        <el-step title="出库" />
        <el-step title="待签" />
        <el-step title="确认" />
        <el-step title="完成" />
      </el-steps>
    </div>

    <div class="card mt20">
      <div class="title">基本信息</div>
      <div class="content mt20">
        <el-form label-position="right" label-width="80px" :model="orderInfo">
          <el-form-item label="下单人">
            <el-select v-model="orderInfo.orderUser" placeholder="请选择下单人" filterable style="width:100%;">
              <el-option v-for="user in customeList" :key="user.loginName" :label="user.userName" :value="user.loginName" />
            </el-select>
          </el-form-item>
          <el-form-item label="销售类型">
            <el-select v-model="orderInfo.orderType" placeholder="销售类型" style="width:100%;">
              <el-option v-for="(orderType,index) in orderTypeList" :key="index" :label="orderType.name" :value="orderType.id" />
            </el-select>
          </el-form-item>
        </el-form>
      </div>
    </div>

    <div class="card mt20">
      <div class="title">产品信息</div>
      <div class="content mt20">
        <el-row :gutter="20">
          <el-col v-for="(goods,index) in orderInfo.orderExts" :key="index" :sm="24" :md="12" :lg="8" :xl="6">
            <el-card shadow="hover" style="min-height:454px">
              <el-form label-position="right" label-width="80px" :model="orderInfo">
                <el-form-item label="产品">
                  <el-select v-model="orderInfo.orderExts[index].productId" placeholder="请选择产品类型" filterable clearable style="width:100%;" @change="changeProduct(index)">
                    <el-option v-for="product in productList" :key="product.id" :label="`${product.productNo} / ${product.name}`" :value="product.id" />
                  </el-select>
                </el-form-item>
                <el-form-item label="要求">
                  <el-input v-model="orderInfo.orderExts[index].requirement" placeholder="请输入要求" />
                </el-form-item>
                <el-form-item label="宽度">
                  <el-input v-model="orderInfo.orderExts[index].width" placeholder="宽度(cm)" />
                </el-form-item>
                <el-form-item label="克重">
                  <el-input v-model="orderInfo.orderExts[index].weight" placeholder="克重(g)" />
                </el-form-item>
                <el-form-item v-if="orderInfo.orderType === 2" label="个数">
                  <el-input v-model="orderInfo.orderExts[index].number" placeholder="请输入个数" />
                </el-form-item>
                <el-form-item v-else label="长度">
                  <el-input v-model="orderInfo.orderExts[index].length" placeholder="长度(cm)" />
                </el-form-item>
                <el-form-item label="单价">
                  <el-input v-model="orderInfo.orderExts[index].price" placeholder="单价(元)" />
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
      <div class="title">收货信息</div>
      <div class="content mt20">
        <el-form label-position="right" label-width="80px" :model="orderInfo">
          <el-form-item label="发货方式">
            <el-select v-model="orderInfo.deliveryType" placeholder="请选择发货方式" filterable style="width:100%;">
              <el-option v-for="expres in expresList" :key="expres.id" :label="expres.name" :value="expres.id" />
            </el-select>
          </el-form-item>
          <el-form-item label="收货地址">
            <el-cascader v-model="orderInfo.pcc" :props="props" clearable placeholder="省/市/区" style="width:100%;" />
            <el-input v-model="orderInfo.address" class="mt5" placeholder="请输入详细地址" />
          </el-form-item>
          <el-form-item label="联系方式">
            <el-input v-model="orderInfo.phone" placeholder="请输入联系方式" />
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
import { getProvinces, getCitys, getCountrys, getTowns } from '@/api/common'
export default {
  data() {
    return {
      props: {
        lazy: true,
        lazyLoad(node, resolve) {
          const { level, value } = node
          if (level === 0) {
            getProvinces().then(res => {
              const nodes = []
              if (res.code === 10000 && res.data.length) {
                res.data.map(item => {
                  nodes.push({
                    value: item.provinceId,
                    label: item.name
                  })
                })
                resolve(nodes)
              }
            })
          } else if (level === 1) {
            getCitys(value).then(res => {
              const nodes = []
              if (res.code === 10000 && res.data.length) {
                res.data.map(item => {
                  nodes.push({
                    value: item.cityId,
                    label: item.name
                  })
                })
                resolve(nodes)
              }
            })
          } else if (level === 2) {
            getCountrys(value).then(res => {
              const nodes = []
              if (res.code === 10000 && res.data.length) {
                res.data.map(item => {
                  nodes.push({
                    value: item.countryId,
                    label: item.name,
                    leaf: level >= 2
                  })
                })
                resolve(nodes)
              }
            })
          } else if (level === 3) {
            getTowns(value).then(res => {
              const nodes = []
              if (res.code === 10000 && res.data.length) {
                res.data.map(item => {
                  nodes.push({
                    value: item.townId,
                    label: item.name,
                    leaf: level >= 3
                  })
                })
                resolve(nodes)
              }
            })
          }
        }
      },
      orderInfo: {
        orderType: 2,
        orderExts: [
          {
            length: null,
            number: null,
            price: null,
            productId: null,
            requirement: null,
            totalPrice: 0,
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
      this.orderInfo.orderExts.push({ requirement: null, length: null, number: null, price: null, productId: null, totalPrice: 0, weight: null, width: null })
    },
    deleteGoods(index) {
      if (this.orderInfo.orderExts < 2) return
      this.orderInfo.orderExts.splice(index, 1)
    },
    saveOrderInfo() {
      const params = {
        ...this.orderInfo,
        province: this.orderInfo.pcc[0],
        city: this.orderInfo.pcc[1],
        district: this.orderInfo.pcc[2]
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
        ...this.orderInfo,
        province: this.orderInfo.pcc[0],
        city: this.orderInfo.pcc[1],
        district: this.orderInfo.pcc[2]
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
      this.orderInfo.orderExts[index].requirement = product.requirement
      this.orderInfo.orderExts[index].width = product.width
      this.orderInfo.orderExts[index].weight = product.weight
      this.orderInfo.orderExts[index].number = product.number
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
    min-height: 412px;
    line-height: 402px;
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
