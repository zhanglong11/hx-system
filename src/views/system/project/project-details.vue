<template>
  <div>

    <el-card class="card">
      <div slot="header" class="clearfix">
        <span>基础信息</span>
      </div>

      <div class="content">
        <el-row class="row" :gutter="20">
          <el-col :md="6">项目名称: <span>{{ details.name }}</span></el-col>
          <el-col :md="6">项目类型: <span>{{ $getLabelFromArg('projectType', details.type) }}</span></el-col>
          <el-col :md="6">项目负责人: <span>{{ details.principalName }}</span></el-col>
          <el-col :md="6">联系电话: <span>{{ details.telephone }}</span></el-col>
        </el-row>

        <el-row class="row" :gutter="20">
          <el-col :md="6">项目地址: <span>{{ details.province }}{{ details.city }}{{ details.county }}</span></el-col>
          <el-col :md="6">详细地址: <span>{{ details.detailAddress }}</span></el-col>
          <el-col :md="6">项目日期: <span>{{ details.projectDate }}</span></el-col>
          <el-col :md="6">项目规模: <span>{{ $getLabelFromArg('projectScale', details.scale) }}</span></el-col>
        </el-row>

        <el-row class="row" :gutter="20">
          <el-col :md="24">建筑总规模: <span>{{ details.totalBuildingScale }}</span></el-col>
        </el-row>

        <el-row class="row" :gutter="20">
          <el-col :md="6">建筑高度: <span>{{ details.buildingHeight }} 米</span></el-col>
          <el-col :md="6">建筑面积: <span>{{ details.buildingArea }} ㎡</span></el-col>
          <el-col :md="6">结构形式: <span>{{ details.structuralStyle }}</span></el-col>
        </el-row>

        <el-row class="row" :gutter="20">
          <el-col :md="6">工程造价: <span>{{ details.constructionCosts }} 万元</span></el-col>
          <el-col :md="6">抗震等级: <span>{{ $getLabelFromArg('seismicLevel', details.seismicLevel) }}</span></el-col>
          <el-col :md="6">合同开工时间: <span>{{ details.startTime }}</span></el-col>
          <el-col :md="6">合同竣工时间: <span>{{ details.endTime }}</span></el-col>
        </el-row>

        <el-row class="row" :gutter="20">
          <el-col :md="6">项目状态: <span>{{ $getLabelFromArg('projectStatus', details.projectStatus) }}</span></el-col>
          <el-col :md="6">备注: <span>{{ details.remark }}</span></el-col>
        </el-row>
      </div>

    </el-card>

    <el-card class="card">
      <div slot="header" class="clearfix">
        <span>项目图片</span>
      </div>

      <el-tabs v-model="activeName" type="card">
        <el-tab-pane label="宣传图" name="1" />
        <el-tab-pane label="全景图" name="2" />
        <el-tab-pane label="形象进度图" name="3" />
        <el-tab-pane label="平面图" name="4" />
      </el-tabs>

      <el-table
        v-loading="tableLoading"
        :data="imageListTemp[activeName]"
        style="width: 100%"
        element-loading-background="rgba(0, 0, 0, 0.5)"
        element-loading-text="数据加载中..."
        element-loading-spinner="el-icon-loading"
      >
        <el-table-column prop="fileName" label="图片名称" />
        <el-table-column prop="remark" label="备注" />
        <el-table-column prop="uploadTime" label="上传时间" />
        <el-table-column prop="status" label="状态">
          <template slot-scope="scope">
            {{ !scope.row.status ? '启用': '禁用' }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template slot-scope="scope">
            <el-button type="text" class="imgView">预览
              <el-image
                style="width"
                :src="scope.row.fileUrl"
                :preview-src-list="[scope.row.fileUrl]"
              />
            </el-button>
          </template>
        </el-table-column>
      </el-table>

    </el-card>

    <div class="footer-btn">
      <el-button @click="goBack">返回</el-button>
    </div>

  </div>
</template>

<script>
import { projectApi } from '@/views/system/api/project'

export default {
  name: 'SystemProjectDetails',
  data() {
    return {
      activeName: '1',
      tableLoading: false,
      imgList: [{ id: 1, name: 'fdsfe' }, { id: 2, name: 'ffefsfe' }],
      projectId: this.$route.query.projectId || '', // 项目id
      details: {},
      imageListTemp: {
        1: [], // 宣传图
        2: [], // 全景图
        3: [], // 形象进度图
        4: [] // 平面图
      } // 未确认的图片列表
    }
  },
  mounted() {
    this.getProject()
  },
  methods: {
    // 查询项目详情
    async getProject() {
      if (!this.projectId) {
        return
      }
      const result = await projectApi.getProject(this.projectId)
      const datas = result.data
      const imageList = datas.imageList || []
      datas.imageList = imageList
      imageList.map(item => {
        this.imageListTemp[item.imageType].push(item)
      })
      const addressList = datas.address ? datas.address.split('_') : []
      datas.address = addressList
      this.details = Object.assign({}, datas)
    },
    // 返回
    goBack() {
      this.$router.go(-1)
    }
  }
}
</script>
<style lang='less' scoped>
.content {
  font-size: 14px;
  .row {
    margin: 20px 0;
  }
}
.card {
  margin-bottom: 15px;
}
.imgView{
  position: relative;
  /deep/.el-image{
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
  }
  /deep/.el-image__preview{
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    opacity: 0;
  }
}
</style>
