<template>
  <div class="app-container">
    <div class="title">
      <h3>规则详情</h3>
      <p>{{ this.rule.ruleName }}</p>
    </div>
    <el-divider content-position="left">调价规则</el-divider>
    <div>
      <el-row :gutter="10">
        <el-col :span="3">品类</el-col>
        <el-col :span="3">价格</el-col>
        <el-col :span="3">要求</el-col>
        <el-col :span="3">价格</el-col>
        <el-col :span="3">宽度</el-col>
        <el-col :span="3">价格</el-col>
        <el-col :span="3">克重</el-col>
        <el-col :span="3">价格</el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="3"
          ><p>{{ rule.typeName[0].name }}</p></el-col
        >
        <el-col :span="3"
          ><p>{{ rule.typeName[0].price }}</p></el-col
        >
        <el-col :span="3">
          <p v-for="(requirement, index) in rule.requirement" :key="index">
            {{ requirement.name }}
          </p>
        </el-col>
        <el-col :span="3"
          ><p v-for="(requirement, index) in rule.requirement" :key="index">
            {{ requirement.price }}
          </p></el-col
        >
        <el-col :span="3">
          <p v-for="(width, index) in rule.width" :key="index">
            {{ width.name }}
          </p></el-col
        >
        <el-col :span="3">
          <p v-for="(width, index) in rule.width" :key="index">
            {{ width.price}}
          </p></el-col
        >
        <el-col :span="3">
          <p v-for="(weight, index) in rule.weight" :key="index">
            {{ weight.name }}
          </p>
        </el-col>
        <el-col :span="3">
          <p v-for="(weight, index) in rule.weight" :key="index">
            {{ weight.price }}
          </p>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { getRuleById } from "@/api/adjusted.js";
export default {
  data() {
    return {
      activeNames: ["1", "2", "3", "4"],
      rule: {
        ruleName: "",
        typeName: [{ name: "增白", price: 8500 }],
        requirement: [
          {
            name: "中开",
            price: 100,
          },
          {
            name: "边开",
            price: 200,
          },
          {
            name: "覆膜",
            price: 400,
          },
        ],
        width: [
          {
            name: 20,
            price: 4100,
          },
          {
            name: 21,
            price: 3800,
          },
        ],
        weight: [
          {
            name: 50,
            price: 200,
          },
          {
            name: 51,
            price: 100,
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
      });
    },
  },
};
</script>

<style>
.rl-t10 {
  margin-top: 10px;
}
</style>
