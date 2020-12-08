<template>
<div class="app-container">
    <div class="filter-container">
        <el-input v-model="filter.name" placeholder="规则名称" style="width: 200px;" class="filter-item" clearable />
        <el-button class="filter-item" type="primary" icon="el-icon-search" @click="queryData">查询</el-button>
        <el-button class="filter-item" icon="el-icon-plus" @click="addInit">添加</el-button>
    </div>
    <el-table v-loading="listLoading" :data="ruleList" border fit highlight-current-row style="width: 100%;">
        <el-table-column type="index" width="50" align="center" />
        <el-table-column label="规则名称" prop="ruleName" align="center" show-overflow-tooltip />
        <el-table-column label="基础价" prop="basicPrice" align="center" show-overflow-tooltip />
        <el-table-column label="其他" prop="otherPrice" align="center" show-overflow-tooltip />
        <el-table-column label="备注" prop="description" align="center" show-overflow-tooltip />
        <el-table-column label="操作" align="center" show-overflow-tooltip>
            <template slot-scope="{row}">
                <div>
                    <el-popconfirm :key="row.id" confirm-button-text="确定" confirm-button-type="danger" cancel-button-text="取消" icon="el-icon-info" icon-color="red" title="您确定要删除该调价规则吗?" @confirm="confirmDelete(row)">
                        <el-button slot="reference" type="text" size="mini">删除</el-button>
                    </el-popconfirm>
                    <el-divider direction="vertical"></el-divider>
                    <el-button type="text" size="mini" @click="editInit(row)">修改</el-button>
                    <el-divider direction="vertical"></el-divider>
                    <el-button type="text" size="mini" @click="detail(row)">查看</el-button>
                </div>
            </template>
        </el-table-column>
    </el-table>

    <div class="block">
        <el-pagination v-show="total>0" :current-page="filter.pageIndex" :page-sizes="[10, 20, 50, 100]" :page-size="filter.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>

    <!-- 编辑规则 -->
    <el-dialog :title="title" :visible.sync="dialogFormVisible">
        <el-form :model="rule" size="mini" label-width="80px">
            <el-form-item label="规则名称">
                <el-input v-model="rule.ruleName" autocomplete="off" placeholder="请输入品类名称" />
            </el-form-item>
            <el-form-item label="备注">
                <el-input type="textarea" v-model="rule.description" autocomplete="off" placeholder="请输入品类名备注" />
            </el-form-item>
            <el-divider content-position="left">调价规则</el-divider>
            <el-form-item label="基础单价">
                <el-input v-model="rule.basicPrice" autocomplete="off" placeholder="请输入基础单价" ><template slot="append">元/吨</template></el-input>
            </el-form-item>
            <el-form-item label="其他">
                <el-input v-model="rule.otherPrice" autocomplete="off" placeholder="请输入其他" ><template slot="append">元</template></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="saveData">保 存</el-button>
        </div>
    </el-dialog>

    <!-- 规则详情 -->
    <el-dialog title="规则详情" :visible.sync="dialogFormVisible2">
        <el-form :model="executeModel">
            <el-form-item label="规则名称:" :label-width="formLabelWidth">
              {{rule.ruleName}}
            </el-form-item>
            <el-form-item label="基础单价:" :label-width="formLabelWidth">
                {{rule.basicPrice  ? `${rule.basicPrice} 元/吨` : '--'}}
            </el-form-item>
            <el-form-item label="其他:" :label-width="formLabelWidth">
               {{rule.otherPrice  ? `${rule.otherPrice} 元` : '--'}}
            </el-form-item>
            <el-form-item label="备注:" :label-width="formLabelWidth">
                {{rule.description}}
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible2 = false">关 闭</el-button>
        </div>
    </el-dialog>

</div>
</template>

<script>
import {
  queryList,
  saveRule,
  deleteRuleById
} from '@/api/adjusted.js'
export default {
  name: 'Adjusted',
  data() {
    return {
      filter: {
        pageIndex: 1,
        pageSize: 10
      },
      listLoading: true,
      ruleList: [],
      total: 0,
      title: null,
      dialogFormVisible: false,
      formLabelWidth: '80px',
      rule: {},

      dialogFormVisible2: false,
      executeModel: {}
    }
  },
  mounted() {
    this.getDataList()
  },
  methods: {
    getDataList() {
      this.listLoading = true
      queryList(this.filter).then(res => {
        this.ruleList = res.data
        this.total = res.total
        this.listLoading = !this.listLoading
      }).catch((err) => {
        console.log(err)
        this.listLoading = !this.listLoading
      })
    },
    // 新增初始化
    addInit() {
      this.title = '新增规则'
      this.rule = {
        ruleName: null,
        description: null,
        basicPrice: null,
        otherPrice: 0
      }
      this.dialogFormVisible = !this.dialogFormVisible
    },
    // 修改初始化
    editInit(obj) {
      this.title = '修改规则'
      this.rule = {
        ...obj
      }
      this.dialogFormVisible = !this.dialogFormVisible
    },

    // 保存品类
    saveData() {
      saveRule(this.rule).then(res => {
        this.$message({
          type: 'success',
          message: res.message
        })
        this.dialogFormVisible = !this.dialogFormVisible
        this.getDataList()
      })
    },

    // 删除品类
    confirmDelete(obj) {
      deleteRuleById(obj.id).then(res => {
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
    detail(obj) {
      this.rule = { ...obj }
      this.dialogFormVisible2 = !this.dialogFormVisible2
    },

    submitData() {},

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
