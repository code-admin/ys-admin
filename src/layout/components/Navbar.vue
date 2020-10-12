<template>
  <div class="navbar">
    <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />

    <breadcrumb class="breadcrumb-container" />

    <div class="right-menu">
      <div class="user-name">{{ name }}</div>
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <img :src="avatar+'?imageView2/1/w/80/h/80'" class="user-avatar">
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <router-link to="/">
            <el-dropdown-item icon="dashboard">
              <svg-icon icon-class="dashboard" />&nbsp;首页
            </el-dropdown-item>
          </router-link>
          <!-- <a target="_blank" href="https://github.com/PanJiaChen/vue-admin-template/">
            <el-dropdown-item>Github</el-dropdown-item>
          </a>
          -->
          <div @click="updatePwdModal=true, updatePwd = {}">
            <el-dropdown-item icon="el-icon-key">
              <span>修改密码</span>
            </el-dropdown-item>
          </div>
          <div @click="logout">
            <el-dropdown-item icon="el-icon-switch-button" divided>
              <span>退出</span>
            </el-dropdown-item>
          </div>
        </el-dropdown-menu>
      </el-dropdown>
    </div>

    <!-- 修改密码 -->
    <el-dialog title="修改密码" :visible.sync="updatePwdModal" append-to-body :close-on-click-modal="false" width="600px">
      <el-form ref="resetPwdForm" :model="updatePwd" :rules="pwdRules" label-width="80px">
        <el-form-item label="当前密码" prop="oldPassword">
          <el-input v-model="updatePwd.oldPassword" show-password />
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input v-model="updatePwd.newPassword" show-password />
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input v-model="updatePwd.confirmPassword" show-password />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="updatePwdModal = false">取 消</el-button>
        <el-button type="primary" @click="updatePassword('resetPwdForm')">更 新</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  mapGetters
} from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import { changePwd } from '@/api/user'

export default {
  components: {
    Breadcrumb,
    Hamburger
  },
  data() {
    return {
      updatePwdModal: false,
      updatePwd: {
        oldPassword: '', // 当前密码
        newPassword: '', // 新密码
        confirmPassword: '' // 确认密码
      },
      pwdRules: {
        oldPassword: [{
          required: true,
          message: '请输入当前密码',
          trigger: 'blur'
        }],
        newPassword: [{
          required: true,
          message: '请输入新密码',
          trigger: 'blur'
        }],
        confirmPassword: [{
          required: true,
          message: '请输入确认密码',
          trigger: 'blur'
        }]
      }
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'name',
      'avatar'
    ])
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    updatePassword(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          changePwd(this.updatePwd).then(res => {
            this.$message({
              type: 'success',
              message: res.message
            })
            this.updatePwdModal = !this.updatePwdModal
            this.$router.push(`/login?redirect=${this.$route.fullPath}`)
          }).catch(err => {
            console.log(err.message)
          })
        } else {
          this.$notify({
            title: '提示',
            message: '表单验证失败！',
            type: 'error'
          })
          return false
        }
      })
    },
    logout() {
      this.$store.dispatch('user/logout').then(res => {
        this.$router.push(`/login?redirect=${this.$route.fullPath}`)
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
    height: 50px;
    overflow: hidden;
    position: relative;
    background: #fff;
    box-shadow: 0 1px 4px rgba(0, 21, 41, .08);

    .hamburger-container {
        line-height: 46px;
        height: 100%;
        float: left;
        cursor: pointer;
        transition: background .3s;
        -webkit-tap-highlight-color: transparent;

        &:hover {
            background: rgba(0, 0, 0, .025)
        }
    }

    .breadcrumb-container {
        float: left;
    }

    .right-menu {
        float: right;
        height: 100%;
        line-height: 50px;

        &:focus {
            outline: none;
        }

        .user-name {
            display: inline-block;
            padding: 0 8px;
            vertical-align: text-bottom;
        }

        .right-menu-item {
            display: inline-block;
            padding: 0 8px;
            height: 100%;
            font-size: 18px;
            color: #5a5e66;
            vertical-align: text-bottom;

            &.hover-effect {
                cursor: pointer;
                transition: background .3s;

                &:hover {
                    background: rgba(0, 0, 0, .025)
                }
            }
        }

        .avatar-container {
            margin-right: 30px;

            .avatar-wrapper {
                margin-top: 5px;
                position: relative;

                .user-avatar {
                    cursor: pointer;
                    width: 40px;
                    height: 40px;
                    border-radius: 10px;
                }

                .el-icon-caret-bottom {
                    cursor: pointer;
                    position: absolute;
                    right: -20px;
                    top: 25px;
                    font-size: 12px;
                }
            }
        }
    }
}
</style>
