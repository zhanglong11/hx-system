<template>
  <div class="navbar">
    <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />

    <breadcrumb class="breadcrumb-container" />

    <div class="right-menu">
      <div class="right-menu-con">
        <!-- <el-button type="primary" size="small" round>基础管理</el-button>
        <el-button type="success" size="small" round>物联网</el-button>
        <el-button type="warning" size="small" round>资源管理</el-button> -->
        <el-badge :value="unreadNum" class="message-count" @click.native="toMessage">
          <i class="el-icon-bell" />
        </el-badge>
        <el-dropdown class="avatar-container" trigger="click">
          <div class="avatar-wrapper">
            <span class="user-name">{{ name }}</span>
            <i class="el-icon-caret-bottom" />
            <img v-if="avatar" :src="avatar" class="user-avatar">
            <img v-else src="@/assets/images/user.png" class="user-avatar">

          </div>
          <el-dropdown-menu slot="dropdown" class="user-dropdown">
            <router-link to="/">
              <el-dropdown-item>
                首页
              </el-dropdown-item>
            </router-link>
            <el-dropdown-item divided>
              <span style="display:block;" @click="logout">安全退出</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import { approvalApi } from '@/views/approval/api/approval'

export default {
  components: {
    Breadcrumb,
    Hamburger
  },
  data() {
    return {
      unreadNum: 0
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar',
      'name'
    ])
  },
  mounted() {
    this.getUnreadMessage()
  },
  methods: {
    // 查询未读消息数量
    async getUnreadMessage() {
      const result = await approvalApi.getUnreadMessage()
      const datas = result.data || 0
      this.unreadNum = datas
    },
    // 前往消息页面
    toMessage() {
      this.$router.push({ name: 'Message' })
    },
    // 收起 / 展开左菜单
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    // 安全退出
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    }
  }
}
</script>

<style lang="scss" scoped>
.message-count{
  margin-right: 30px;
  display: flex;
  font-size: 20px;
  cursor: pointer;
}
.user-name {
  cursor: pointer;
  padding-right: 10px;
  display: inline-block;
  line-height: 40px;
  vertical-align: top;
}
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

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
          border-radius: 50%;
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
