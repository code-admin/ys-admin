<template>
  <div class="app-container">
    <el-button size="mini" class="filter-item" icon="el-icon-back" @click="$router.back()">返回</el-button>
    <div v-loading="listLoading" style="margin-top:20px;">
      <el-table v-if="!!tempData" :data="tempData" border style="width: 100%">
        <el-table-column type="index" width="50" align="center" />
        <el-table-column prop="className" label="班次" align="center" width="50" />
        <el-table-column prop="productDate" label="日期" align="center" width="100" />
        <el-table-column prop="deviceNo" label="机号" align="center" width="50" />
        <el-table-column prop="staffName" label="姓名" align="center" width="80" />
        <el-table-column prop="productName" label="名称" align="center" width="100" />
        <el-table-column prop="requirement" label="要求" align="center" />
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
      </el-table>
    </div>

  </div>
</template>

<script>
import {
  getStaffProductRecordsByFileId
} from '@/api/produce'
export default {
  data() {
    return {
      listLoading: true,
      tempData: null,
      spanArr: []
    }
  },
  mounted() {
    this.getDataById(this.$route.params.id)
  },
  methods: {
    getDataById(id) {
      this.listLoading = true
      getStaffProductRecordsByFileId(id).then(res => {
        this.listLoading = !this.listLoading
        if (res.code === 10000) {
          this.tempData = res.data
          // 合并行
          this.rowspan(this.tempData)
        } else {
          this.$message({
            message: res.message,
            type: 'error'
          })
        }
      })
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
    }
  }
}
</script>

<style lang="scss" scoped>
.el-table .warning-row {
    background: oldlace;
}

.el-table .success-row {
    background: #f0f9eb;
}
</style>
