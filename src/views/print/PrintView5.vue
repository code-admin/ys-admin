<template>
  <div>
    <div id="print_box" v-loading="loading" class="print-box">
      <div style="width:100%;height:100%;">

        <div class="company">浙江亚设塑业有限公司</div>
        <div class="title">
          {{
            print.type === 5 ? '收袋款':'其他款'
          }}

        </div>

        <img class="logo" src="../../assets/imgs/arsh_logo.png">

        <div class="print">
          <el-button type="text" size="mini" icon="el-icon-close" style="color:#F56C6C" @click="closeWindow">关闭</el-button>
          <el-button type="text" size="mini" icon="el-icon-printer" @click="clickPrinting">保存并打印</el-button>
        </div>

        <div class="bar">
          <el-row :gutter="10">
            <el-col :span="4" style="text-align: right">
              <span>付款人(客户): </span>
            </el-col>
            <el-col :span="8">
              {{ print.customerName }}
            </el-col>
            <el-col :span="4" style="text-align: right">
              <span>日期:</span>
            </el-col>
            <el-col :span="8">
              {{ print.functionTime | moment('YYYY-MM-DD') }}
            </el-col>
          </el-row>
        </div>

        <table style="border-collapse:collapse;border:none;" width="100%">
          <tr class="tr">
            <td class="lab">大写:</td>
            <td class="text" style="text-align:left;padding-left: 15px" colspan="4"><span v-if="print.totalAmount">{{ print.totalAmount | capitalAmount }}</span></td>
            <td class="lab">金额</td>
            <td class="text" colspan="2">
              <el-input v-model="print.totalAmount" />
            </td>
          </tr>
          <tr class="tr">
            <td class="lab">备注:</td>
            <td class="text" colspan="7">
              {{ print.remark }}
            </td>
          </tr>
          <tr class="tr">
            <td class="lab">制单:</td>
            <td class="text">{{ print.makingBy }}</td>
            <td>司机:</td>
            <td class="text" style="width:130px;">&nbsp;</td>
            <td>签收:</td>
            <td class="text" style="width:130px;">&nbsp;</td>
            <td>客户:</td>
            <td class="text" style="width:130px;">&nbsp;</td>
          </tr>
          <tr class="tr">
            <td class="foot" colspan="8">
              注：请客户仔细核对货物数量、重量、金额等信息再签字 销售电话：18868270138 传真电话：0577-80818808
            </td>
          </tr>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import { getPrintInfos } from '@/api/print'

export default {
  data() {
    return {
      loading: true,
      customeList: [],
      print: {}
    }
  },
  mounted() {
    this.getDetailById(this.$route.params.id)
  },
  methods: {
    getDetailById(params) {
      getPrintInfos(params).then(res => {
        this.print = res.data
        this.loading = !this.loading
      })
    },
    closeWindow() {
      window.close()
    },
    clickPrinting() {
      const printBtn = document.getElementsByClassName('print')[0]
      printBtn.classList.add('printHideCss')

      window.print() //  调用打印功能
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
