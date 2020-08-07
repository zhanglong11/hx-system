<template>
  <div>
    <!-- /**
    任务名称：2747/ 自定义表单：表单分类、表单功能开发
    开发人员：李建敏
    日期：2020-3月-27日
    任务类型：2.修改代码 (10行)
    **/-->
    <el-form inline>
      <el-form-item label="表单名称" required>
        <el-input v-model="formData.name" placeholder="请输入表单名称" />
      </el-form-item>
      <!-- <el-form-item label="分类">
        <SelectCategory v-model="formData.categoryId" />
      </el-form-item> -->
      <el-form-item>
        <el-button type="primary" :loading="isLoading" @click="save()">保存</el-button>
        <el-button @click="goBack()">返回</el-button>
      </el-form-item>
    </el-form>
    <div class="form-making">
      <fm-making-form
        ref="dragForm"
        :data="jsonData"
        preview
        generate-code
        generate-json
        clearable
      />
    </div>
    <!-- <fm-generate-form ref="generateForm" :data="jsonData" /> -->
  </div>
</template>

<script>
/*
 * @Author: 耿为刚 创建
 * @Date: 2020-03-23 16:36:51
 * @Last Modified by: gengweigang
 * @Last Modified time: 2020-05-29 09:06:22
 */
import { formApi } from '@/views/form/api/form'
import formMakingConfig from './config/form-making-config'
/**
 任务名称：2747/ 自定义表单：表单分类、表单功能开发
 开发人员：李建敏
 日期：2020-3月-27日
 任务类型：2.修改代码（2行）
 **/
