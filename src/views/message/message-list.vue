<template>
  <div class="container">
    <!-- 工具栏 start -->
    <div class="tooltips">
      <el-form inline>
        <el-form-item>
          <el-select v-model="queryForm.cateogry" clearable placeholder="消息类型" @change="search">
            <el-option v-for="item in typeList" :key="item.value" :label="item.desc" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input v-model="queryForm.keyWords" style="width: 360px;" placeholder="标题" />
        </el-form-item>
        <el-form-item>
          <el-button-group>
            <el-button type="primary" icon="el-icon-search" @click="search()">搜索</el-button>
            <el-button icon="el-icon-refresh-left" @click="reset()">重置</el-button>
          </el-button-group>
        </el-form-item>
      </el-form>
    </div>
    <!-- 工具栏 end -->
    <el-table :data="dataList" border stripe size="small">
      <el-table-column type="index" width="120" align="center" label="序号" />
      <el-table-column prop="title" label="标题" />
      <el-table-column prop="category" label="消息类型">
        <span slot-scope="scope">
          {{ $enum.getDescByValue('MESSAGE_TYPE', scope.row.category) }}
        </span>
      </el-table-column>
      <el-table-column prop="createTime" label="发布时间" />
      <el-table-column prop="name" label="状态">
        <template slot-scope="scope">
          <el-switch :value="scope.row.status === 1" disabled />
          {{ scope.row.status === 1 ? '已读' : '未读' }}
        </template>
      </el-table-column>
      <el-table-column prop="content" label="内容" show-overflow-tooltip />
      <el-table-column label="操作" width="200" fixed="right" align="center">
        <template slot-scope="scope">
          <el-button type="text" size="mini" @click="toDetails(scope.row.id)">查看</el-button>
          <el-button type="text" size="mini" @click="deleteItem(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination">
      <p class="total">
        共 {{ total }} 条记录 第 {{ queryForm.page }} / {{ Math.ceil(total / queryForm.rows) || 1 }} 页
        <el-button type="text primary" class="el-icon-refresh" @click="queryList()" />
      </p>
      <el-pagination
        background
        layout="sizes, prev, pager, next, jumper"
        :total="total"
        :current-page="queryForm.page"
        :page-size="queryForm.rows"
        :page-sizes="$pageConfig.pageSizes"
        @size-change="changePageSize"
        @current-change="changePageNumber"
      />
    </div>
  </div>
</template>

<script>
/**
  任务名称：task#2854 【智慧工地2.0-前端】工作台切图及功能开发
  开发人员：耿为刚
  日期：2020-04-01
**/
import { messageApi } from '@/views/message/api/message'

export default {
  // import引入的组件需要注入到对象中才能使用
  name: 'WorkBenchMessage',
  components: {},
  data() {
    // 这里存放数据
    return {
      // 消息类型下拉框数据
      typeList: this.$enum.getValueDescList('MESSAGE_TYPE'),
      queryForm: {
        // 查询条件
        cateogry: '',
        keyWords: '',
        page: 1,
        rows: this.$pageConfig.pageSize
      },
      queryFormBack: {},
      dataList: [
        {
          id: 1,
          name: '测试',
          status: 1,
          statusName: '监控中'
        },
        {
          id: 2,
          name: '测试',
          status: 2,
          statusName: '停用'
        },
        {
          id: 3,
          name: '测试',
          status: 3,
          statusName: '故障'
        }
      ],
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
    // 查询列表
    async queryList() {
      const result = await messageApi.queryListMessage(this.queryForm)
      const datas = result.data
      console.log(111, datas)
      const list = datas.records || []
      this.total = datas.total
      this.dataList = list
    },
    // 搜索
    search() {
      this.queryForm.page = 1
      this.queryList()
    },
    // 重置
    reset() {
      Object.assign(this.queryForm, this.queryFormBack)
      this.queryList()
    },
    // 当前页码改变
    changePageNumber(page) {
      this.queryForm.page = page
      this.queryList()
    },
    // 每页显示条数改变
    changePageSize(rows) {
      this.queryForm.page = 1
      this.queryForm.rows = rows
      this.queryList()
    },
    // 查看详情
    toDetails(id) {
      this.$router.push({
        name: 'MessageDetails',
        params: {
          id
        }
      })
    },
    // 删除消息
    deleteItem(id) {
      this.$confirm('确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.deleteMessage(id)
        })
        .catch(() => {})
    },
    // 删除消息 - 异步
    async deleteMessage(id) {
      await messageApi.deleteMessage(id)
      this.$message({
        type: 'success',
        message: '删除成功!'
      })
      this.search()
    }
  }
}
</script>
<style lang="less" scoped>
//@import url(); 引入公共css类
.status {
  display: flex;
  align-items: center;
  i {
    margin-right: 6px;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #00cc00;
  }
  &.status-2 i {
    background: #999;
  }
  &.status-3 i {
    background: #ff9900;
  }
}
</style>
