<template>
  <div>
    <div id="print_box" v-loading="loading" class="print-box">
      <div style="width:100%;height:100%;">

        <div class="company">浙江亚设塑业有限公司</div>
        <div class="title">编织袋半成品退筒单</div>

        <img class="logo" src="../../../assets/imgs/arsh_logo.png">

        <div class="print">
          <el-button type="text" size="mini" icon="el-icon-close" style="color:#F56C6C" @click="$router.back()">关闭</el-button>
          <el-button type="text" size="mini" icon="el-icon-printer" @click="saveData">保存并打印</el-button>
        </div>

        <div class="bar">
          <el-row :gutter="10">
            <el-col :span="4" style="text-align: right">
              <span>客户: </span>
            </el-col>
            <el-col :span="8">
              <el-select v-model="bill.userId" placeholder="请选择付款人(客户)" filterable style="text-align:left">
                <el-option v-for="user in customeList" :key="user.loginName" :label="user.userName" :value="user.id" />
              </el-select>
            </el-col>
            <el-col :span="4" style="text-align: right">
              <span>日期:</span>
            </el-col>
            <el-col :span="8">
              <el-date-picker v-model="bill.collectionTime" style="text-align:left" type="date" value-format="yyyy-MM-dd" format="yyyy-MM-dd" placeholder="选择收款日期" />
            </el-col>
          </el-row>
        </div>

        <table style="border-collapse:collapse;border:none;" width="100%">
          <tr class="tr">
            <td>品名</td>
            <td>要求</td>
            <td>宽度</td>
            <td>克重</td>
            <td>长度</td>
            <td>个数</td>
            <td>条数</td>
            <td>重量</td>
            <td>车皮</td>
            <td>单价(吨)</td>
            <td>净重</td>
            <td>金额(元)</td>
            <td style="width:100px">备注</td>
          </tr>
          <tr v-for="(order,index) in bill.productList" :key="index" class="tr">
            <td class="lab" style="min-width:90px;">
              <el-input v-model=" bill.productList[index].name" class="p0" style="width:90px;" />
            </td>
            <td class="lab">
              <el-input v-model=" bill.productList[index].requirement" style="width:60px;" />
            </td>
            <td class="lab">
              <el-input v-model=" bill.productList[index].width" style="width:30px;" />
            </td>
            <td class="lab">
              <el-input v-model=" bill.productList[index].weight" style="width:30px;" />
            </td>
            <td class="lab">
              <el-input v-model=" bill.productList[index].goodsLength" style="width:30px;" />
            </td>
            <td class="lab">
              <el-input v-model=" bill.productList[index].goodsNumber" style="width:30px;" />
            </td>
            <td class="lab">
              <el-input v-model=" bill.productList[index].number" style="width:30px;" />
            </td>
            <td class="lab">
              <el-input v-model=" bill.productList[index].totalWeight" style="width:60px;" />
            </td>
            <td class="lab">
              <el-input v-model=" bill.productList[index].tareWeight" style="width:60px;" />
            </td>
            <td class="lab">
              <el-input v-model=" bill.productList[index].price" style="width:60px;" />
            </td>
            <td class="lab">
              {{ getWeight( bill.productList[index].totalWeight, bill.productList[index].tareWeight) }}
            </td>
            <td class="lab">
              {{ getAmount(bill.productList[index].price,bill.productList[index].totalWeight, bill.productList[index].tareWeight) }}
            </td>
            <td class="lab">
              <el-input v-model=" bill.productList[index].remark" style="width:80px;" />
            </td>
          </tr>
          <tr class="tr">
            <td class="lab">欠款:</td>
            <td class="text" style="text-align:left;padding-left: 15px" colspan="5">{{ getTotalPrice() | capitalAmount }}</td>
            <td class="lab">净重</td>
            <td class="text" colspan="3">{{ getTotalWeight() }}</td>
            <td class="lab">金额</td>
            <td class="text" colspan="2">{{ getTotalPrice() }}</td>
          </tr>
          <tr class="tr">
            <td class="lab">备注:</td>
            <td class="text" style="text-align:left;padding-left: 15px;" colspan="12">{{ bill.remark }}</td>
          </tr>
          <tr class="tr">
            <td class="lab">制单:</td>
            <td class="text" style="text-align:left;padding-left: 15px;" colspan="3">{{ name }}</td>
            <td class="lab">司机:</td>
            <td class="text" colspan="2">&nbsp;</td>
            <td class="lab">签收:</td>
            <td class="text" colspan="2">&nbsp;</td>
            <td class="lab" colspan="2">客户:</td>
            <td class="text" colspan="3">&nbsp;</td>
          </tr>
          <tr class="tr">
            <td class="foot" colspan="13">
              注：请客户仔细核对货物数量、重量、金额等信息再签字 销售电话：18868270138 传真电话：0577-80818808
            </td>
          </tr>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import {
  mapGetters
} from 'vuex'
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
      loading: false,
      customeList: [],
      bill: {
        feeType: 5,
        collectionTime: `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`,
        productList: [{
          name: null, // 品名
          requirement: null, // 要求
          width: null, // 宽度
          weight: null, // 克重
          goodsLength: null, // 长度
          goodsNumber: null, // 个数
          number: null, // 条数
          price: null, // 单价
          totalWeight: null, // 总重
          tareWeight: null, // 车皮
          remark: null // 备注
        },
        {
          name: null, // 品名
          requirement: null, // 要求
          width: null, // 宽度
          weight: null, // 克重
          goodsLength: null, // 长度
          goodsNumber: null, // 个数
          number: null, // 条数
          price: null, // 单价
          totalWeight: null, // 总重
          tareWeight: null, // 车皮
          remark: null // 备注
        },
        {
          name: null, // 品名
          requirement: null, // 要求
          width: null, // 宽度
          weight: null, // 克重
          goodsLength: null, // 长度
          goodsNumber: null, // 个数
          number: null, // 条数
          price: null, // 单价
          totalWeight: null, // 总重
          tareWeight: null, // 车皮
          remark: null // 备注
        },
        {
          name: null, // 品名
          requirement: null, // 要求
          width: null, // 宽度
          weight: null, // 克重
          goodsLength: null, // 长度
          goodsNumber: null, // 个数
          number: null, // 条数
          price: null, // 单价
          totalWeight: null, // 总重
          tareWeight: null, // 车皮
          remark: null // 备注
        },
        {
          name: null, // 品名
          requirement: null, // 要求
          width: null, // 宽度
          weight: null, // 克重
          goodsLength: null, // 长度
          goodsNumber: null, // 个数
          number: null, // 条数
          price: null, // 单价
          totalWeight: null, // 总重
          tareWeight: null, // 车皮
          remark: null // 备注
        }
        ],
        totalPrice: null,
        totalNetWeight: null
      }
    }
  },
  computed: {
    ...mapGetters([
      'name'
    ]),
    getWeight(totalWeight, tareWeight) {
      return function(totalWeight, tareWeight) {
        if (totalWeight && tareWeight) {
          return totalWeight - tareWeight
        } else {
          return null
        }
      }
    },
    getAmount(price, totalWeight, tareWeight) {
      return function(price, totalWeight, tareWeight) {
        if (price && totalWeight && tareWeight) {
          return price * (totalWeight - tareWeight) / 1000
        } else {
          return null
        }
      }
    },
    getTotalPrice() {
      return function() {
        let sum = 0
        this.bill.productList.map(item => {
          sum = sum + (item.price * (item.totalWeight - item.tareWeight) / 1000)
        })
        return sum
      }
    },
    getTotalWeight() {
      return function() {
        let sum = 0
        this.bill.productList.map(item => {
          sum = sum + (item.totalWeight - item.tareWeight)
        })
        return sum
      }
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
    saveData() {
      const tempArr = []
      this.bill.productList.map(item => {
        // 过滤 名称 和 重量 不为空
        if (item.name && item.name.trim() && item.totalWeight) {
          tempArr.push(item)
        }
      })
      const params = {
        ...this.bill
      }
      params.productList = tempArr
      submitReturnOrderBill({
        ...params
      }).then(res => {
        if (res.code === 10000) {
          // this.$message({
          //   message: '保存成功！！',
          //   type: 'success'
          // })
          // 调用打印
          this.clickPrinting()
        }
      })
    },
    clickPrinting() {
      //  找到需要隐藏的DOM节点
      const head = document.getElementsByClassName('navbar')[0]
      const printBtn = document.getElementsByClassName('print')[0]
      const leftNav = document.getElementsByClassName('el-scrollbar')[0]
      const sidebarContainer = document.getElementsByClassName('sidebar-container')[0]
      const mainContainer = document.getElementsByClassName('main-container')[0]

      const print_box = document.getElementById('print_box')

      //  给对应DOM添加class
      head.classList.add('printHideCss')
      printBtn.classList.add('printHideCss')
      leftNav.classList.add('printHideCss')
      sidebarContainer.classList.add('printHideCss')
      mainContainer.classList.add('clearCss')

      print_box.style.cssText = 'border: 0px;'

      window.print() //  调用打印功能
      // 返回到列表
      this.$router.back()
      window.location.reload() //  点击取消打印后刷新页面，恢复点击打印按钮之前的原始数据
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

    /deep/ .el-input__inner {
        height: 25px;
        color: black;
        font-size: 16px;
        text-align: center;
        line-height: 25px;
        padding: 0;
        border: 0;
        outline: none;
    }

    /deep/ .el-icon-arrow-up:before {
        content: "";
    }

    /deep/ .el-icon-date:before {
        content: "";
    }

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
        height: 40px;
        line-height: 40px;
        font-size: 16px;
        padding: 2px 0;
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
