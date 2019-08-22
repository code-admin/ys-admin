<template>
  <div class="page">
    <div class="card ">
      <div class="flex justify-between">
        <div class="title">反馈信息</div>
        <div><el-button type="primary" size="mini" @click="updateRemarkVisible = true,updateRemark=feedback.remark">修改备注</el-button></div>
      </div>
      <el-divider />
      <div class="content">
        <el-row :gutter="20">
          <el-col :sm="12" :md="8" :lg="6">
            <el-row :gutter="20">
              <el-col :span="8">
                <div class="lable">
                  反馈时间:
                </div>
              </el-col>
              <el-col :span="16">
                <div class="value">
                  <i class="el-icon-time" style="padding-right:10px" /> {{ feedback.createTime }}
                </div>
              </el-col>
            </el-row>
          </el-col>
          <el-col :sm="12" :md="8" :lg="6">
            <el-row :gutter="20">
              <el-col :span="8">
                <div class="lable">
                  问题类型:
                </div>
              </el-col>
              <el-col :span="16">
                <div class="value">
                  {{ feedback.questionTypeName }}
                </div>
              </el-col>
            </el-row>
          </el-col>
          <el-col :sm="12" :md="8" :lg="6">
            <el-row :gutter="20">
              <el-col :span="8">
                <div class="lable">
                  客户名称:
                </div>
              </el-col>
              <el-col :span="16">
                <div class="value">
                  {{ feedback.customerName }}
                </div>
              </el-col>
            </el-row>
          </el-col>

          <el-col :sm="12" :md="8" :lg="6">
            <el-row :gutter="20">
              <el-col :span="8">
                <div class="lable">
                  订单编号:
                </div>
              </el-col>
              <el-col :span="16">
                <div class="value">
                  {{ feedback.orderNo }}
                </div>
              </el-col>
            </el-row>
          </el-col>
          <el-col :sm="12" :md="8" :lg="6">
            <el-row :gutter="20">
              <el-col :span="8">
                <div class="lable">
                  订单时间:
                </div>
              </el-col>
              <el-col :span="16">
                <div class="value">
                  {{ feedback.orderTime }}
                </div>
              </el-col>
            </el-row>
          </el-col>

          <el-col :sm="12" :md="8" :lg="6">
            <el-row :gutter="20">
              <el-col :span="8">
                <div class="lable">
                  生产时间:
                </div>
              </el-col>
              <el-col :span="16">
                <div class="value">
                  <i class="el-icon-time" style="padding-right:10px" />{{ feedback.productDate }}
                </div>
              </el-col>
            </el-row>
          </el-col>
          <el-col :sm="12" :md="8" :lg="6">
            <el-row :gutter="20">
              <el-col :span="8">
                <div class="lable">
                  机台号:
                </div>
              </el-col>
              <el-col :span="16">
                <div class="value">
                  {{ feedback.deviceNo }}
                </div>
              </el-col>
            </el-row>
          </el-col>
          <el-col :sm="12" :md="8" :lg="6">
            <el-row :gutter="20">
              <el-col :span="8">
                <div class="lable">
                  品种:
                </div>
              </el-col>
              <el-col :span="16">
                <div class="value">
                  <el-tag size="mini">{{ feedback.productTypeName }}</el-tag>
                </div>
              </el-col>
            </el-row>
          </el-col>

          <el-col :sm="12" :md="8" :lg="6">
            <el-row :gutter="20">
              <el-col :span="8">
                <div class="lable">
                  要求:
                </div>
              </el-col>
              <el-col :span="16">
                <div class="value">
                  {{ feedback.requirement }}
                </div>
              </el-col>
            </el-row>
          </el-col>
          <el-col :sm="12" :md="8" :lg="6">
            <el-row :gutter="20">
              <el-col :span="8">
                <div class="lable">
                  宽度:
                </div>
              </el-col>
              <el-col :span="16">
                <div class="value">
                  {{ feedback. width }}
                </div>
              </el-col>
            </el-row>
          </el-col>
          <el-col :sm="12" :md="8" :lg="6">
            <el-row :gutter="20">
              <el-col :span="8">
                <div class="lable">
                  长度:
                </div>
              </el-col>
              <el-col :span="16">
                <div class="value">
                  {{ feedback.length }}
                </div>
              </el-col>
            </el-row>
          </el-col>

          <el-col :sm="12" :md="8" :lg="6">
            <el-row :gutter="20">
              <el-col :span="8">
                <div class="lable">
                  克重:
                </div>
              </el-col>
              <el-col :span="16">
                <div class="value">
                  {{ feedback.weight }}
                </div>
              </el-col>
            </el-row>
          </el-col>
          <el-col :sm="12" :md="8" :lg="6">
            <el-row :gutter="20">
              <el-col :span="8">
                <div class="lable">
                  个数:
                </div>
              </el-col>
              <el-col :span="16">
                <div class="value">
                  {{ feedback.length }}
                </div>
              </el-col>
            </el-row>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :sm="12" :md="8" :lg="6">
            <el-row :gutter="20">
              <el-col :span="8">
                <div class="lable">
                  具体说明:
                </div>
              </el-col>
              <el-col :span="16">
                <div class="value">
                  {{ feedback.description }}
                </div>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :sm="12" :md="8" :lg="6">
            <el-row :gutter="20">
              <el-col :span="8">
                <div class="lable">
                  备注:
                </div>
              </el-col>
              <el-col :span="16">
                <div class="value">
                  {{ feedback.remark }}
                </div>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
      </div>
    </div>

    <div class="card mt20">
      <div class="flex justify-between">
        <div class="title">回馈信息</div>
        <div><el-button type="primary" size="mini" @click="addRemarkVisible = !addRemarkVisible,remark.description=null">添加回馈</el-button></div>
      </div>
      <el-divider />
      <div class="content">
        <div v-if="!!remarkList" class="block">
          <el-timeline>
            <el-timeline-item v-for="(item,index) in remarkList" :key="item.id" :icon="index ? '' : 'el-icon-more' " :type="index ? '' : 'primary' " :timestamp="item.createBy+'  '+item.createTime" placement="top">
              <el-card>
                <p>{{ item.description }}</p>
              </el-card>
            </el-timeline-item>
          </el-timeline>
        </div>
      </div>
    </div>

    <!-- 修改备注 -->
    <el-dialog title="修改备注" :visible.sync="updateRemarkVisible">
      <el-form :model="feedback">
        <el-form-item label="备注" label-width="80px">
          <el-input v-model="updateRemark" type="textarea" :autosize="{ minRows: 2, maxRows: 4}" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="updateRemarkVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateFeedbackDetail">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 添加回馈 -->
    <el-dialog title="添加回馈" :visible.sync="addRemarkVisible">
      <el-form :model="remark">
        <el-form-item label="回馈信息" label-width="80px">
          <el-input v-model="remark.description" type="textarea" :autosize="{ minRows: 2, maxRows: 4}" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addRemarkVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveRemark">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { feedbackDetailById, getRemarkListByFeedBackId, addRemark, updateFeedback } from '@/api/feedback'