import _ from 'lodash'
export default {
// import引入的组件需要注入到对象中才能使用
  name: 'FormListAdd',
  data() {
    // 这里存放数据
    return {
      id: this.$route.query.id || '',
      // 表单提交数据
      formData: {
        name: '',
        categoryId: null,
        template: '',
        templateId: ''
      },
      formDataBack: {},
      isLoading: false, // 防止多次提交
      formMakingConfig,
      jsonData: { 'list': [{ 'type': 'grid', 'icon': 'icon-grid-', 'columns': [{ 'span': 12, 'list': [{ 'type': 'input', 'icon': 'icon-input', 'options': { 'width': '100%', 'defaultValue': '', 'required': true, 'dataType': 'string', 'pattern': '', 'placeholder': '', 'disabled': false, 'remoteFunc': 'func_1584586686000_22583' }, 'name': '姓名', 'key': '1584586686000_22583', 'model': 'input_1584586686000_22583', 'rules': [{ 'type': 'string', 'message': '姓名格式不正确' }, { 'required': true, 'message': '姓名必须填写' }] }] }, { 'span': 12, 'list': [{ 'type': 'input', 'icon': 'icon-input', 'options': { 'width': '100%', 'defaultValue': '', 'required': true, 'dataType': 'number', 'pattern': '', 'placeholder': '', 'disabled': false, 'remoteFunc': 'func_1584586694000_96221' }, 'name': '电话', 'key': '1584586694000_96221', 'model': 'input_1584586694000_96221', 'rules': [{ 'type': 'number', 'message': '电话格式不正确' }, { 'required': true, 'message': '电话必须填写' }] }] }], 'options': { 'gutter': 0, 'justify': 'start', 'align': 'top', 'remoteFunc': 'func_1584586683000_63171' }, 'name': '栅格布局', 'key': '1584586683000_63171', 'model': 'grid_1584586683000_63171', 'rules': [] }, { 'type': 'grid', 'icon': 'icon-grid-', 'columns': [{ 'span': 12, 'list': [{ 'type': 'number', 'icon': 'icon-number', 'options': { 'width': '', 'required': false, 'defaultValue': 0, 'min': 0, 'max': 0, 'step': 1, 'disabled': false, 'controlsPosition': '', 'remoteFunc': 'func_1584586722000_73050' }, 'name': '计数器', 'key': '1584586722000_73050', 'model': 'number_1584586722000_73050', 'rules': [] }] }, { 'span': 12, 'list': [{ 'type': 'rate', 'icon': 'icon-pingfen1', 'options': { 'defaultValue': 0, 'max': 5, 'disabled': false, 'allowHalf': false, 'required': false, 'remoteFunc': 'func_1584586735000_42557' }, 'name': '评分', 'key': '1584586735000_42557', 'model': 'rate_1584586735000_42557', 'rules': [] }] }], 'options': { 'gutter': 0, 'justify': 'start', 'align': 'top', 'remoteFunc': 'func_1584586709000_50706' }, 'name': '栅格布局', 'key': '1584586709000_50706', 'model': 'grid_1584586709000_50706', 'rules': [] }, { 'type': 'radio', 'icon': 'icon-radio-active', 'options': { 'inline': false, 'defaultValue': '', 'showLabel': false, 'options': [{ 'value': 'Option 1', 'label': 'Option 1' }, { 'value': 'Option 2', 'label': 'Option 2' }, { 'value': 'Option 3', 'label': 'Option 3' }], 'required': false, 'width': '', 'remote': false, 'remoteOptions': [], 'props': { 'value': 'value', 'label': 'label' }, 'remoteFunc': 'func_1584586741000_70997', 'disabled': false }, 'name': '单选框组', 'key': '1584586741000_70997', 'model': 'radio_1584586741000_70997', 'rules': [] }, { 'type': 'checkbox', 'icon': 'icon-check-box', 'options': { 'inline': false, 'defaultValue': [], 'showLabel': false, 'options': [{ 'value': 'Option 1' }, { 'value': 'Option 2' }, { 'value': 'Option 3' }], 'required': false, 'width': '', 'remote': false, 'remoteOptions': [], 'props': { 'value': 'value', 'label': 'label' }, 'remoteFunc': 'func_1584586743000_81387', 'disabled': false }, 'name': '多选框组', 'key': '1584586743000_81387', 'model': 'checkbox_1584586743000_81387', 'rules': [] }, { 'type': 'grid', 'icon': 'icon-grid-', 'columns': [{ 'span': 12, 'list': [{ 'type': 'time', 'icon': 'icon-time', 'options': { 'defaultValue': '', 'readonly': false, 'disabled': false, 'editable': true, 'clearable': true, 'placeholder': '', 'startPlaceholder': '', 'endPlaceholder': '', 'isRange': false, 'arrowControl': true, 'format': 'HH:mm:ss', 'required': false, 'width': '', 'remoteFunc': 'func_1584586754000_23602' }, 'name': '时间选择器', 'key': '1584586754000_23602', 'model': 'time_1584586754000_23602', 'rules': [] }] }, { 'span': 12, 'list': [{ 'type': 'date', 'icon': 'icon-date', 'options': { 'defaultValue': '', 'readonly': false, 'disabled': false, 'editable': true, 'clearable': true, 'placeholder': '', 'startPlaceholder': '', 'endPlaceholder': '', 'type': 'date', 'format': 'yyyy-MM-dd', 'timestamp': false, 'required': false, 'width': '', 'remoteFunc': 'func_1584586757000_16981' }, 'name': '日期选择器', 'key': '1584586757000_16981', 'model': 'date_1584586757000_16981', 'rules': [] }] }], 'options': { 'gutter': 0, 'justify': 'start', 'align': 'top', 'remoteFunc': 'func_1584586750000_51356' }, 'name': '栅格布局', 'key': '1584586750000_51356', 'model': 'grid_1584586750000_51356', 'rules': [] }, { 'type': 'grid', 'icon': 'icon-grid-', 'columns': [{ 'span': 12, 'list': [{ 'type': 'color', 'icon': 'icon-color', 'options': { 'defaultValue': '', 'disabled': false, 'showAlpha': false, 'required': false, 'remoteFunc': 'func_1584586763000_97893' }, 'name': '颜色选择器', 'key': '1584586763000_97893', 'model': 'color_1584586763000_97893', 'rules': [] }] }, { 'span': 12, 'list': [{ 'type': 'select', 'icon': 'icon-select', 'options': { 'defaultValue': '', 'multiple': false, 'disabled': false, 'clearable': false, 'placeholder': '', 'required': false, 'showLabel': false, 'width': '', 'options': [{ 'value': 'Option 1' }, { 'value': 'Option 2' }, { 'value': 'Option 3' }], 'remote': false, 'filterable': false, 'remoteOptions': [], 'props': { 'value': 'value', 'label': 'label' }, 'remoteFunc': 'func_1584586765000_49702' }, 'name': '下拉选择框', 'key': '1584586765000_49702', 'model': 'select_1584586765000_49702', 'rules': [] }] }], 'options': { 'gutter': 0, 'justify': 'start', 'align': 'top', 'remoteFunc': 'func_1584586760000_54085' }, 'name': '栅格布局', 'key': '1584586760000_54085', 'model': 'grid_1584586760000_54085', 'rules': [] }, { 'type': 'grid', 'icon': 'icon-grid-', 'columns': [{ 'span': 12, 'list': [{ 'type': 'switch', 'icon': 'icon-switch', 'options': { 'defaultValue': false, 'required': false, 'disabled': false, 'remoteFunc': 'func_1584586774000_25933' }, 'name': '开关', 'key': '1584586774000_25933', 'model': 'switch_1584586774000_25933', 'rules': [] }] }, { 'span': 12, 'list': [{ 'type': 'slider', 'icon': 'icon-slider', 'options': { 'defaultValue': 0, 'disabled': false, 'required': false, 'min': 0, 'max': 100, 'step': 1, 'showInput': false, 'range': false, 'width': '', 'remoteFunc': 'func_1584586777000_25554' }, 'name': '滑块', 'key': '1584586777000_25554', 'model': 'slider_1584586777000_25554', 'rules': [] }] }], 'options': { 'gutter': 0, 'justify': 'start', 'align': 'top', 'remoteFunc': 'func_1584586771000_63788' }, 'name': '栅格布局', 'key': '1584586771000_63788', 'model': 'grid_1584586771000_63788', 'rules': [] }, { 'type': 'text', 'icon': 'icon-wenzishezhi-', 'options': { 'defaultValue': 'This is a text', 'customClass': '', 'remoteFunc': 'func_1584586783000_32041' }, 'name': '文字', 'key': '1584586783000_32041', 'model': 'text_1584586783000_32041', 'rules': [] }], 'config': { 'labelWidth': 100, 'labelPosition': 'right', 'size': 'small' }}
    }
  },
  // 生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {
    this.init()
  },
  /**
   任务名称：2747/ 自定义表单：表单分类、表单功能开发
   开发人员：李建敏
   日期：2020-3月-27日
   任务类型：2. 修改代码 （50行）
   **/
  // 方法集合
  methods: {
    // 初始化
    init() {
      this.getDetails()
      // this.getFormControls()
    },
    // 根据ID获取自定义表单信息
    async getDetails() {
      if (!this.id) {
        return
      }
      const result = await formApi.getDetailsForm(this.id)
      const datas = result.data
      this.formData = datas
      this.$refs['dragForm'].setJSON(JSON.parse(datas.template))
    },
    // 获取表单控件
    async getFormControls() {
      if (!this.id) {
        return
      }
      let controls = await formApi.getFormControls(this.id)
      console.log(controls)

      controls = controls.map(e => {
        e.options = e.staticOptions
        e.removeOption = e.remoteOptions
        e.disabled = !!e.editable
        e.length = e.maxFileSize
        e.placeholder = e.placeHolder
        e.options = _.omit(e, ['name', 'key', 'model'])
        e.rules = []
        if (e.required) {
          e.rules.push({ required: true, message: e.name + '必填' })
        }
        return _.pick(e, ['name', 'key', 'model', 'options'])
      })
    },
    // 保存
    async save() {
      try {
        const template = this.$refs['dragForm'].getJSON()
        let controls = template.list
        controls = _.cloneDeep(controls).map(e => {
          e.staticOptions = e.options.options
          e.remoteOptions = e.options.removeOption
          e.editable = +e.options.disabled
          e.maxFileSize = e.options.length
          e.placeHolder = e.options.placeholder
          if (_.find(e.rules, { required: true })) {
            _.remove(e.rules, e => e.required)
            e.required = true
            if (e.rules[0]) {
              e.dataType = e.rules[0].type
              e.message = e.rules[0].message
            }
          }
          return {
            ..._.omit(e, ['options', 'rules']),
            ..._.omit(e.options, ['options', 'removeOption', 'disabled', 'length', 'placeholder'])
          }
        })
        controls.forEach(e => {
          _.forIn(e, (v, k) => {
            if (v === true) e[k] = 1
            else if (v === false) e[k] = 0
          })
        })
        this.formData.template = JSON.stringify(template)
        if (!this.formData.name) {
          this.$message({
            type: 'error',
            message: '请输入表单名称!'
          })
          return
        }
        this.isLoading = true
        if (this.id) {
          await formApi.updateForm(this.formData)
          // await formApi.saveControls(this.id, controls)
        } else {
          await formApi.addForm(this.formData).then(res => res.data)
          // await formApi.saveControls(formId, controls)
        }
        this.$message({
          type: 'success',
          message: '保存成功!'
        })
        this.goBack()
        this.isLoading = false
      } catch (e) {
        this.isLoading = false
      }
    },
    // 返回
    goBack() {
      setTimeout(() => {
        this.$router.push({
          path: '/form/form-list'
        })
      }, 1500)
    }
  }
}
</script>
<style lang='less' scoped>
//@import url(); 引入公共css类
.form-making{
  height: 800px;
}
.footer-btn{
  padding-top: 20px;
}
</style>
