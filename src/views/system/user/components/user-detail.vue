<template>
  <div>
    <el-dialog
      title="查看人员"
      :visible="visible"
      top="10vh"
      width="800px"
      append-to-body
      @close="$emit('update:visible', false)"
    >
      <div class="detail">
        <h2>基本信息</h2>
        <section>
          <ul class="base">
            <li class="avatar"><span>头像：</span>
              <el-avatar :size="100" :src="form.headImage || '/img/avatar.png'" />
            </li>
            <li><span>姓名：</span><span>{{ form.realName }}</span></li>
            <li><span>用户名：</span><span>{{ form.loginName }}</span></li>
            <li><span>性别：</span><span>{{ ['保密','男','女'][form.sex] }}</span></li>
            <li><span>手机：</span><span>{{ form.mobile }}</span></li>
            <li><span>角色：</span>
              <span>
                <el-tag v-for="e in form.roleTexts" :key="e">{{ e }}</el-tag>
              </span>
            </li>
            <li><span>职位：</span><span>{{ form.position }}</span></li>
            <li><span>生日：</span><span>{{ form.birthday }}</span></li>
            <li><span>邮箱：</span><span>{{ form.email }}</span></li>
            <li><span>QQ：</span><span>{{ form.qqNumber }}</span></li>
            <li><span>身份证号：</span><span>{{ form.identityCardNumber }}</span></li>
            <li><span>入职时间：</span><span>{{ form.entryDate }}</span></li>
            <li><span>微信：</span><span>{{ form.wechatNumber }}</span></li>
            <li><span>备注：</span><span>{{ form.remark }}</span></li>
            <li><span>就业日期：</span><span>{{ form.jobDate | ymd }}</span></li>
          </ul>
        </section>
        <h2>部门信息</h2>
        <section>
          <vxe-table :data="form.departmentList" size="mini">
            <vxe-table-column title="所属部门" field="departmentName">
              <template v-slot="{row}">
                <span>{{ row.departmentName }}</span>
                <el-tag v-show="row.principalFlag" style="margin-left: 15px;width: 40px;position: absolute">主管</el-tag>
              </template>
            </vxe-table-column>
            <vxe-table-column title="操作">
              <template v-slot="{row}">
                <el-button type="text" @click="removeFromDepartmentByUserId(row)">移出此部门</el-button>
                <el-button v-if="!row.principalFlag" type="text" @click="setPrincipalByUserId(row)">设置主管</el-button>
                <el-button v-else type="text" @click="cancelPrincipalByUserId(row)">取消主管</el-button>
              </template>
            </vxe-table-column>
          </vxe-table>
        </section>
      </div>

    </el-dialog>
  </div>

</template>

<script>

import Api from '@/views/system/api/departmentUser'

export default {
  name: 'FormAddUserDialog',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    id: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      form: {}
    }
  },
  computed: {
    isAdd() {
      return !this.id
    }
  },
  watch: {
    visible(val) {
      if (val && this.id) this.refresh()
    }
  },
  // 生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {
  },
  // 方法集合
  methods: {
    async refresh(id) {
      const res = await Api.getUserInfo(id || this.id)
      this.form = res.data
    },
    removeFromDepartmentByUserId(row) {
      this.axios.system.post('/cim6d/system/deleteUserDepartment/' + row.departmentId, [this.form.id]).then(res => {
        this.refresh()
      })
    },
    setPrincipalByUserId(row) {
      this.axios.system.post('/cim6d/system/department/updateOne', {
        id: row.departmentId,
        principalId: this.form.id,
        principalName: this.form.realName
      }).then(res => {
        this.refresh()
      })
    },
    cancelPrincipalByUserId(row) {
      this.axios.system.post('/cim6d/system/department/updateOne', {
        id: row.departmentId,
        principalId: null,
        principalName: null
      }).then(res => {
        this.refresh()
      })
    }
  }
}
</script>
<style lang="less" scoped>
.detail {
  h2 {
    font-weight: bold;
    font-size: 16px;
    margin-bottom: 15px;
  }

  section {
    margin-left: 50px;
  }

  ul {
    display: flex;
    flex-wrap: wrap;

    li {
      width: 50%;
      margin: 10px 0;
      display: flex;
      align-items: start;

      &.avatar {
        width: 100%;
      }

      > span:first-child {
        width: 70px;
        text-align: right;
      }
    }

  }
}
</style>
