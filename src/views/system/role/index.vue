<template>
  <div>
    <el-tabs v-model="tabIndex" @tab-click="clickTab">
      <!--      <el-tab-pane v-for="(item, i) in availablePower"  :key="i" :label="item.serviceName" :name="i + ''" />-->
      <el-tab-pane>  <span slot="label"><i class="el-icon-setting" /> 角色权限配置</span></el-tab-pane>
    </el-tabs>
    <el-row :gutter="20">
      <el-col :md="4">
        <!-- 角色树 start -->
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>角色管理</span>
            <el-button style="float: right; padding: 3px 0" type="text" @click="addCategory()">新增角色组</el-button>
          </div>
          <el-input
            v-model="filterText"
            placeholder="请搜索"
            style="margin-bottom: 10px"
          ><i slot="suffix" class="el-icon-search" style="cursor:pointer;top: 7px;position: relative;" @click="$refs.tree.filter(filterText)" /></el-input>

          <el-tree
            ref="tree"
            :filter-node-method="filterNode"
            :data="tree"
            default-expand-all
            node-key="id"
            :expand-on-click-node="false"
            :props="defaultProps"
            @node-click="clickTree"
          >
            <span slot-scope="{node, data}" class="custom-tree-node">
              {{ node.label }}
              <el-dropdown v-if="!data.categoryId" placement="bottom-start">
                <span style="padding: 2px 5px;" @click.stop>
                  ◢
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item @click.native="addRole(data)">新增角色</el-dropdown-item>
                  <el-dropdown-item @click.native="editCategory(data)">修改角色组</el-dropdown-item>
                  <el-dropdown-item @click.native="deleteCategoryRole(data.id)">删除角色组</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
              <el-dropdown v-else placement="bottom-start">
                <span style="padding: 2px 5px;" @click.stop>
                  ◢
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item @click.native="addRole(data, true)">修改角色</el-dropdown-item>
                  <el-dropdown-item @click.native="deleteRole(data.id)">删除角色</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>

            </span>
          </el-tree>
        </el-card>
        <!-- 角色树 end -->
      </el-col>
      <el-col :md="20">
        <div class="mb15">
          <!--          <el-button v-if="roleId" type="primary" size="lg" :loading="isLoading" :disabled="selectPower.length == 0" @click="save()">保存</el-button>-->
          <el-button v-if="roleId" type="primary" size="lg" :loading="isLoading" @click="save()">保存</el-button>
          <el-checkbox v-if="roleId && showCheckAll" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
        </div>
        <!-- 角色配置 start -->
        <el-card v-if="sourcePower.length > 0" class="parend-card">
          <div slot="header" class="clearfix">
            <span>角色权限</span>
          </div>
          <TreeCard v-if="sourcePower && sourcePower.length > 0" ref="treeCard" :data="sourcePower" :all-data="sourcePower" :role-id="roleId" :power-list-role="powerListRole" @on-change="changePower" />
        </el-card>
        <!-- 角色配置 end -->
        <!-- <div v-if="roleId" class="footer-btn">
          <el-button type="primary" :loading="isLoading" size="medium" :disabled="selectPower.length == 0" @click="save()">保存</el-button>
        </div> -->
      </el-col>
    </el-row>

    <!-- 角色分类模态框 start -->
    <el-dialog :title="categoryTitle" :visible.sync="categoryModal" width="640px">
      <el-form ref="categoryForm" :rules="categoryFormRule" :model="categoryForm" :label-width="formLabelWidth">
        <el-form-item label="角色分类名称" prop="name">
          <el-input v-model="categoryForm.name" :maxlength="50" placeholder="请输入角色分类名称" autocomplete="off" class="form-input" />
        </el-form-item>
        <el-form-item label="显示排序" prop="sort">
          <el-input-number v-model="categoryForm.sort" :maxlength="50" placeholder="请输入显示排序" autocomplete="off" />
        </el-form-item>
        <template v-if="categoryForm.id">
          <el-form-item label="创建人">
            {{ categoryForm.creatorName }}
          </el-form-item>
          <el-form-item label="创建日期">
            {{ categoryForm.createTime }}
          </el-form-item>
        </template>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="categoryModal = false">取 消</el-button>
        <el-button type="primary" @click="addCategoryRole()">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 角色分类模态框 end -->

    <!-- 角色模态框 start -->
    <el-dialog :title="roleTitle" :visible.sync="roleModal" width="640px">
      <el-form ref="roleForm" :rules="roleFormRule" :model="roleForm" :label-width="formLabelWidth">
        <el-form-item label="角色分类">
          <el-input v-model="roleForm.categoryText" disabled autocomplete="off" class="form-input" />
        </el-form-item>
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="roleForm.name" :maxlength="50" placeholder="请输入角色名称" autocomplete="off" class="form-input" />
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input
            v-model="roleForm.description"
            type="textarea"
            :maxlength="50"
            :autosize="{ minRows: 2, maxRows: 4}"
            placeholder="请输入角色描述"
            autocomplete="off"
            class="form-input"
          />
        </el-form-item>
        <template v-if="roleIsEdit">
          <el-form-item label="创建人">
            {{ roleForm.creatorName }}
          </el-form-item>
          <el-form-item label="创建日期">
            {{ roleForm.createTime }}
          </el-form-item>
        </template>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="roleModal = false">取 消</el-button>
        <el-button type="primary" @click="addRoleSuccess()">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 角色模态框 end -->
  </div>
