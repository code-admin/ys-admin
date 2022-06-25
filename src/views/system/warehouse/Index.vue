<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="12">
        <div class="filter-container">
          <el-input
            v-model="filter.remark"
            class="filter-item"
            placeholder="仓库名称"
            style="width: 200px"
            clearable
          />
          <el-button
            class="filter-item"
            type="primary"
            icon="el-icon-search"
            @click="queryData"
            >查询</el-button
          >
          <el-button class="filter-item" icon="el-icon-plus" @click="addWarehouse"
            >创建仓库</el-button
          >
        </div>

        <el-table :data="dataList" style="width: 100%" size="mini">
          <el-table-column prop="id" label="仓库编号" width="50" />
          <el-table-column prop="remark" label="仓库名称" width="160">
            <template slot-scope="{ row }">
              <div>
                <el-button type="text" @click="clickRow(row)">{{ row.remark }}</el-button>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="address" label="仓库地址" show-overflow-tooltip />
          <el-table-column prop="location" label="经纬度" width="180">
            <template slot-scope="{ row }">
              <div>
                {{ `${row.longitude},${row.latitude}` }}
              </div>
            </template>
          </el-table-column>
          <!-- <el-table-column prop="enable" label="禁用/启用" width="80">
            <template slot-scope="{ row }">
              <div>
                <el-switch v-model="row.active" @change="changeSwitch(row)" />
              </div>
            </template>
          </el-table-column> -->
          <el-table-column prop="action" label="操作" width="80">
            <template slot-scope="{ row }">
              <div>
                <el-popover :ref="row.id" placement="top" width="300" trigger="click">
                  <p>确定要删除此发货地址吗！！？</p>
                  <div style="text-align: right; margin: 0">
                    <el-button
                      size="mini"
                      type="text"
                      @click="
                        () => {
                          $refs[row.id].doClose();
                        }
                      "
                      >取消</el-button
                    >
                    <el-button type="danger" size="mini" plain @click="deleteById(row.id)"
                      >确 定</el-button
                    >
                  </div>
                  <el-button slot="reference" type="text" size="mini">删除</el-button>
                </el-popover>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <div class="block">
          <el-pagination
            v-show="total > 0"
            :current-page="filter.pageIndex"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="filter.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </el-col>
      <el-col :span="12">
        <el-form
          ref="warehouse"
          :model="warehouse"
          :rules="warehouseRules"
          label-width="80px"
          size="mini"
        >
          <el-form-item label="仓库名称">
            <el-input v-model="warehouse.remark" />
          </el-form-item>
          <el-form-item label="仓库地址">
            <el-input v-model="warehouse.address" readonly />
          </el-form-item>
          <el-form-item label="经纬度">
            <el-input v-model="warehouse.location" readonly />
          </el-form-item>
          <div class="map-box">
            <el-amap
              v-if="showMap"
              vid="edit_warehouse"
              :amap-manager="amapManager"
              :center="mapCenter"
              :zoom="mapZoom"
            />
          </div>
          <el-form-item>
            <div class="form-button">
              <el-button type="primary" @click="saveData('warehouse')"
                >保存仓库</el-button
              >
            </div>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import axios from "axios";
import { AMapManager } from "vue-amap";
import map from "@/config/map";
import { getOrgId } from "@/utils/auth";
import {
  getShippingAddressList,
  enable,
  saveShippingAddress,
} from "@/api/org";

export default {
  data() {
    return {
      orgId: getOrgId() ,
      filter: {
        orgId: getOrgId(),
        active:true,
        remark: "",
        pageIndex: 1,
        pageSize: 10,
      },
      dataList: [],
      total: 1,
      warehouse: {
        orgId: this.orgId,
      },
      warehouseRules: {
        remark: [
          { required: true, message: "请输入活动名称", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 1 到 10 个字符", trigger: "blur" },
        ],
        address: [{ required: true, message: "请选择仓库地址", trigger: "blur" }],
      },

      showMap: false,
      mapZoom: 15,
      mapCenter: [],
      amapManager: new AMapManager(),
    };
  },
  mounted() {
    this.getDataList();
    this.getMapCenterByIP();
  },
  methods: {
    getDataList() {
      getShippingAddressList(this.filter).then((res) => {
        this.dataList = res.data;
      });
    },

    addWarehouse() {
      this.warehouse = {
        orgId: this.orgId,
        remark: "",
        address: "",
        latitude: "",
        longitude: "",
      };
    },

    clickRow(row) {
      const { latitude, longitude } = row;
      this.warehouse = row;
      this.warehouse.location = [longitude, latitude];
      this.mapCenter = [longitude, latitude];
      this.mapZoom = 15;
    },
    saveData(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          saveShippingAddress(this.warehouse).then((res) => {
            this.$message({
              type: "success",
              message: res.message,
            });
            this.addWarehouse();
            this.getDataList();
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    changeSwitch(row) {
      const ags = {
        active: row.active,
        addressId: row.id,
      };
      enable(ags).then((res) => {
        this.$message({
          type: "success",
          message: res.message,
        });
      });
    },

    getMapCenterByIP() {
      const ip = window.returnCitySN["cip"];
      axios
        .get(
          `https://restapi.amap.com/v5/ip?output=json&ip=${ip}&type=4&key=${map.amap.WEB_KEY}`
        )
        .then((res) => {
          if (res.data.infocode === "10000") {
            this.mapCenter = res.data.location.split(",");
            this.showMap = true;
            this.initPositionPicker();
          }
        });
    },

    // 初始化地图选址组建
    initPositionPicker() {
      const that = this
      window.AMapUI.loadUI(["misc/PositionPicker"], (PositionPicker) => {
        const positionPicker = new PositionPicker({
          mode: "dragMap", // 设定为拖拽地图模式，可选'dragMap'、'dragMarker'，默认为'dragMap'
          map: that.amapManager.getMap(), // 依赖地图对象
        });
        positionPicker.on("success", (positionResult) => {
          that.warehouse.address = `${positionResult.address}`
          that.warehouse.location = `${positionResult.position.lat},${positionResult.position.lng}`
          that.warehouse.latitude = `${positionResult.position.lat}`
          that.warehouse.longitude = `${positionResult.position.lng}`
        })
        positionPicker.on("fail", (positionResult) => {
          console.log("fail结果：", positionResult)
        })
        // 注意一定要调用这个方法，不然没有效果的。
        positionPicker.start();
      });
    },

    // 删除仓库地址
    deleteById(id) {
      this.$refs[id].doClose();
       const ags = {
        active: false,
        addressId: id
      };
      enable(ags).then((res) => {
        this.getDataList();
        this.$message({
          type: "success",
          message: res.message,
        });
      });
    },

    queryData() {
      this.filter.pageIndex = 1;
      this.getDataList();
    },
    handleSizeChange(val) {
      this.filter.pageSize = val;
      this.getDataList();
    },
    handleCurrentChange(val) {
      this.filter.pageIndex = val;
      this.getDataList();
    },
  },
};
</script>

<style lang="scss" scoped>
.map-box {
  width: 100%;
  height: 380px;
}
.form-button {
  float: right;
  margin-top: 20px;
}
</style>
