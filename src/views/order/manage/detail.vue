<template>
  <div v-loading="loading" class="page">
    <div class="card ">
      <div style="text-align: right">
        <el-button icon="el-icon-back" size="mini" @click="closeWindow">关闭</el-button>
      </div>
      <el-steps :active="orderInfo.status+1" finish-status="success" align-center>
        <el-step title="创建" />
        <el-step title="待审核" />
        <el-step title="待出库" />
        <el-step title="销售确认" />
        <el-step title="客户确认" />
        <el-step title="完成" />
      </el-steps>
    </div>

    <div class="card mt20 ">
      <div class="flex justify-between">
        <div class="title">订单号: {{ orderInfo.orderNo }}</div>
        <div class="value"> <i class="el-icon-time time">&nbsp; {{ orderInfo.orderTime | moment('YYYY-MM-DD') }}</i>
        </div>
      </div>
      <el-divider />
      <div class="mt20">
        <el-row :gutter="20">
          <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
            <el-row :gutter="10">
              <el-col :span="8">
                <div class="lable">客户:</div>
              </el-col>
              <el-col :span="16">
                <div class="val">{{ orderInfo.orderUserName }}</div>
              </el-col>
            </el-row>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
            <el-row :gutter="10">
              <el-col :span="8">
                <div class="lable">制单人类型:</div>
              </el-col>
              <el-col :span="16">
                <div class="val">
                  <el-button type="text" size="mini">{{ orderInfo.userTypeName }}</el-button>
                </div>
              </el-col>
            </el-row>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
            <el-row :gutter="10">
              <el-col :span="8">
                <div class="lable">制单人:</div>
              </el-col>
              <el-col :span="16">
                <div class="val">{{ orderInfo.createBy }}</div>
              </el-col>
            </el-row>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
            <el-row :gutter="10">
              <el-col :span="8">
                <div class="lable">发货方式:</div>
              </el-col>
              <el-col :span="16">
                <div class="val">{{ orderInfo.deliveryName }}</div>
              </el-col>
            </el-row>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
            <el-row :gutter="10">
              <el-col :span="8">
                <div class="lable">收货人:</div>
              </el-col>
              <el-col :span="16">
                <div class="val">{{ orderInfo.customerName }}</div>
              </el-col>
            </el-row>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
            <el-row :gutter="10">
              <el-col :span="8">
                <div class="lable">收货人电话:</div>
              </el-col>
              <el-col :span="16">
                <div class="val">{{ orderInfo.phone }}</div>
              </el-col>
            </el-row>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
            <el-row :gutter="10">
              <el-col :span="8">
                <div class="lable">收货地址:</div>
              </el-col>
              <el-col :span="16">
                <div class="val">{{ orderInfo.provinceName && orderInfo.cityName && orderInfo.districtName ? `${orderInfo.provinceName}${orderInfo.cityName}${orderInfo.districtName}${orderInfo.address}` : orderInfo.address }}</div>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
      </div>
    </div>

    <div class="card mt20">
      <div class="flex justify-between">
        <div class="title">下单类型: <el-tag type="primary" size="mini">{{ orderInfo.orderTypeName }}</el-tag>
        </div>
        <el-button size="mini" icon="el-icon-printer" @click="extractedGoods">打印提货单</el-button>
        <el-button v-if="orderInfo.status === 2 || orderInfo.status === 3" type="primary" plain size="mini" @click="batchInit">批量出库</el-button>
      </div>

      <el-divider />

      <el-table v-if="orderInfo.orderExts" :data="orderInfo.orderExts" style="width: 100%" size="mini" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="50" />
        <el-table-column prop="requirement" label="产品编号/名称" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-tag type="info" size="mini">{{ `${scope.row.product && scope.row.product.productNo} / ${scope.row.product && scope.row.product.name}` }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="requirement" label="要求" show-overflow-tooltip align="center" />
        <el-table-column prop="width" label="宽度(cm)" align="center" />
        <el-table-column prop="weight" label="克重(g)" align="center" />
        <el-table-column prop="goodsNumber" label="个数" align="center" />
        <el-table-column v-if="orderInfo.orderType === 1" prop="goodsLength" label="长度(cm)" align="center" />
        <el-table-column v-if="orderInfo.orderType === 1" prop="number" label="条数" align="center" />
        <el-table-column prop="totalDeliveryNumber" label="已出库" align="center" />

        <el-table-column prop="price" label="单价(吨)" align="center">

          <template slot-scope="scope">
            <div v-if="scope.row.price" style="color:#f40;">
              {{ scope.row.price }} ¥
              <el-button type="text" size="mini" @click="initPrice(scope.row, scope.$index, 0)">调价</el-button>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="备注" align="center" show-overflow-tooltip />
        <el-table-column v-if="orderInfo.status === 2 || orderInfo.status === 3" label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="text" size="mini" @click="showOutStock(scope.row,true)">出库</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="foot-btn">
        <el-button v-if="orderInfo.orderExpressList && orderInfo.orderExpressList.length === 0 && orderInfo.status <= 2" icon="el-icon-plus" size="mini" @click="addProductInit">添加产品</el-button>
      </div>
    </div>

    <div v-if="orderInfo.status > 1" class="card mt20">
      <div class="flex justify-between">
        <div class="title">出库记录</div>
        <el-button v-if="orderInfo.orderExpressList && orderInfo.orderExpressList.length && orderInfo.status >= 2" size="mini" icon="el-icon-printer" @click="handlePrint">打印出库单{{ printArr.length ? `(${printArr.length})` : '' }}</el-button>
        <el-button v-if="orderInfo.status === 2" type="primary" size="mini" @click="subType=0, initConfirm(0)">申请调价(销售)</el-button>
        <el-button v-if="orderInfo.status === 2" type="primary" size="mini" @click="subType=1, initConfirm(1)">申请改个数(销售)</el-button>

        <el-popover v-if="orderInfo.orderExpressList && orderInfo.orderExpressList.length && (orderInfo.status === 2 || orderInfo.status === 3)" v-model="finishVisible" placement="top" width="160">
          <p>确认要完成出库吗</p>
          <div style="text-align: right; margin: 0">
            <el-button size="mini" type="text" @click="finishVisible = false">取消</el-button>
            <el-button type="primary" size="mini" @click="confirmOutStock">确定</el-button>
          </div>
          <el-button v-if="orderInfo.status === 2" slot="reference" size="mini" type="danger">完成出库</el-button>
        </el-popover>

      </div>
      <el-divider />
      <el-table :data="orderInfo.orderExpressList" style="width: 100%" size="mini" @selection-change="changePrint">
        <el-table-column type="selection" width="60" :selectable="isCheck" />
        <el-table-column prop="productNo" label="产品编号/名称" align="center" width="140" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-tag type="info" size="mini">{{ `${scope.row.productNo} / ${scope.row.productName}` }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="requirement" label="要求" show-overflow-tooltip align="center" />
        <el-table-column prop="width" label="宽度(CM)" align="center" />
        <el-table-column prop="weight" label="克重(G)" align="center" />
        <el-table-column v-if="orderInfo.orderType === 1" prop="goodsLength" label="长度(cm)" align="center" />
        <el-table-column v-if="orderInfo.orderType === 1" prop="productNumber" label="条数" align="center" />
        <el-table-column prop="totalWeight" label="重量(KG)" align="center" />
        <el-table-column prop="tareWeight" label="车皮" align="center" />
        <el-table-column label="审核状态" align="center">
          <template slot-scope="scope">
            <div>
              <span v-if="scope.row.status === 2">审核中...</span>
              <span v-if="scope.row.status === 3">审核通过</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="price" label="单价(吨)" align="center" width="160">
          <template slot-scope="scope">
            <div v-if="scope.row.confirmPrice && scope.row.confirmPrice !== scope.row.price">
              <span class="confirm-price">{{ scope.row.confirmPrice }} ¥</span>
              <span class="price">{{ scope.row.price }} ¥</span>
              <el-button v-if="orderInfo.status === 2 && (scope.row.status ===1 || scope.row.status ===3)" type="text" size="mini" @click="initPrice(scope.row, scope.$index, 1)">调价</el-button>
            </div>
            <div v-else>
              <span>{{ scope.row.price }} ¥</span>
              <el-button v-if="orderInfo.status === 2 && (scope.row.status ===1 || scope.row.status ===3)" type="text" size="mini" @click="initPrice(scope.row, scope.$index, 1)">调价</el-button>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="number" label="出库个数" align="center" width="180">
          <template slot-scope="scope">
            <div v-if="scope.row.confirmNumber && scope.row.confirmNumber !== scope.row.number">
              <span class="confirm-price">{{ scope.row.confirmNumber }} 个</span>
              <span class="price">{{ scope.row.number }} 个</span>
              <el-button v-if="orderInfo.status === 2 && (scope.row.status ===1 || scope.row.status ===3) || orderInfo.status === 4 && (scope.row.status ===1 || scope.row.status ===3)" type="text" size="mini" @click="initNumber(scope.row, scope.$index)">修改</el-button>
            </div>
            <div v-else>
              <span>{{ scope.row.number }} 个</span>
              <el-button v-if="orderInfo.status === 2 && (scope.row.status ===1 || scope.row.status ===3) || orderInfo.status === 4 && (scope.row.status ===1 || scope.row.status ===3)" type="text" size="mini" @click="initNumber(scope.row, scope.$index)">修改</el-button>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="netWeight" label="净重(KG)" align="center" />
        <el-table-column prop="totalPrice" label="金额" align="center" />
        <el-table-column prop="expressTime" label="出库日期" width="90" />
        <el-table-column prop="createBy" label="记录人/时间" align="center" width="180" show-overflow-tooltip>
          <template slot-scope="scope">
            <div>
              {{ `${scope.row.createBy}/${scope.row.createTime}` }}
            </div>
          </template>
        </el-table-column>
        <el-table-column v-if="orderInfo.status === 2 || orderInfo.status === 3" label="操作" align="center" fixed="right" width="140">
          <template slot-scope="scope">
            <div v-if="scope.row.status === 0">
              <el-button type="text" size="mini" @click="deleteOutStock(scope.row.id)">删除</el-button>
              <el-button type="text" size="mini" @click="showOutStock(scope.row,false)">提交出库</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div class="totalPrice">
        <p>总金额: {{ orderInfo.totalPrice ? orderInfo.totalPrice : '--' }} ¥</p>
      </div>
    </div>

    <div class="card mt20">
      <div class="title">订单流转记录</div>
      <el-divider />
      <div class="content">
        <div v-if="!!orderInfo.orderHistoryList" class="block">
          <el-timeline>
            <el-timeline-item v-for="(item,index) in orderInfo.orderHistoryList" :key="item.id" :icon="index ? '' : 'el-icon-more' " :type="index ? '' : 'primary' " :timestamp="item.updateBy+'  '+item.updateTime" placement="top">
              <el-card>
                <span>{{ item.remark }}</span>
              </el-card>
            </el-timeline-item>
          </el-timeline>
        </div>
      </div>
    </div>

    <!-- 添加出库窗口 -->
    <!-- :span-method="objectSpanMethod" -->
    <el-dialog :close-on-click-modal="false" :title="`添加 ( ${orderInfo.orderNo} ) 订单出库`" :visible.sync="outStockVisible" width="80%">

      <el-dialog
        width="30%"
        title="确认日期"
        :visible.sync="innerVisible"
        append-to-body
      >
        <el-form label-position="right" label-width="80px" :model="orderProduct">
          <el-form-item label="出库日期">
            <el-date-picker v-model="expressTime" type="date" placeholder="选择日期" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button size="mini" @click="innerVisible = false">取 消</el-button>
          <el-button type="primary" icon="el-icon-finished" :loading="submitOutstockLoading" size="mini" @click="submitOutstock">确认</el-button>
        </div>
      </el-dialog>

      <div style="text-align:right; margin-bottom:10px;">
        <el-button type="primary" size="mini" @click="getDelivery()">获取出库数据</el-button>
      </div>
      <el-table :data="outStockList" size="mini">
        <el-table-column property="name" label="产品编号/名称" align="center" width="140" show-overflow-tooltip />
        <el-table-column property="requirement" label="要求" align="center" show-overflow-tooltip />
        <el-table-column property="width" label="宽度" align="center" />
        <el-table-column property="weight" label="克重" align="center" />
        <el-table-column prop="stockNumber" label="库存" align="center" />
        <el-table-column property="number" label="出库个数" align="center" width="160">
          <template slot-scope="scope">
            <el-input-number v-model="scope.row.number" :min="0" size="mini" :max="scope.row.stockNumber" placeholder="当前出库个数" />
          </template>
        </el-table-column>
        <el-table-column v-if="orderInfo.orderType === 1" prop="goodsLength" label="长度" align="center" width="160" />
        <el-table-column v-if="orderInfo.orderType === 1" prop="productNumber" label="出库条数" align="center" width="160">
          <template slot-scope="scope">
            <el-input-number v-model="scope.row.productNumber" :min="0" size="mini" />
          </template>
        </el-table-column>
        <el-table-column prop="totalWeight" label="重量(KG)" align="center" width="160">
          <template slot-scope="scope">
            <el-input-number v-model="scope.row.totalWeight" :min="0" size="mini" placeholder="请输入重量" />
          </template>
        </el-table-column>
        <el-table-column prop="tareWeight" label="车皮(KG)" align="center" width="160">
          <template slot-scope="scope">
            <el-input-number v-model="scope.row.tareWeight" :min="0" size="mini" placeholder="请输入车皮重量" />
          </template>
        </el-table-column>
        <el-table-column prop="price" label="单价(吨)" align="center" />
        <el-table-column prop="" label="净重(KG)" align="center">
          <template slot-scope="scope">
            <div>{{ scope.row.totalWeight - scope.row.tareWeight }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="e" label="金额" align="center" width="100">
          <template slot-scope="scope">
            <div v-if="scope.row.price" style="color:#f40;">
              {{ ((scope.row.totalWeight - scope.row.tareWeight)/1000*scope.row.price).toFixed(2) }} ¥
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" prop="index" align="center" fixed="right" width="80" type="index">
          <template slot-scope="scope">
            <div>
              <el-button type="text" size="mini" @click="changeNumber(scope.$index,scope.row)">调换货</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="outStockVisible = false">取 消</el-button>
        <el-button type="primary" icon="el-icon-edit-outline" :loading="saveOutStockLoading" @click="saveOutStock">保 存</el-button>
        <el-button type="primary" icon="el-icon-finished" @click="innerVisible=true, expressTime=new Date()">保存并出库</el-button>
      </div>
    </el-dialog>

    <!-- 调换货 -->
    <el-dialog ref="drawer2" title="产品调换货" :visible.sync="showExchange" direction="ltr" custom-class="demo-drawer">
      <div style="padding:20px">
        <el-form :model="exchange">
          <el-form-item label="入库产品" :label-width="formLabelWidth">
            <el-select v-model="exchange.plusStockProductId" filterable disabled placeholder="请选择入库产品" style="width:100%">
              <el-option v-for="product in productList" :key="product.id" :label="`${product.name}${product.width}${product.weight}/[${product.todaySaledNumber ? product.todaySaledNumber : 0}]/[${product.stockNumber}]`" :value="product.id" />
            </el-select>
          </el-form-item>
          <el-form-item label="出库商品" :label-width="formLabelWidth">
            <el-select v-model="exchange.reduceStockProductId" filterable placeholder="请选择入库产品" style="width:100%">
              <el-option v-for="product in productList" :key="product.id" :label="`${product.name}${product.width}${product.weight}/[${product.todaySaledNumber ? product.todaySaledNumber : 0}]/[${product.stockNumber}]`" :value="product.id" />
            </el-select>
          </el-form-item>
          <el-form-item label="重量" :label-width="formLabelWidth">
            <el-input-number v-model="exchange.netWeight" :min="1" placeholder="重量(KG)" />
          </el-form-item>
          <el-form-item label="数量" :label-width="formLabelWidth">
            <el-input-number v-model="exchange.stockNumber" :min="1" placeholder="克重(个)" />
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="showExchange = false">取 消</el-button>
          <el-button type="primary" @click="saveExchange">保 存</el-button>
        </span>
      </div>
    </el-dialog>

    <!-- 调价 -->
    <el-dialog :title="dialogTitle" :visible.sync="showTempPrice" width="300px">
      <el-form>
        <el-form-item label="原价:" :label-width="formLabelWidth">
          <el-input v-model="updatePrice.price" size="mini" disabled />
        </el-form-item>
        <el-form-item label="调价:" :label-width="formLabelWidth">
          <el-input v-model="updatePrice.confirmPrice" type="number" size="mini" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showTempPrice = false">取 消</el-button>
        <el-button type="primary" @click="savePrice">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 改数量 -->
    <el-dialog title="出库个数调整" :visible.sync="showTempNumber" width="300px">
      <el-form>
        <el-form-item label="原个数:" :label-width="formLabelWidth">
          <el-input v-model="updateNumber.number" size="mini" disabled />
        </el-form-item>
        <el-form-item label="调整个数:" :label-width="formLabelWidth">
          <el-input v-model="updateNumber.confirmNumber" type="number" size="mini" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showTempNumber = false">取 消</el-button>
        <el-button type="primary" @click="saveNumber">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 提交确认 -->
    <el-dialog title="提交确认" :visible.sync="showConfirm" :close-on-click-modal="false">
      <el-table :data="confirmData.priceChangeList" size="mini" style="width: 100%">
        <el-table-column prop="date" label="产品名称" width="180">
          <template slot-scope="scope">
            <div>
              {{ `${scope.row.productName}/${scope.row.requirement}/${scope.row.width}/${scope.row.weight}` }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="number" label="出库个数">
          <template slot-scope="scope">
            <div v-if="scope.row.confirmNumber && scope.row.confirmNumber !== scope.row.number">
              <span class="confirm-price">{{ scope.row.confirmNumber }} 个</span>
              <span class="price">{{ scope.row.number }} 个</span>
            </div>
            <div v-else>
              <span>{{ scope.row.number }} 个</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="date" label="单价" width="240">
          <template slot-scope="scope">
            <div v-if="scope.row.confirmPrice && scope.row.confirmPrice !== scope.row.price">
              <span class="confirm-price">{{ scope.row.confirmPrice }} ¥</span>
              <span class="price">{{ scope.row.price }} ¥</span>
            </div>
            <div v-else>
              <span>{{ scope.row.price }} ¥</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="" label="净重(KG)" align="center">
          <template slot-scope="scope">
            <div>{{ scope.row.totalWeight - scope.row.tareWeight }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="totalPrice" label="金额" align="center" width="100" />
        <el-table-column prop="date" label="操作">
          <template slot-scope="scope">
            <div>
              <el-button type="text" size="mini" @click="delRow(scope.$index)">删除</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showConfirm = false">取 消</el-button>
        <el-button type="primary" @click="submitConfirm()">确 认</el-button>
      </div>
    </el-dialog>

    <!-- 添加产品弹窗户 -->
    <el-dialog title="添加产品" :visible.sync="showAddProduct" :close-on-click-modal="false">
      <template>
        <div>
          <el-form label-position="right" label-width="80px" :model="orderProduct">
            <el-form-item label="产品编号">
              <el-input v-model="orderProduct.productNo" placeholder="产品编号" disabled />
            </el-form-item>
            <el-form-item label="产品名称">
              <el-select
                v-model="orderProduct.productId"
                placeholder="请选择产品"
                filterable
                remote
                :remote-method="searchProduct"
                loading-text="正在加载产品数据……"
                :loading="productLoading"
                style="width:100%;"
                @change="changeProduct()"
              >
                <el-option v-for="product in productList" :key="product.id" :label="`${product.name}${product.width}${product.weight}(${product.productNo})`" :value="product.id" />
              </el-select>
            </el-form-item>
            <el-form-item label="要求">
              <el-input v-model="orderProduct.requirement" readonly placeholder="要求" />
            </el-form-item>
            <el-form-item label="宽度">
              <el-input v-model="orderProduct.width" readonly placeholder="宽度(cm)" />
            </el-form-item>
            <el-form-item label="克重">
              <el-input v-model="orderProduct.weight" readonly placeholder="克重(g)" />
            </el-form-item>
            <div v-if="orderInfo.orderType === 2">
              <el-form-item label="米数">
                <el-input v-model="orderProduct.length" readonly placeholder="克重(g)" />
              </el-form-item>
            </div>
            <el-form-item label="库存">
              <el-input v-model="orderProduct.stockNumber" readonly placeholder="库存" />
            </el-form-item>
            <div v-if="orderInfo.orderType === 1">
              <el-form-item label="长度">
                <el-input v-model="orderProduct.goodsLength" placeholder="长度(cm)/条" />
              </el-form-item>
              <el-form-item label="条数">
                <el-input-number v-model="orderProduct.number" :min="1" placeholder="下单条数" style="width:100%" />
              </el-form-item>
            </div>
            <el-form-item label="个数">
              <el-input-number v-model="orderProduct.goodsNumber" :min="1" placeholder="下单数量" style="width:100%" />
            </el-form-item>
            <el-form-item label="单价">
              <el-input v-model="orderProduct.price" type="number" placeholder="单价(元)" />
            </el-form-item>
            <el-form-item label="备注">
              <el-input v-model="orderProduct.remark" placeholder="请输入备注" />
            </el-form-item>
          </el-form>

          <div slot="footer" class="dialog-footer">
            <el-button @click="showAddProduct = false">取 消</el-button>
            <el-button type="primary" @click="saveProduct">确 认</el-button>
          </div>
        </div>
      </template>
    </el-dialog>

  </div>
</template>

<script>
import axios from 'axios'
import {MESConfig} from '../../../settings.js'

import {
  getOrderById,
  saveDeliveryOrder,
  deleteDeliveryOrder,
  submitDeliveryOrder,
  confirmOut,
  updateOrderExtPrice,
  orderConfirmPrice,
  orderConfirmNumber,
  addOrderExt
  // updateExpressPrice,
  // updateExpressNumber
} from '@/api/order'
import {
  getValidateProducts,
  exchangeProductStock
} from '@/api/product'
import {
  getUsers
} from '@/api/user'
export default {
  data() {
    return {
      saveOutStockLoading: false,
      submitOutstockLoading: false,
      showAddProduct: false,
      loading: false,
      loadingUser: false,
      outStockVisible: false,
      finishVisible: false,
      productLoading: false,
      orderProduct: {},
      orderInfo: {},
      outStockList: null,
      userList: [],
      tempProducts: [],
      spanArr: [],
      printArr: [],
      expressTimes: [],
      productList: [],

      showExchange: false,
      formLabelWidth: '90px',
      exchange: {},
      tempIndex: null,
      dialogTitle: '',
      updatePrice: {},
      updateNumber: {},
      showTempPrice: false,
      showTempNumber: false,
      showConfirm: false,
      subType: 0,
      confirmData: {
        orderId: this.$route.params.id,
        priceChangeList: []
      },
      expressTime: new Date(),
      innerVisible: false
    }
  },
  mounted() {
    this.getDetailById(this.$route.params.id)
    this.getValidateProductList()
    // this.getUserList('')
  },
  methods: {
    getDetailById(id) {
      this.loading = !this.loading
      getOrderById(id).then(res => {
        if (res.code === 10000) this.orderInfo = res.data
        // 合并行
        // this.rowspan(this.orderInfo.orderExts)
        this.loading = !this.loading
      })
    },
    // 出库用户数据
    getUserList(userName) {
      this.loadingUser = !this.loadingUser
      getUsers({
        userName: `${userName}`.trim(),
        userType: '1',
        pageIndex: 1,
        pageSize: 100000
      }).then(res => {
        this.loadingUser = !this.loadingUser
        if (res.code === 10000) this.userList = res.data
      })
    },
    // 出库
    showOutStock(obj, isAdd) {
      this.outStockList = []
      this.outStockList.push({
        id: isAdd ? null : obj.id,
        orderId: this.orderInfo.orderNo,
        orderExtId: isAdd ? obj.id : obj.orderExtId,
        productId: obj.productId,
        stockNumber: obj.product.stockNumber,
        name: `${obj.product.productNo} / ${obj.product.name}`,
        requirement: obj.requirement,
        width: obj.width,
        weight: obj.weight,
        price: obj.price,
        number: isAdd ? 0 : obj.number,
        goodsLength: obj.goodsLength,
        productNumber: obj.productNumber || 0,
        totalWeight: obj.totalWeight || 0,
        tareWeight: obj.tareWeight || 0,
        driverLoginName: obj.driverLoginName || '',
        driverName: obj.driverName || '',
        driverPhone: obj.driverPhone || ''
      })
      this.outStockVisible = !this.outStockVisible
    },
    saveOutStock() {
      this.saveOutStockLoading = !this.saveOutStockLoading
      saveDeliveryOrder({
        orderExpressList: this.outStockList
      }).then(res => {
        if (res.code === 10000) {
          this.$message({
            message: '添加出库成功！',
            type: 'success'
          })
          this.getDetailById(this.$route.params.id)
          this.outStockVisible = !this.outStockVisible
        }
        this.saveOutStockLoading = !this.saveOutStockLoading
      }).catch(() => {
        this.saveOutStockLoading = !this.saveOutStockLoading
      })
    },
    submitOutstock() {
      this.expressTime = this.$moment(this.expressTime).format('YYYY-MM-DD')
      const expressList = this.outStockList.map(item => {
        return { ...item, expressTime: this.expressTime }
      })

      this.submitOutstockLoading = !this.submitOutstockLoading
      submitDeliveryOrder({
        orderExpressList: expressList
      }).then(res => {
        if (res.code === 10000) {
          this.$message({
            message: '提交出库成功！',
            type: 'success',
            duration: 500

          })
          // this.getDetailById(this.$route.params.id)
          this.outStockVisible = !this.outStockVisible
          this.$router.push({
            name: 'OrderPrinting',
            params: {
              id: this.orderInfo.id
            },
            query: {
              arr: res.data
            }
          })
        }
        this.submitOutstockLoading = !this.submitOutstockLoading
      }).catch(() => {
        this.submitOutstockLoading = !this.submitOutstockLoading
      })
    },
    deleteOutStock(id) {
      deleteDeliveryOrder(id).then(res => {
        this.$message({
          message: '删除成功！',
          type: 'success'
        })
        this.getDetailById(this.$route.params.id)
      })
    },
    confirmOutStock() {
      this.finishVisible = false
      confirmOut(this.$route.params.id).then(res => {
        if (res.code === 10000) {
          this.$message({
            message: '出库已完成！',
            type: 'success'
          })
          this.getDetailById(this.$route.params.id)
        }
      })
    },
    setUser(i) {
      const driverLoginName = this.outStockList[i].driverLoginName
      const user = this.userList.find(item => item.loginName === driverLoginName)
      this.outStockList[i].driverName = user.userName
      this.outStockList[i].driverPhone = user.phone
    },
    handleSelectionChange(val) {
      this.tempProducts = val
    },
    // 添加产品弹框
    addProductInit() {
      this.getValidateProductList()
      this.orderProduct = {
        productId: null,
        orderId: this.$route.params.id, // 订单Id
        length: null,
        number: null,
        price: null,
        requirement: null,
        goodsLength: null, // 按条出库   单个产品长度
        goodsNumber: null, // 订单数量
        weight: null,
        width: null,
        remark: null,
        productNo: null
      }
      this.showAddProduct = !this.showAddProduct
    },
    batchInit() {
      if (this.tempProducts.length) {
        this.outStockList = []
        this.tempProducts.map(obj => {
          this.outStockList.push({
            orderId: this.orderInfo.orderNo,
            orderExtId: obj.id,
            productId: obj.productId,
            stockNumber: obj.product.stockNumber,
            name: `${obj.product.productNo} / ${obj.product.name}`,
            requirement: obj.requirement,
            width: obj.width,
            weight: obj.weight,
            price: obj.price,
            goodsLength: obj.goodsLength,
            number: 0,
            productNumber: 0,
            totalWeight: 0,
            tareWeight: 0,
            driverLoginName: '',
            driverName: '',
            driverPhone: ''
          })
        })
        // 合并行
        this.rowspan(this.outStockList)
        this.outStockVisible = !this.outStockVisible
      } else {
        this.$notify({
          title: '提示',
          message: '请选择需要出库的商品'
        })
      }
    },

    rowspan(arrData) {
      let contactDot = 0
      arrData.forEach((item, index) => {
        item.index = index

        if (index === 0) {
          this.spanArr.push(1)
        } else {
          if (item.price === arrData[index - 1].price) {
            this.spanArr[contactDot] += 1
            this.spanArr.push(0)
          } else {
            this.spanArr.push(1)
            contactDot = index
          }
        }
      })
    },

    // 合并
    objectSpanMethod({
      row,
      column,
      rowIndex,
      columnIndex
    }) {
      if (columnIndex === 4) {
        const _row = this.spanArr[rowIndex]
        const _col = _row > 0 ? 1 : 0
        return {
          rowspan: _row,
          colspan: _col
        }
      }
      if (columnIndex === 5) {
        const _row = this.spanArr[rowIndex]
        const _col = _row > 0 ? 1 : 0
        return {
          rowspan: _row,
          colspan: _col
        }
      }
      if (columnIndex === 7) {
        const _row = this.spanArr[rowIndex]
        const _col = _row > 0 ? 1 : 0
        return {
          rowspan: _row,
          colspan: _col
        }
      }
      if (columnIndex === 8) {
        const _row = this.spanArr[rowIndex]
        const _col = _row > 0 ? 1 : 0
        return {
          rowspan: _row,
          colspan: _col
        }
      }
    },
    isCheck(row) {
      return row.status
    },
    changePrint(arr) {
      this.printArr = []
      this.expressTimes = []
      arr.forEach(item => {
        this.printArr.push(item.id)
        this.expressTimes.push(item.expressTime)
      })
    },
    extractedGoods() {
      this.$router.push({
        name: 'ExtractedPrint',
        params: {
          id: this.orderInfo.id
        }
      })
    },
    handlePrint() {
      const length = this.printArr.length
      if (!length) {
        this.$notify({
          title: '提示',
          message: '请选择需要打印的商品！'
        })
        return
      } else if (length > 5) {
        this.$notify({
          title: '提示',
          message: '超过了最大打印5个商品的范围！'
        })
        return
      } else if (!this.isAllEqual(this.expressTimes)) {
        this.$notify({
          title: '提示',
          message: '出库时间只能是同一天的！'
        })
      } else {
        this.$router.push({
          name: 'OrderPrinting',
          params: {
            id: this.orderInfo.id
          },
          query: {
            arr: this.printArr
          }
        })
      }
    },
    isAllEqual(array) {
      if (array.length > 0) {
        return !array.some(function(value, index) {
          return value !== array[0]
        })
      } else {
        return true
      }
    },
    changeNumber(index, obj) {
      this.getValidateProductList()
      this.exchange = {
        plusStockProductId: obj.productId,
        reduceStockProductId: null,
        netWeight: 1,
        stockNumber: 1
      }
      this.tempIndex = index
      this.showExchange = !this.showExchange
    },
    saveExchange() {
      exchangeProductStock(this.exchange).then(res => {
        if (res.code === 10000) {
          const i = this.tempIndex
          this.outStockList[i].stockNumber = this.outStockList[i].stockNumber + this.exchange.stockNumber
          this.getValidateProductList()
          this.$message({
            message: '操作成功！',
            type: 'success'
          })
          // todo
          this.showExchange = !this.showExchange
        }
      })
    },

    searchProduct(query) {
      if (query !== '') {
        this.productLoading = true
        this.productList = []
        getValidateProducts({ keywords: query.trim() }).then(res => {
          this.productLoading = false
          if (res.code === 10000) {
            this.productList = res.data
          }
        }).catch(err => {
          console.log(err.message)
          this.productLoading = false
          this.productList = []
        })
      }
    },
    getValidateProductList() {
      this.productLoading = true
      this.productList = []
      getValidateProducts({}).then(res => {
        this.productLoading = false
        if (res.code === 10000) {
          this.productList = res.data
        }
      }).catch(err => {
        console.log(err.message)
        this.productLoading = false
        this.productList = []
      })
    },
    // 关闭窗口
    closeWindow() {
      this.$confirm('确认关闭离开当前页面吗？')
        .then(_ => {
          window.close()
        })
        .catch(_ => {})
    },
    // 订单调价弹框
    initUpdatePrice(obj, i) {

    },

    // 调价弹框
    initPrice(obj, i, type) {
      this.updatePriceType = type
      if (type === 0) {
        this.dialogTitle = '订单调价'
      } else if (type === 1) {
        this.dialogTitle = '出库调价'
      }
      let confirmPrice = 0
      if (obj.confirmPrice) {
        confirmPrice = obj.confirmPrice
      } else {
        confirmPrice = obj.price
      }
      this.updatePrice = {
        index: i,
        id: obj.id,
        price: obj.price,
        confirmPrice: confirmPrice
      }
      this.showTempPrice = !this.showTempPrice
    },
    // 修改个数
    initNumber(obj, i) {
      let confirmNumber = 0
      if (obj.confirmNumber) {
        confirmNumber = obj.confirmNumber || 0
      } else {
        confirmNumber = obj.number
      }
      this.updateNumber = {
        index: i,
        id: obj.id,
        number: obj.number,
        confirmNumber: confirmNumber
      }
      this.showTempNumber = !this.showTempNumber
    },
    savePrice() {
      if (this.updatePriceType === 0) {
        if (this.updatePrice.price === this.updatePrice.confirmPrice) {
          this.showTempPrice = !this.showTempPrice
          return false
        } else {
          updateOrderExtPrice(this.updatePrice).then(res => {
            if (res.code === 10000) {
              this.$message({
                type: 'success',
                message: '修改成功'
              })
              this.getDetailById(this.$route.params.id)
            }
          })
        }
      } else if (this.updatePriceType === 1) {
        if (this.updatePrice.price === this.updatePrice.confirmPrice) {
          this.showTempPrice = !this.showTempPrice
          return false
        } else {
          const row = this.orderInfo.orderExpressList[this.updatePrice.index]
          row.confirmPrice = parseInt(this.updatePrice.confirmPrice)
          row.totalPrice = (row.totalWeight - row.tareWeight) * this.updatePrice.confirmPrice / 1000
        }
        let totalPrice = 0
        this.orderInfo.orderExpressList.map(item => {
          if (item.status !== 0) {
            totalPrice += item.totalPrice
          }
        })
        this.orderInfo.totalPrice = totalPrice.toFixed(2)
      }

      this.showTempPrice = !this.showTempPrice
    },
    // 保存个数
    saveNumber() {
      if (this.updateNumber.number === this.updateNumber.confirmNumber) {
        this.showTempNumber = !this.showTempNumber
        return false
      } else {
        const row = this.orderInfo.orderExpressList[this.updateNumber.index]
        row.confirmNumber = parseInt(this.updateNumber.confirmNumber)
      }
      // }
      this.showTempNumber = !this.showTempNumber
    },
    // 提交审核弹框
    initConfirm(type) {
      this.confirmData.priceChangeList = []
      this.orderInfo.orderExpressList && this.orderInfo.orderExpressList.map(item => {
        if (type === 0) {
          if (item.status !== 0 && item.status !== 2 && item.confirmPrice && item.confirmPrice !== item.price) this.confirmData.priceChangeList.push(item)
        } else if (type === 1) {
          if (item.status !== 0 && item.status !== 2 && item.confirmNumber && item.confirmNumber !== item.number) this.confirmData.priceChangeList.push(item)
        }
      })
      this.showConfirm = !this.showConfirm
    },
    delRow(index) {
      if (this.confirmData.priceChangeList.length < 2) {
        this.$message({
          message: '至少需要保留一条记录！！',
          type: 'error'
        })
        return false
      }
      this.confirmData.priceChangeList.splice(index, 1)
    },
    submitConfirm() {
      if (this.subType === 0) {
        orderConfirmPrice(this.confirmData).then(res => {
          if (res.code === 10000) {
            this.$message({
              type: 'success',
              message: '申请提交成功！'
            })
            this.getDetailById(this.$route.params.id)
            this.showConfirm = !this.showConfirm
          }
        })
      } else if (this.subType === 1) {
        this.confirmData.numberChangeList = this.confirmData.priceChangeList
        orderConfirmNumber(this.confirmData).then(res => {
          if (res.code === 10000) {
            this.$message({
              type: 'success',
              message: '申请提交成功！'
            })
            this.getDetailById(this.$route.params.id)
            this.showConfirm = !this.showConfirm
          }
        })
      }
    },
    // 添加产品选择产品
    changeProduct() {
      const product = this.productList.find(item => item.id === this.orderProduct.productId)
      this.orderProduct = {
        ...this.orderProduct,
        productNo: product.productNo,
        requirement: product.requirement,
        width: product.width,
        weight: product.weight,
        length: product.length,
        goodsLength: null,
        number: null,
        goodsNumber: 1,
        price: product.price,
        remark: null,
        stockNumber: product.stockNumber
      }
    },
    // 保存添加的产品
    saveProduct() {
      addOrderExt(this.orderProduct).then(res => {
        if (res.code === 10000) {
          this.$message({
            type: 'success',
            message: '保存成功！'
          })
          this.getDetailById(this.$route.params.id)
          this.showAddProduct = false
        }
      })
    },

    getDelivery(){
      const orderId = this.$route.params.id || ''
      axios.get(`${MESConfig.baseUrl}/aps/foreign/sale/getDelivery?orderNumber=${orderId}&companyId=${MESConfig.companyId}`).then(res => {
        if(res.status === 200){
          if(res.data.code === 200){
            console.log('tag', res.data.data)
          }
        }
      }).catch(err => {
        this.$message({
          type:'error',
          message:err.data.msg
        })
      })
    }
  }

}
</script>

<style lang="scss" scoped>
.page {
    padding: 20px;
    background: #f2f2f2;

    .card {
        padding: 20px;
        background: #ffffff;
        border-radius: 4px;
        font-size: 12px;
        line-height: 30px;

        .title {
            font-size: 14px;
            font-weight: 500;
        }

        .lable {
            color: #777777;
            text-align: right;
        }

        .value {
            color: #555555;
        }

        .foot-btn {
            margin: 20px;
            text-align: center;
        }

        .totalPrice {
            text-align: right;
            padding-right: 20px;
            font-size: 18px;
            font-weight: 500;
            color: #f40;
        }
    }

    .confirm-price {
        font-size: 18px;
        font-weight: 500;
        color: #f40;
    }

    .price {
        font-size: 11px;
        color: #888888;
        text-decoration: line-through
    }
    .dialog-footer{
      text-align: right;
    }
}

.mt20 {
    margin-top: 20px;
}

.flex {
    display: flex;
}

.justify-between {
    justify-content: space-between
}
</style>
