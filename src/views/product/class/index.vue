<template>
<div class="app-container">
    <div class="filter-container">
        <el-input v-model="filter.typeNo" placeholder="品类编号" style="width: 200px;" class="filter-item" clearable />
        <el-input v-model="filter.name" placeholder="品类名称" style="width: 200px;" class="filter-item" clearable />
        <el-button class="filter-item" type="primary" icon="el-icon-search" @click="queryData">查询</el-button>
        <el-button class="filter-item" icon="el-icon-plus" @click="addInit">添加</el-button>
    </div>
    <el-table v-loading="listLoading" :data="classList" border fit highlight-current-row style="width: 100%;">
        <el-table-column type="index" width="50" align="center" />
        <el-table-column label="品类编号" prop="typeNo" align="center" show-overflow-tooltip />
        <el-table-column label="品类名称" prop="name" align="center" show-overflow-tooltip />
        <el-table-column label="备注" prop="description" align="center" show-overflow-tooltip />
        <el-table-column label="操作" align="center" show-overflow-tooltip>
            <template slot-scope="{row}">
                <div>
                    <el-popconfirm :key="row.id" confirm-button-text="确定" confirm-button-type="danger" cancel-button-text="取消" icon="el-icon-info" icon-color="red" title="您确定要删除该品类吗?" @confirm="confirmDelete(row)">
                        <el-button slot="reference" type="text" size="mini">删除</el-button>
                    </el-popconfirm>
                    <el-divider direction="vertical"></el-divider>
                    <el-button type="text" size="mini" @click="confirmExecute(row)">调价</el-button>
                </div>
            </template>
        </el-table-column>
    </el-table>

    <div class="block">
        <el-pagination v-show="total>0" :current-page="filter.pageIndex" :page-sizes="[10, 20, 50, 100]" :page-size="filter.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>

    <!-- 编辑品类 -->
    <el-dialog :title="title" :visible.sync="dialogFormVisible">
        <el-form :model="productType">
            <el-form-item label="品类编号" :label-width="formLabelWidth">
                <el-input v-model="productType.typeNo" autocomplete="off" placeholder="请输入品类编号" />
            </el-form-item>
            <el-form-item label="品类名称" :label-width="formLabelWidth">
                <el-input v-model="productType.name" autocomplete="off" placeholder="请输入品类名称" />
            </el-form-item>
            <el-form-item label="备注" :label-width="formLabelWidth">
                <el-input type="textarea" v-model="productType.description" autocomplete="off" placeholder="请输入品类名备注" />
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="saveData">保 存</el-button>
        </div>
    </el-dialog>

    <!-- 调价 -->
    <el-dialog title="调价" :visible.sync="dialogFormVisible2">
        <el-form :model="executeModel">
            <el-form-item label="目标品类" :label-width="formLabelWidth">
                <el-input v-model="executeModel.name" autocomplete="on" placeholder="请输入品类名称" />
            </el-form-item>
            <el-form-item label="执行规则" :label-width="formLabelWidth">
                <el-select v-model="executeModel.productRuleId" placeholder="请输选择调价规则" style="width:100%">
                    <el-option v-for="rule in ruleList" :key="rule.id" :label="rule.ruleName" :value="rule.id"></el-option>
                </el-select>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible2 = false">取 消</el-button>
            <el-button type="primary" @click="submitData">提交</el-button>
        </div>
    </el-dialog>

</div>
</template>

<script>
import {
  queryTypeList,
  saveProductType,
  deleteProductType,
  effectPrice
} from '@/api/product.js'
import {
  queryList
} from '@/api/adjusted.js'

export default {
  data() {
    return {
      ruleList: [],
      filter: {
        pageIndex: 1,
        pageSize: 10
      },
      listLoading: true,
      classList: [],
      total: 0,
      title: null,
      dialogFormVisible: false,
      formLabelWidth: '80px',
      productType: {},

      dialogFormVisible2: false,
      executeModel: {}
    }
  },
  mounted() {
    this.getDataList()
    this.getRuleList()
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
    getRuleList() {
      queryList({
        pageIndex: 1,
        pageSize: 10000000
      }).then(res => {
        this.ruleList = res.data
      })
    },
    // 新增初始化
    addInit() {
      this.title = '新增品类'
      this.productType = {
        typeNo: null,
        name: null,
        description: null
      }
      this.dialogFormVisible = !this.dialogFormVisible
    },
    // 保存品类
    saveData() {
      saveProductType(this.productType).then(res => {
        this.dialogFormVisible = !this.dialogFormVisible
        this.getDataList()
      })
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

    // 执行确认
    confirmExecute(obj) {
      this.executeModel = {
        productTypeId: obj.id,
        name: obj.name,
        productRuleId: null
      }
      this.dialogFormVisible2 = !this.dialogFormVisible2
    },

    submitData() {
      effectPrice(this.executeModel).then(res => {
        this.$message({
          type: 'success',
          message: `共更新 ${res.data.updateNumber}个产品；耗时${res.data.useTime} 秒！`
        })
        this.dialogFormVisible2 = !this.dialogFormVisible2
      })
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
