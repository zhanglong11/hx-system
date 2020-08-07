<template>
  <div class="container">
    <div class="tooltips">
      <el-form inline>
        <el-form-item>
          <el-input v-model="queryForm.name" placeholder="表单名称" />
        </el-form-item>
        <el-form-item>
          <el-button-group>
            <el-button type="primary" icon="el-icon-search" @click="search()">查询</el-button>
            <el-button icon="el-icon-refresh-left" @click="reset()">重置</el-button>
          </el-button-group>
        </el-form-item>
        <el-form-item v-if="$hasPower('FormListAdd')">
          <el-button
            type="primary"
            icon="el-icon-plus"
            @click="addForm()"
          >添加</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table
      :data="dataList"
      border
      stripe
      size="small"
    >
      <el-table-column
        prop="name"
        label="表单名称"
        min-width="180"
      />
      <el-table-column
        prop="creatorName"
        label="创建人"
        width="180"
      />
      <el-table-column
        prop="createTime"
        label="创建时间"
      />
      <el-table-column
        label="操作"
        width="200"
        fixed="right"
        align="center"
      >
        <template slot-scope="scope">
          <el-button v-if="$hasPower('FormListEdit')" type="primary" icon="el-icon-edit" size="mini" @click="editForm(scope.row.id)">修改</el-button>
          <el-button v-if="$hasPower('FormListDelete')" type="danger" icon="el-icon-delete" size="mini" @click="deleteForm(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      :current-page="queryForm.page"
      :page-size="queryForm.rows"
      :page-sizes="$pageConfig.pageSizes"
      @size-change="changeSize"
      @current-change="changeCurrent"
    />
  </div>
</template>

<script>
/*
 * @Author: 耿为刚 创建
 * @Date: 2020-03-23 16:36:51
 * @Last Modified by: gengweigang
 * @Last Modified time: 2020-05-19 13:52:09
 */
import { formApi } from '@/views/form/api/form'
export default {
// import引入的组件需要注入到对象中才能使用
  name: 'FormList',
  components: {},
  data() {
    // 这里存放数据
    return {
      queryForm: { // 查询条件
        name: '',
        page: 1,
        rows: 10
      },
      queryFormBack: {},
      dataList: [],
      total: 0
    }
  },
  // 生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {
    Object.assign(this.queryFormBack, this.queryForm)
    this.queryList()
  },
  // 方法集合
  methods: {
    // 自定义表单查询
    async queryList() {
      const result = await formApi.queryFormList(this.queryForm)
      const datas = result.data
      const list = datas.records || []
      this.dataList = list
      this.total = datas.total
    },
    // 搜索
    search() {
      this.queryForm.page = 1
      this.queryList()
    },
    // 页码改变
    changeCurrent(page) {
      this.queryForm.page = page
      this.queryList()
    },
    // 页码改变
    changeSize(rows) {
      this.queryForm.page = 1
      this.queryForm.rows = rows
      this.queryList()
    },
    // 重置
    reset() {
      Object.assign(this.queryForm, this.queryFormBack)
      this.queryList()
    },
    // 新建表单
    addForm() {
      this.$router.push({
        path: '/form/add-form'
      })
    },
    // 修改表单
    editForm(id) {
      this.$router.push({
        path: `/form/edit-form?id=${id}`
      })
    },
    // 根据ID删除表单
    deleteForm(id) {
      this.$confirm('确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteFormSuccess(id)
      }).catch(() => {})
    },
    // 根据ID删除表单 - 异步
    async deleteFormSuccess(id) {
      await formApi.deleteForm(id)
      this.$message({
        type: 'success',
        message: '删除成功!'
      })
      this.search()
    }
  }
}
</script>
<style lang='less' scoped>
//@import url(); 引入公共css类
</style>
