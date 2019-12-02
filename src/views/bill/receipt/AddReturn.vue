<template>
  <div class="page">
    <div class="card">
      <el-form label-position="right" label-width="100px" :model="bill">
        <el-form-item label="收款日期 :">
          <el-date-picker v-model="bill.collectionTime" type="date" value-format="yyyy-MM-dd" format="yyyy-MM-dd" placeholder="选择收款日期" style="width:100%;" />
        </el-form-item>
        <el-form-item label="退筒人(客户) :">
          <el-select v-model="bill.userId" placeholder="请选择客户" filterable style="width:100%;">
            <el-option v-for="user in customeList" :key="user.loginName" :label="user.userName" :value="user.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="备注 :">
          <el-input v-model="bill.remark" type="textarea" placeholder="请输入备注" maxlength="100" show-word-limit />
        </el-form-item>
      </el-form>
    </div>

    <div class="card mt20">
      <div class="content">
        <el-row :gutter="20">
          <el-col v-for="(product,index) in bill.productList" :key="index" :sm="24" :md="12" :lg="8" :xl="6">
            <el-card shadow="hover" class="mb20 mh">
              <el-form label-position="right" label-width="90px" :model="bill">
                <el-form-item class="is-required" label="品名 :">
                  <el-input v-model="bill.productList[index].name" placeholder="请输入品名" />
                </el-form-item>
                <el-form-item label="要求 :">
                  <el-input v-model="bill.productList[index].requirement" placeholder="请输入要求" />
                </el-form-item>
                <el-form-item label="宽度(cm) :">
                  <el-input v-model="bill.productList[index].width" placeholder="请输入宽度(cm)" />
                </el-form-item>
                <el-form-item label="克重(cm) :">
                  <el-input v-model="bill.productList[index].weight" placeholder="请输入克重(cm)" />
                </el-form-item>
                <el-form-item label="长度 :">
                  <el-input v-model="bill.productList[index].goodsLength" placeholder="请输入长度" />
                </el-form-item>
                <el-form-item class="is-required" label="个数 :">
                  <el-input v-model="bill.productList[index].goodsNumber" placeholder="请输入个数" />
                </el-form-item>
                <el-form-item label="条数 :">
                  <el-input v-model="bill.productList[index].number" placeholder="请输入条数" />
                </el-form-item>
                <el-form-item class="is-required" label="单价(元) :">
                  <el-input v-model="bill.productList[index].price" placeholder="请输入单价(元)" />
                </el-form-item>

                <el-form-item class="is-required" label="重量(KG) :">
                  <el-input v-model="bill.productList[index].totalWeight" placeholder="请输入条数" />
                </el-form-item>
                <el-form-item label="车皮(KG) :">
                  <el-input v-model="bill.productList[index].tareWeight" placeholder="请输入条数" />
                </el-form-item>
                <el-form-item label="净重(KG) :">
                  <el-input placeholder="请输入条数" :value="bill.productList[index].totalWeight && bill.productList[index].tareWeight ? (bill.productList[index].totalWeight - bill.productList[index].tareWeight) : 0" />
                </el-form-item>

                <el-form-item label="金额(元) :">
                  <span style="font-size:28px;color:#f40;">{{ bill.productList[index].price ? bill.productList[index].price * (bill.productList[index].totalWeight - bill.productList[index].tareWeight)/1000 : '--' }} ¥</span>
                </el-form-item>
              </el-form>
              <div v-if="index > 0" style="text-align: center;">
                <el-button icon="el-icon-delete" type="danger" plain size="mini" @click="deleteGoods(index)">删除</el-button>
              </div>
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
      <div class="tar">
        <el-button icon=" el-icon-back">取消</el-button>
        <el-button icon="el-icon-save" :loading="saveLoading" type="primary" @click="saveData">保存</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import {
  getCustomes
} from '@/api/user'
import {
  submitReturnOrderBill
} from '@/api/bill'
export default {
  data() {
    const date = new Date()
    return {
      customeList: [],
      bill: {
        feeType: 5,
        collectionTime: `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`,
        productList: [{
          goodsNumber: 1,
          totalWeight: 1,
          tareWeight: 0
        }]
      },
      saveLoading: false
    }
  },
  mounted() {
    this.getCustomeList()
  },
  methods: {
    getCustomeList() {
      getCustomes().then(res => {
        if (res.code === 10000) this.customeList = res.data
      })
    },
    // init add
    addGoods() {
      this.bill.productList.push({
        goodsNumber: 1,
        totalWeight: 1,
        tareWeight: 0
      })
    },
    deleteGoods(index) {
      if (this.bill.productList < 2) return
      this.bill.productList.splice(index, 1)
    },
    saveData() {
      this.saveLoading = !this.saveLoading
      submitReturnOrderBill({
        ...this.bill
      }).then(res => {
        if (res.code === 10000) {
          console.log(res.data)
          this.$message({
            message: '保存成功！！',
            type: 'success'
          })
          this.$router.back()
        }
        this.saveLoading = !this.saveLoading
      }).catch(err => {
        this.$message({
          message: err.message,
          type: 'error'
        })
        this.saveLoading = !this.saveLoading
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.page {
    padding: 20px;
    background: #f2f2f2;

    .card {
        padding: 20px;
        background: #ffffff;
        border-radius: 4px;

        .plus {
            min-height: 790px;
            line-height: 710px;
            text-align: center;
            font-size: 48px;

            i {
                cursor: pointer;
            }
        }
    }
}

.mt20 {
    margin-top: 20px;
}

.mb20 {
    margin-bottom: 20px;
}

.mh {
    min-height: 830px;
}

.tar {
    text-align: right
}
</style>