</template>

<script>
/*
 * @Author: 耿为刚 创建
 * @Date: 2020-03-24 16:41:30
 * @Last Modified by: gengweigang
 * @Last Modified time: 2020-06-28 09:36:53
 */
import { roleApi } from '@/views/system/api/role'
import TreeCard from '../components/tree-card'
import toTree from '@/utils/toTree'
import toFlat from '@/utils/toFlat'
export default {
// import引入的组件需要注入到对象中才能使用
  name: 'SystemRole',
  components: {
    TreeCard
  },
  data() {
    // 这里存放数据
    return {
      checkAll: false,
      showCheckAll: false,
      filterText: '',
      tabIndex: '0',
      tree: [], // 角色树
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      availablePower: [], // 用户权限
      sourcePower: [], // 所有权
      roleId: '',
      powerListRole: [], // 已分配的权限
      selectPower: [], // 选择的权限
      isLoading: false, // 保存按钮loading
      formLabelWidth: '140px',
      // 新建/编辑分类相关
      categoryModal: false,
      categoryTitle: '新建分类',

      categoryForm: {
        name: '',
        sort: '',
        serviceId: '',
        serviceCode: ''
      },
      categoryFormRule: {
        name: [
          { required: true, message: '请输入角色分类名称', trigger: 'blur' },
          { validator: (rule, value, callback) => {
            if (_.find(this.tree, { name: value })) {
              callback(new Error('分组名不能重复'))
            }
            callback()
          } }
        ],
        sort: [
          { required: true, message: '请输入显示排序', trigger: 'change' }
        ]
      },
      // 新建/编辑角色相关
      roleModal: false,
      roleTitle: '新建角色',
      roleIsEdit: false,
      roleForm: {
        name: '',
        description: '',
        categoryId: '',
        serviceId: '',
        serviceCode: ''
      },
      roleFormRule: {
        name: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          { validator: (rule, value, callback) => {
            const flatList = toFlat(this.tree)
            if (_.find(flatList, { categoryId: this.roleForm.categoryId, name: value })) {
              callback(new Error('同分组下角色名不能一样'))
            }
            callback()
          } }
        ]
      }
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
  // 生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {
    this.init()
  },
  // 方法集合
  methods: {
    // 初始化
    init() {
      this.getSourcePower()
      this.getTreePermissionPower()
    },
    // 角色搜索
    filterNode(value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    // 选项卡切换
    clickTab(e) {
      this.tabIndex = e.name
      this.roleId = ''
      this.powerListRole = []
      this.getTreePermissionPower()
    },
    // 获取用户所有权限
    async getSourcePower() {
      const params = {
        'companyId': this.companyInfo.id,
        'serviceCode': 'base'
      }
      const result = await roleApi.getSourcePower(params)
      const datas = result.data
      const sourcePower = toTree(datas, 'parentId', '', 'powerId')
      this.sourcePower = sourcePower
    },
    // 角色分类&角色树
    async getTreePermissionPower() {
      if (!this.companyInfo.id) {
        return
      }
      const result = await roleApi.getTreePermissionPower({ companyId: this.companyInfo.id })
      const datas = result.data
      this.tree = datas
    },
    // 角色树点击
    clickTree(e) {
      if (!e.categoryId) {
        this.roleId = null
        return
      }
      this.roleId = e.id
      this.getPowerListRole(e.id)
      this.showCheckAll = true
    },
    // 获取角色已分配权限
    async getPowerListRole(roleId) {
      const result = await roleApi.getPowerListRole(roleId)
      const datas = result.data
      this.powerListRole = datas
    },
    // 新增角色分类 - 模态框
    addCategory() {
      this.categoryForm.id = ''
      this.categoryModal = true
      this.categoryTitle = '新建分类'
      this.$nextTick(() => {
        this.$refs['categoryForm'].resetFields()
      })
    },
    // 编辑角色分类 - 模态框
    editCategory(e) {
      this.categoryForm = Object.assign({}, e)
      this.categoryTitle = '编辑分类'
      this.categoryModal = true
    },
    // 新建/编辑 角色分类
    addCategoryRole() {
      this.$refs['categoryForm'].validate((valid) => {
        if (valid) {
          this.addCategoryRoleSuccess()
        }
      })
    },
    // 新建/编辑 角色分类 - 异步
    async addCategoryRoleSuccess() {
      if (this.categoryForm.id) {
        await roleApi.updateCategoryRole(this.categoryForm)
      } else {
        await roleApi.addCategoryRole(this.categoryForm)
      }
      this.$message({
        type: 'success',
        message: '操作成功!'
      })
      this.categoryModal = false
      this.getTreePermissionPower()
    },
    // 删除角色分类
    deleteCategoryRole(id) {
      this.$confirm('确认删除分类?', '删除分类', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteCategoryRoleSuccess(id)
      }).catch(() => {})
    },
    // 删除角色分类 - 异步
    async deleteCategoryRoleSuccess(id) {
      await roleApi.deleteCategoryRole(id)
      this.$message({
        type: 'success',
        message: '操作成功!'
      })
      this.getTreePermissionPower()
    },
    // 新建/编辑 角色
    addRole(e, isEdit = false) {
      this.roleIsEdit = isEdit
      this.roleTitle = isEdit ? '编辑角色' : '新建角色'
      if (isEdit) {
        this.roleForm = Object.assign({}, e)
      } else {
        this.roleForm = Object.assign({}, {
          name: '',
          description: '',
          categoryId: e.id,
          categoryText: e.name,
          serviceId: e.serviceId,
          serviceCode: e.serviceCode
        })
      }
      this.roleModal = true
    },
    // 新建/编辑 角色 -异步
    async addRoleSuccess() {
      await this.$refs.roleForm.validate()
      if (this.roleIsEdit) {
        await roleApi.updateRole(this.roleForm)
      } else {
        await roleApi.addRole(this.roleForm)
      }
      this.$message({
        type: 'success',
        message: '操作成功!'
      })
      this.roleModal = false
      this.getTreePermissionPower()
    },
    // 删除角色
    deleteRole(id) {
      this.$confirm('确认删除角色?', '删除角色', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteRoleSuccess(id)
      }).catch(() => {})
    },
    // 删除角色 - 异步
    async deleteRoleSuccess(id) {
      await roleApi.deleteRole(id)
      this.$message({
        type: 'success',
        message: '操作成功!'
      })
      this.getTreePermissionPower()
    },
    // 权限改变
    changePower(array) {
      this.selectPower = array
      // console.log('权限改变---index', array)
    },
    // 保存
    async save() {
      const arr = this.selectPower.map(item => {
        return {
          ...item,
          roleId: this.roleId
        }
      })
      if (arr.length === 0) {
        await roleApi.resetRoleBind(this.roleId, this.serviceId)
      } else {
        await roleApi.bindPowerRoleUser(arr)
      }
      this.$message({
        type: 'success',
        message: '操作成功!'
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
@line: #e5e5e5;
//@import url(); 引入公共css类
/deep/.checkbox-tree{
  .no-icon{
    display: none;
  }
}
.custom-tree-node{
  font-size: 14px;
}
.parend-card{
  /deep/.el-card__body{
    padding-top: 0;
  }
}
.form-input{
  width: 90%;
}
.footer-btn{
  margin-top: 20px;
  text-align: right;
}
.mb15{
  margin-bottom: 15px;
}
</style>
