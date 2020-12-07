<template>
<div class="app-container">
    <div class="filter-container">
        <el-input v-model="filter.productNo" placeholder="品类编号" style="width: 200px;" class="filter-item" clearable />
        <el-input v-model="filter.productName" placeholder="品类名称" style="width: 200px;" class="filter-item" clearable />
        <el-button class="filter-item" type="primary" icon="el-icon-search" @click="queryData">查询</el-button>
        <el-button class="filter-item" icon="el-icon-plus" @click="addInit">添加</el-button>
    </div>
    <el-table v-loading="listLoading" :data="classList" border fit highlight-current-row style="width: 100%;">
        <el-table-column type="index" width="50" align="center" />
        <el-table-column label="品类编号" prop="id" align="center" show-overflow-tooltip />
        <el-table-column label="品类名称" prop="name" align="center" show-overflow-tooltip />
        <el-table-column label="备注" prop="description" align="center" show-overflow-tooltip />
        <el-table-column label="操作" align="center" show-overflow-tooltip>
            <template slot-scope="{row}">
                <div>
                    <el-popconfirm :key="row.id" confirm-button-text="确定" confirm-button-type="danger" cancel-button-text="取消" icon="el-icon-info" icon-color="red" title="您确定要删除该品类吗?" @confirm="confirmDelete(row)">
                        <el-button slot="reference" type="text" size="mini">删除</el-button>
                    </el-popconfirm>
                    <el-divider direction="vertical"></el-divider>
                    <el-button type="text" size="mini" @click="delete(row.id)">调价</el-button>
                </div>
            </template>
        </el-table-column>
    </el-table>
    <div class="block">
        <el-pagination v-show="total>0" :current-page="filter.pageIndex" :page-sizes="[10, 20, 50, 100]" :page-size="filter.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>

</div>
</template>

<script>
import {
  queryTypeList,
  deleteProductType
} from '@/api/product.js'
export default {
  data() {
    return {
      filter: {
        pageIndex: 1,
        pageSize: 10
      },
      listLoading: true,
      classList: [],
      total: 0
    }
  },
  mounted() {
    this.getDataList()
  },
  methods: {
    getDataList() {
      this.listLoading = true
      queryTypeList(this.filter).then(res => {
        this.classList = res.data
        this.total = res.total
        this.listLoading = !this.listLoading
      }).catch((err) => {
        console.log(err)
        this.listLoading = !this.listLoading
      })
    },
    // 新增初始化
    addInit() {
      console.log('添加初始化')
    },

    // 删除品类
    confirmDelete(obj) {
      deleteProductType(obj.id).then(res => {
        this.$message({
          type: 'success',
          message: res.message
        })
        this.getDataList()
      })
    },

    // 查询
    queryData() {
      this.filter.pageIndex = 1
      this.getDataList()
    },
    handleSizeChange(val) {
      this.filter.pageSize = val
      this.getDataList()
    },
    handleCurrentChange(val) {
      this.filter.pageIndex = val
      this.getDataList()
    }
  }
}
</script>

<style>
.el-pagination {
    padding-top: 20px;
}
</style>
