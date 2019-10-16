<template>
  <div class="app-container">

    <div v-if="!!tempData" class="filter-container">

      <el-popover ref="confirmSubmit" placement="top" width="150" trigger="click">
        <p>确定要提交入库吗？</p>
        <div style="text-align: right; margin: 0">
          <el-button size="mini" type="text" @click="()=>{$refs['confirmSubmit'].doClose()}">取消</el-button>
          <el-button type="primary" size="mini" @click="confirmSubmit()">确定</el-button>
        </div>
        <el-button slot="reference" class="filter-item" type="primary" size="mini" icon="el-icon-check">提交数据</el-button>
      </el-popover>

      <el-popover ref="resetData" placement="top" width="150" trigger="click">
        <p>确定要重新导入吗？</p>
        <div style="text-align: right; margin: 0">
          <el-button size="mini" type="text" @click="()=>{$refs['resetData'].doClose()}">取消</el-button>
          <el-button type="danger" size="mini" @click="resetData()">确定</el-button>
        </div>
        <el-button slot="reference" type="danger" size="mini" class="filter-item" icon="el-icon-close">重新导入</el-button>
      </el-popover>
      <el-button size="mini" class="filter-item" icon="el-icon-back" @click="$router.back()">返回</el-button>
    </div>
    <el-button v-else size="mini" class="filter-item" icon="el-icon-back" @click="$router.back()">返回</el-button>

    <el-table v-if="!!tempData" :data="tempData" border style="width: 100%" :row-class-name="tableRowClassName">
      <el-table-column type="index" width="50" align="center" />
      <el-table-column prop="className" label="班次" align="center" width="50" />
      <el-table-column prop="productDate" label="日期" align="center" width="100" />
      <el-table-column prop="deviceNo" label="机号" align="center" width="50" />
      <el-table-column prop="staffName" label="姓名" align="center" width="80" />
      <el-table-column prop="productName" label="名称" align="center" width="100" />
      <el-table-column prop="requirement" label="要求" align="center" width="120" />
      <el-table-column prop="productWidth" label="宽" align="center" width="40" />
      <el-table-column prop="productWeight" label="克重" align="center" width="50" />
      <el-table-column prop="productLength" label="米数" align="center" width="80" />
      <el-table-column prop="totalWeight" label="重量/公斤" align="center" width="90" />
      <el-table-column prop="realWeight" label="实际克重" align="center" width="80" />
      <el-table-column prop="diffWeight" label="克重差" align="center" width="70" />
      <el-table-column prop="salaryRate" label="工资率" align="center" width="80" />
      <el-table-column prop="salary" label="工资" align="center" width="70" />
      <el-table-column prop="bonus" label="奖金" align="center" width="70" />
      <el-table-column prop="penalty" label="罚款" align="center" width="70" />
      <el-table-column prop="realSalary" label="实际工资" align="center" width="80" />
      <el-table-column prop="errMsg" label="解析说明" align="left" show-overflow-tooltip />
    </el-table>

    <div v-else class="upload-wrap">
      <el-upload class="upload-demo" :show-file-list="false" :multiple="false" :with-credentials="true" drag action="/yase-backend/staffProduct/uploadFile" :before-upload="beforeUpload" :on-success="uploadSucess" :on-error="uploadError">
        <i class="el-icon-upload" />
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      </el-upload>
    </div>

  </div>
</template>

<script>
import { submitStaffProductRecords } from '@/api/produce'
export default {
  data() {
    return {
      tempData: null,
      spanArr: []
    }
  },
  methods: {
    beforeUpload() {
      this.$loading({
        lock: true,
        text: '正在为您解析上传的文件，请稍后……',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
    },
    uploadSucess(response, file, fileList) {
      if (response.code === 10000) {
        this.tempData = response.data
        // 合并行
        this.rowspan(this.tempData)
      } else {
        this.$message({
          message: response.message,
          type: 'error'
        })
      }
      this.$loading().close()
    },
    uploadError() {
      console.log('error')
      this.$loading().close()
    },
    tableRowClassName({
      row,
      rowIndex
    }) {
      if (row.errMsgFlag) {
        return 'warning-row'
      }
      return ''
    },
    rowspan(arrData) {
      let contactDot = 0
      arrData.forEach((item, index) => {
        item.index = index

        if (index === 0) {
          this.spanArr.push(1)
        } else {
          if (item.staffName === arrData[index - 1].staffName) {
            this.spanArr[contactDot] += 1
            this.spanArr.push(0)
          } else {
            this.spanArr.push(1)
            contactDot = index
          }
        }
      })
    },
    objectSpanMethod({
      row,
      column,
      rowIndex,
      columnIndex
    }) {
      // staffName
      if (columnIndex === 4) {
        const _row = this.spanArr[rowIndex]
        const _col = _row > 0 ? 1 : 0
        return {
          rowspan: _row,
          colspan: _col
        }
      }
    },
    confirmSubmit() {
      this.$refs['confirmSubmit'].doClose()
      if (this.checkData()) {
        this.submitData()
      } else {
        this.$message({
          message: '检测到不规范数据，请修改文件后再重新导入！',
          type: 'error'
        })
      }
      // this.submitData()
    },
    checkData() {
      let stu = true
      this.tempData.map(item => {
        if (item.errMsgFlag) {
          return stu = false
        }
      })
      return stu
    },
    resetData() {
      this.tempData = null
      this.spanArr = []
      this.$refs['resetData'].doClose()
    },
    submitData() {
      submitStaffProductRecords({
        productRecordList: this.tempData
      }).then(res => {
        if (res.code === 10000) {
          this.$message({
            message: '导入数据成功！',
            type: 'success'
          })
          this.$router.back()
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
    .upload-wrap {
        width: 100%;
        margin-top: 50px;
        text-align: center;
    }
}
</style>
<style>
.el-table .warning-row {
    background: oldlace;
}

.el-table .success-row {
    background: #f0f9eb;
}
</style>
