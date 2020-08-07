<template>
  <el-dialog top="30px" width="600px" :visible="visible" title="角色配置" @close="close">
    <div style="margin-bottom:10px;">请选择：</div>
    <el-select v-model="value" multiple filterable placeholder="请选择" style="width: 100%" @change="changeVal">
      <el-option-group
        v-for="group in options"
        :label="group.label"
      >
        <el-option
          v-for="item in group.children"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-option-group>
    </el-select>

  </el-dialog>
</template>
<script>
export default {
  name: 'SelectUser',
  props: {
    selctedRoles: {
      type: Array,
      default() { return [] }

    },
    valueGroup: {
      type: Array

    },
    visible: {}
  },
  data() {
    return {
      projectId: this.$route.query.projectId,
      list: [],
      checkedVal: [],
      options: [

      ],
      value: this.selctedRoles
      // valueGroup: []

    }
  },
  watch: {
    selctedRoles: {

      handler(val) {
        // console.log(1111, val)
        // this.checkedVal = val
        this.value = val
      },
      deep: true,
      immediate: true
    }
  },
  // computed: {
  //   // valueSplit() {
  //   //   return this.value ? this.value.split(',') : null
  //   // }
  //   valueGroup(e) {
  //     console.log(e)
  //   }
  // },

  created() {
    // this.value = this.valueGroup.map(item => item.value) || []
    this.getProjectRoleData()
  },
  methods: {
    // 关闭弹窗
    close() {
      this.$emit('update:visible', false)
      this.$emit('update', {
        checkedVal: this.checkedVal

      })
    },
    getProjectRoleData() {
      // const params = {
      //   roleAttribute: '0',
      //   projectId: this.projectId
      // }
      const projectId = this.projectId
      this.axios.system.get(`projectParticipantDispatchRecord/getRoles/${projectId}`).then(res => {
        res.data.forEach(e => {
          e.label = e.name
          e.value = e.id
        })
        // this.list = res.data
        // const result = await projectApi.querylistAllProjectRole(params)
        const datas = res.data || []
        // console.log(23, datas)
        this.formatTree(datas)
      })
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
      this.options = list

      // console.log(1111, this.options)
    },
    handleChange(val) {
      this.$emit('input', val.join(','))
      const nameList = [...this.list].filter(item => val.includes(item.value)).map(item => item.label)
      this.$emit('update:principalName', nameList.join(','))
    },
    changeVal(e) {
      this.$emit('input', e.join(','))
      _.find(this.options, _.flow(
        _.property('options')
      ))
      const arrName = [];
      [...this.options].filter(item => {
        return item.children.filter(item => e.includes(item.value)).map(item => {
          arrName.push(item)
        })
      })
      // console.log('1111', arrName)
      // this.$emit('getTarget', { checkedVal: arrName })
      this.checkedVal = arrName
    }

  }
}
</script>
