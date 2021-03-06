<template>
  <div class="no-padding">
    <el-row :gutter="15">
      <el-col :md="5">
        <el-card class="mb15">
          <div slot="header" class="clearfix">
            <span>角色</span>
          </div>

          <el-input
            v-model="filterText"
            class="mb15"
            placeholder="请搜索"
          >
            <i slot="suffix" class="el-input__icon el-icon-search" />
          </el-input>

          <div class="mb15">
            <el-button type="primary" @click="addCategory()">新增角色组</el-button>
            <el-button type="primary" @click="addRole()">新增角色</el-button>
          </div>

          <el-tree
            ref="tree"
            highlight-current
            :filter-node-method="filterNode"
            :data="treeList"
            default-expand-all
            node-key="id"
            :expand-on-click-node="false"
            :props="defaultProps"
            @node-click="clickTree"
          >
            <span slot-scope="{node, data}" class="left-tree">
              {{ node.label }}
              <el-dropdown v-if="data.roleAttribute === '2'" placement="bottom-start">
                <span style="padding: 2px 5px;" @click.stop>
                  ◢
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item @click.native="addRole(data)">新增角色</el-dropdown-item>
                  <el-dropdown-item @click.native="editCategory(data)">修改角色组</el-dropdown-item>
                  <el-dropdown-item @click.native="deleteCategoryRole(data, '角色组？分组下角色也会被删除，请谨慎操作！')">删除角色组</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
              <el-dropdown v-else placement="bottom-start">
                <span style="padding: 2px 5px;" @click.stop>
                  ◢
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item @click.native="editRole(data)">修改角色</el-dropdown-item>
                  <el-dropdown-item @click.native="deleteCategoryRole(data, '角色？')">删除角色</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </span>
          </el-tree>

        </el-card>
      </el-col>
      <el-col :span="19">
        <el-card class="mb15">
          <div class="mb15">
            <el-button type="primary" size="lg" :loading="savePowerBtnLoading" :disabled="!selectRole.projectRolePowerAddUpdateDTOS" @click="saveUserPower()">保存</el-button>
            <el-checkbox v-if="showCheckAll" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
          </div>
          <TreeCard v-if="sourcePower && sourcePower.length > 0" ref="treeCard" no-parent :data="sourcePower" :all-data="sourcePower" :role-id="roleId" :power-list-role="powerListRole" @on-change="changePower" />
        </el-card>
      </el-col>

    </el-row>

    <div class="footer-btn">
      <el-button size="lg" @click="goback()">返回</el-button>
      <!-- <el-button type="primary">提交</el-button> -->
    </div>

    <!-- 新增角色组 模态框 -->
    <el-dialog :title="isAddGroup ? '新增角色组' : '编辑角色组'" :visible.sync="addRoleGroupVisible" :before-close="closeDialog" width="40%">
      <el-form ref="groupRef" :model="groupForm" label-width="100px">
        <el-form-item label="角色组名称" prop="name" :rules="[{ required: true, message: '请输入角色组名称', trigger: 'blur' }]">
          <el-input v-model="groupForm.name" :maxlength="50" />
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="addRoleGroupVisible = false">取 消</el-button>
        <el-button type="primary" :loading="groupBtnLoading" @click="saveGroup()">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 新增角色 模态框 -->
    <el-dialog :title="isAddRole ? '新增角色' : '编辑角色'" :visible.sync="addRoleVisible" :before-close="closeDialog" width="40%">
      <el-form ref="roleRef" :model="roleForm" label-width="100px">
        <el-form-item label="角色名称" prop="name" :rules="[{ required: true, message: '请输入角色名称', trigger: 'blur' }]">
          <el-input v-model="roleForm.name" :maxlength="50" />
        </el-form-item>
        <el-form-item label="角色分组" prop="pid" :rules="[{ required: true, message: '请选择分组', trigger: 'change' }]">
          <el-select v-model="roleForm.pid" placeholder="请选择" class="w100">
            <template v-for="item in treeList">
              <el-option :key="item.id" :value="item.id" :label="item.name" />
            </template>
          </el-select>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="addRoleVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveRole()">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { projectApi } from '@/views/system/api/project'
import { roleApi } from '@/views/system/api/role'
import TreeCard from '../components/tree-card'
import toTree from '@/utils/toTree'

