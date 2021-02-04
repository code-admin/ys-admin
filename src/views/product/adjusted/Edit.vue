<template>
  <div class="app-container">
    <div class="title">
      <h3>修改规则</h3>
    </div>
    <el-divider content-position="left">调价规则</el-divider>
    <div>
      <el-form>
        <el-form-item label="规则名称">
          <el-input v-model="rule.ruleName"></el-input>
        </el-form-item>

        <el-collapse v-model="activeNames">
          <el-collapse-item title="品类" name="1">
            <el-row :gutter="20">
              <el-col :span="11">品类名称</el-col>
              <el-col :span="11">单价</el-col>
              <el-col :span="2"></el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="11">
                <el-input
                  placeholder="请输入品类名称"
                  v-model="rule.typeName[0].name"
                ></el-input>
              </el-col>
              <el-col :span="11">
                <el-input
                  placeholder="请输入基础价"
                  v-model="rule.typeName[0].price"
                ></el-input>
              </el-col>
              <el-col :span="2"></el-col>
            </el-row>
          </el-collapse-item>
          <el-collapse-item title="要求" name="2">
            <el-row :gutter="20">
              <el-col :span="11">要求名称</el-col>
              <el-col :span="11">单价</el-col>
              <el-col :span="2"></el-col>
            </el-row>
            <el-row
              class="rl-t10"
              :gutter="20"
              v-for="(requirement, index) in rule.requirement"
              :key="index"
            >
              <el-col :span="11">
                <el-input
                  placeholder="请输入要求名称"
                  v-model="rule.requirement[index].name"
                ></el-input>
              </el-col>
              <el-col :span="11">
                <el-input
                  placeholder="请输入单价"
                  v-model="rule.requirement[index].price"
                ></el-input>
              </el-col>
              <el-col :span="2">
                <el-button
                  v-if="index + 1 === rule.requirement.length"
                  icon="el-icon-plus"
                  circle
                  @click="addRequirement()"
                ></el-button>
                <el-button
                  v-else
                  icon="el-icon-minus"
                  circle
                  @click="delRequirement(index)"
                ></el-button>
              </el-col>
            </el-row>
          </el-collapse-item>
          <el-collapse-item title="宽度" name="3">
            <el-row :gutter="20">
              <el-col :span="11">宽度</el-col>
              <el-col :span="11">单价</el-col>
              <el-col :span="2"></el-col>
            </el-row>
            <el-row
              class="rl-t10"
              :gutter="20"
              v-for="(width, index) in rule.width"
              :key="index"
            >
              <el-col :span="11">
                <el-input
                  placeholder="请输入宽度"
                  v-model="rule.width[index].name"
                ></el-input>
              </el-col>
              <el-col :span="11">
                <el-input
                  placeholder="请输入单价"
                  v-model="rule.width[index].price"
                ></el-input>
              </el-col>
              <el-col :span="2">
                <el-button
                  v-if="index + 1 === rule.width.length"
                  icon="el-icon-plus"
                  circle
                  @click="addWidth()"
                ></el-button>
                <el-button
                  v-else
                  icon="el-icon-minus"
                  circle
                  @click="delWidth(index)"
                ></el-button>
              </el-col>
            </el-row>
          </el-collapse-item>
          <el-collapse-item title="克重" name="4">
            <el-row :gutter="20">
              <el-col :span="11">克重</el-col>
              <el-col :span="11">单价</el-col>
              <el-col :span="2"></el-col>
            </el-row>
            <el-row
              :gutter="20"
              class="rl-t10"
              v-for="(weight, index) in rule.weight"
              :key="index"
            >
              <el-col :span="11">
                <el-input
                  placeholder="请输入克重"
                  v-model="rule.weight[index].name"
                ></el-input>
              </el-col>
              <el-col :span="11">
                <el-input
                  placeholder="请输入单价"
                  v-model="rule.weight[index].price"
                ></el-input>
              </el-col>
              <el-col :span="2">
                <el-button
                  v-if="index + 1 === rule.weight.length"
                  icon="el-icon-plus"
                  circle
                  @click="addWeight()"
                ></el-button>
                <el-button
                  v-else
                  icon="el-icon-minus"
                  circle
                  @click="delWeight(index)"
                ></el-button>
              </el-col>
            </el-row>
          </el-collapse-item>
        </el-collapse>
        <el-form-item style="margin-top: 20px">
          <el-button type="primary" @click="saveData()">保存</el-button>
          <el-button @click="reset()">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { getRuleById, saveRule } from "@/api/adjusted.js";
export default {
  data() {
    return {
      activeNames: ["1", "2", "3", "4"],
      rule: {
        ruleName: "",
        typeName: [{ name: null, price: null }],
        requirement: [
          {
            name: null,
            price: null,
          },
        ],
        width: [
          {
            name: null,
            price: null,
          },
        ],
        weight: [
          {
            name: null,
            price: null,
          },
        ],
      },
    };
  },
  mounted() {
    this.initData();
  },
  methods: {
    initData() {
      const productRuleId = this.$route.params.id;
      getRuleById(productRuleId).then((res) => {
        this.rule = res.data;
        if (!res.data.requirement.length) {
          this.rule.requirement = [
            {
              name: null,
              price: null,
            },
          ];
        }
        if (!res.data.width.length) {
          this.rule.width = [
            {
              name: null,
              price: null,
            },
          ];
        }
        if (!res.data.weight.length) {
          this.rule.weight = [
            {
              name: null,
              price: null,
            },
          ];
        }
      });
    },

    addRequirement() {
      this.rule.requirement.push({
        name: null,
        price: null,
      });
    },
    delRequirement(i) {
      this.rule.requirement.splice(i, 1);
    },
    addWidth() {
      this.rule.width.push({
        name: null,
        price: null,
      });
    },
    delWidth(i) {
      this.rule.width.splice(i, 1);
    },
    addWeight() {
      this.rule.weight.push({
        name: null,
        price: null,
      });
    },
    delWeight(i) {
      this.rule.weight.splice(i, 1);
    },
    saveData() {
      saveRule(this.rule).then((res) => {
        this.$message({
          type: "success",
          message: "保存成功！",
        });
        this.$router.back();
      });
    },
    reset() {
      this.initData();
    },
  },
};
</script>

<style>
.rl-t10 {
  margin-top: 10px;
}
</style>
