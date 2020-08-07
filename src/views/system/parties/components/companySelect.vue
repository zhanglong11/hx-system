<template>

  <el-select :value="valueSplit" placeholder="请选择" filterable @change="handleChange">
    <el-option v-for="item in list" :key="item.id" :label="item.label" :value="item.value" />
  </el-select>
</template>
<script>
export default {
  name: 'SelectUser',
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      list: []
    }
  },
  computed: {
    valueSplit() {
      // return this.value ? this.value.split(',') : null
      return this.value
    }
  },
  created() {
    const obj = {
      status: 1
    }
    this.axios.system.post('admin/companyBase/list', obj).then(res => {
      const getKey = this.getObjectKeys(res.data)
      const getValue = this.getObjectValues(res.data)
      this.list = getKey.map((item, index) => {
        return {
          ...item, ...getValue[index]
        }
      })
      // console.log(1111, this.list)
    })
  },
  methods: {
    getObjectKeys(object) {
      const keys = []
      for (var property in object) { keys.push(property) }
      const objKey = keys.map(item => {
        return {
          value: item
        }
      })
      return objKey
    },
    getObjectValues(object) {
      const values = []
      for (var property in object) {
        values.push(object[property])
      }
      const objValue = values.map(item => {
        return {
          label: item
        }
      })

      return objValue
    },

    handleChange(val) {
      // this.$emit('input', val.join(','))
      this.$emit('input', val)
      const nameList = [...this.list].filter(item => val.includes(item.value)).map(item => item.label)
      this.$emit('update:principalName', nameList[0])
    }
  }
}
</script>