export default {
  data() {
    return {
      updateRemarkVisible: false,
      addRemarkVisible: false,
      id: this.$route.params.id,
      feedback: {},
      updateRemark: '',
      remark: {
        feedbackId: this.$route.params.id,
        description: null
      },
      remarkList: []
    }
  },
  mounted() {
    this.getFeedbackDetailById(this.id)
    this.getRemarkListById(this.id)
  },
  methods: {
    getFeedbackDetailById(id) {
      feedbackDetailById(id).then(res => {
        if (res.code === 10000) this.feedback = res.data
      })
    },
    getRemarkListById(id) {
      getRemarkListByFeedBackId(id).then(res => {
        if (res.code === 10000) this.remarkList = res.data
      })
    },
    updateFeedbackDetail() {
      updateFeedback({ ...this.feedback, remark: this.updateRemark }).then(res => {
        if (res.code === 10000) {
          this.$message({
            message: '添加成功！',
            type: 'success'
          })
          this.getFeedbackDetailById(this.id)
        }
        this.updateRemarkVisible = !this.updateRemarkVisible
      })
    },
    saveRemark() {
      addRemark(this.remark).then(res => {
        if (res.code === 10000) {
          this.$message({
            message: '添加成功！',
            type: 'success'
          })
          this.getRemarkListById(this.id)
        }
        this.addRemarkVisible = !this.addRemarkVisible
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.page{
  padding: 20px;
  background: #f2f2f2;

  .card{
    background: #ffffff;
    padding: 20px;
    border-radius: 4px;
    .title{
      font-weight: 600;
      line-height: 28px;
    }
    .content{
      margin-bottom: 15px;
      font-size: 12px;
      line-height: 28px;
      .lable{
        color: #777777;
        text-align: right;
      }
      .value{
        color: #444444;
        font-weight: 500;
      }
    }
  }
}
.mt20{
  margin-top: 20px;
}
.flex{
  display: flex;
}
.justify-between{
  justify-content: space-between;
}
</style>