export default {
  name: 'SystemProjectRoleSet',
  components: {
    TreeCard
  },
  data() {
    return {
      checkAll: false,
      showCheckAll: false,
      projectId: this.$route.query.projectId || '',
      type: this.$route.query.type || '',
      newRole: '',
      newRoleGroup: '',
      roleType: '1',
      filterText: '',
      treeList: [], // 左侧角色列表
      availablePower: [], // 用户权限
      sourcePower: [], // 所有权
      sourcePowerTotal: 0, // 所有权限计数
      powerListRole: [],
      noSubmitPower: [], // 不需要提交的权限
      roleId: '',
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      // 角色组参数
      groupForm: {
        pid: 0,
        name: '',
        projectId: this.$route.query.projectId,
        type: 1,
        roleAttribute: 2,
        isUpdate: false
      },
      groupFormBack: {},
      addRoleGroupVisible: false,
      isAddGroup: true,
      groupBtnLoading: false,
      // 角色参数
      roleForm: {
        pid: '',
        name: '',
        projectId: this.$route.query.projectId,
        type: 1,
        roleAttribute: 1,
        isUpdate: false
      },
      roleFormBack: {},
      addRoleVisible: false,
      isAddRole: true,
      roleBtnLoading: false,
      selectRole: {}, // 选中的角色
      selectRolePower: {
        roleId: '',
        powers: []
      }, // 选择的用户权限
      savePowerBtnLoading: false
    }
  },
  computed: {
    // 公司信息
    companyInfo() {
      return this.$store.state.system.companyInfo
    }
  },
  watch: {
    // 角色搜索
    filterText(val) {
      this.$refs.tree.filter(val)
    }
  },
  mounted() {
    this.init()
    // this.getSourcePower()
    // this.getAvailablePower()
  },
  methods: {
    // 初始化
    init() {
      Object.assign(this.groupFormBack, this.groupForm)
      Object.assign(this.roleFormBack, this.roleForm)
      this.querylistAllProjectRole()
      this.querySourcePower()
    },
    // 查询角色或角色分组
    async querylistAllProjectRole() {
      if (!this.projectId) {
        return
      }
      const params = {
        roleAttribute: 0,
        projectId: this.projectId
      }
      const result = await projectApi.querylistAllProjectRole(params)
      const datas = result.data || []
      this.formatTree(datas)
    },
    // 格式化树结构
    formatTree(datas) {
      const list = []
      datas.map(item => {
        if (item.pid === '0') {
          item.children = []
          item.level = 1
          list.push(item)
        }
      })
      const isChildren = _.map(list, 'id')
      datas.map(item => {
        const index = isChildren.indexOf(item.pid)
        if (index >= 0) {
          item.level = 2
          list[index].children.push(item)
        }
      })
      this.treeList = list
    },
    // 新增角色组
    addCategory() {
      this.isAddGroup = true
      this.addRoleGroupVisible = true
      this.$nextTick(() => {
        this.$refs.groupRef.clearValidate()
      })
    },
    // 修改角色组
    editCategory(item) {
      this.groupForm = Object.assign({}, item, {
        isUpdate: false
      })
      this.isAddGroup = false
      this.addRoleGroupVisible = true
    },
    // 删除角色组或角色
    deleteCategoryRole(item, type) {
      this.$confirm(`确认删除 ${item.name} ${type}`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(async() => {
        await projectApi.deleteProjectRole(item.id)
        this.querylistAllProjectRole()
        this.$message.success('操作成功')
      }).catch(() => {}) // 不写catch,取消时会报错
    },
    // 关闭模态框
    closeDialog() {
      this.groupForm = Object.assign({}, this.groupFormBack)
      this.roleForm = Object.assign({}, this.roleFormBack)
      this.addRoleGroupVisible = false
      this.addRoleVisible = false
    },
    // 新增角色
    addRole(item) {
      if (item) {
        this.roleForm.pid = item.id
      }
      this.isAddRole = true
      this.addRoleVisible = true
      this.$nextTick(() => {
        this.$refs.roleRef.clearValidate()
      })
    },
    // 修改角色
    editRole(item) {
      this.roleForm = Object.assign({}, item, {
        isUpdate: false
      })
      this.isAddRole = false
      this.addRoleVisible = true
    },
    // 保存角色组
    saveGroup() {
      this.$refs.groupRef.validate(async(valid) => {
        if (valid) {
          try {
            this.groupBtnLoading = true
            if (this.isAddGroup) {
              await projectApi.addProjectRole(this.groupForm)
            } else {
              await projectApi.updateProjectRole(this.groupForm)
            }
            this.$message.success('操作成功！')
            this.querylistAllProjectRole()
            this.groupBtnLoading = false
            this.closeDialog()
          } catch (e) {
            this.groupBtnLoading = false
            this.closeDialog()
          }
        }
      })
    },
    // 保存角色
    saveRole() {
      this.$refs.roleRef.validate(async(valid) => {
        if (valid) {
          try {
            this.roleBtnLoading = true
            if (this.isAddRole) {
              await projectApi.addProjectRole(this.roleForm)
            } else {
              await projectApi.updateProjectRole(this.roleForm)
            }
            this.$message.success('操作成功！')
            this.querylistAllProjectRole()
            this.roleBtnLoading = false
            this.closeDialog()
          } catch (e) {
            this.roleBtnLoading = false
            this.closeDialog()
          }
        }
      })
    },
    // 搜索树
    filterNode(value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    // 选中的权限
    changePower(array) {
      const newList = []
      array.map(item => {
        newList.push({
          powerId: item.powerId,
          powerKey: item.powerKey,
          projectId: this.projectId,
          serviceId: item.serviceId
        })
      })
      this.selectRolePower.roleId = this.roleId
      this.selectRolePower.powers = newList
    },
    // 保存用户权限
    async saveUserPower() {
      try {
        this.savePowerBtnLoading = true
        this.selectRole.isUpdate = true
        await projectApi.updateProjectRolePower(this.selectRolePower)
        this.$message.success('操作成功！')
        this.savePowerBtnLoading = false
      } catch (e) {
        this.savePowerBtnLoading = false
      }
    },
    // 查询所有权限
    async querySourcePower() {
      const params = {
        'companyId': this.companyInfo.id,
        'serviceCode': this.type
      }
      const result = await roleApi.getSourcePower(params)
      const datas = result.data || []
      this.sourcePowerTotal = datas.length
      const sourcePower = toTree(datas, 'parentId', '', 'powerId')
      this.sourcePower = sourcePower
    },
    // 角色点击事件
    clickTree(e) {
      if (e.level === 1) {
        this.roleId = ''
        this.selectRole = {}
        return
      }
      this.selectRolePower.powers = []
      this.selectRole = Object.assign({}, e)
      this.selectRole.projectRolePowerAddUpdateDTOS = []
      this.roleId = e.id
      this.getPowerByRoleProjectRole(e.id)
    },
    // 处理不需要提交的权限
    formatPower(sourcePower) {
      const noSubmitPower = []
      const formatArray = array => {
        array.map(item => {
          if (item.children) {
            noSubmitPower.push(item.id)
            formatArray(item.children)
          }
        })
      }
      formatArray(sourcePower)
      this.noSubmitPower = noSubmitPower
    },
    // 获取角色已分配权限
    async getPowerByRoleProjectRole(roleId) {
      const result = await projectApi.getPowerByRoleProjectRole(roleId)
      const datas = result.data
      this.powerListRole = _.map(datas, 'powerId')
      this.checkAll = this.powerListRole.length === this.sourcePowerTotal
      this.showCheckAll = true
    },
    // 返回
    goback() {
      this.$router.push({
        path: '/system/project/project-list'
      })
    },
    // 当全选点击时的事件
    handleCheckAllChange(checked) {
      this.$refs.treeCard.handleCheckAllToggle(checked)
    }
  }
}
</script>
<style lang='less' scoped>
// .right-tree {
//   /deep/.el-tree-node__children {
//     display: flex;
//     flex-wrap: wrap;
//   }
// }
.left-tree {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
.maxw300 {
  max-width: 300px;
}
.w100 {
  width: 100%;
}
.mb15 {
  margin-bottom: 15px;
}
.footer-btn {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: white;
  box-shadow: 5px 0 7px 0 #bbb;
  z-index: 3;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  button {
    margin: 6px;
  }
}
</style>
