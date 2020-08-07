import { roleApi } from '@/views/system/api/role'
import { projectApi } from '@/views/system/api/project'
// 用户权限
const state = {
  power: localStorage.getItem('power') ? localStorage.getItem('power').split(',') : [],
  adminPower: localStorage.getItem('adminPower') ? localStorage.getItem('adminPower').split(',') : [],
  config: JSON.parse(localStorage.getItem('systemConfig') || '{}'), // 全局参数缓存
  projectTypePower: localStorage.getItem('projectTypePower') ? localStorage.getItem('projectTypePower').split(',') : [], // 可用项目类型
  projectTypeList: localStorage.getItem('projectTypeList') ? localStorage.getItem('projectTypeList').split(',') : [] // 可用项目类型列表
}

const mutations = {
  // 获取用户授权
  getPower(state, callBack = () => {}) {
    this.dispatch('user/getUserInfo', () => {
      const power = []
      roleApi.getAvailablePower().then(response => {
        const datas = response.data || []
        const findArray = array => {
          if (!array) {
            return
          }
          array.map(e => {
            power.push(e.powerKey)
            if (e.children) {
              findArray(e.children)
            }
          })
        }
        const projectTypeList = []
        datas.map(item => {
          if (item.serviceCode === 'base') {
            findArray(item.children)
          }
          projectTypeList.push({
            id: item.serviceCode,
            name: item.serviceName
          })
        })
        const projectTypePower = _.map(datas, 'serviceCode')
        localStorage.setItem('power', power.join(','))
        localStorage.setItem('projectTypePower', projectTypePower.join(','))
        localStorage.setItem('projectTypeList', projectTypeList.join(','))
        state.power = power
        state.projectTypePower = projectTypePower
        state.projectTypeList = projectTypeList
        this.commit('setSystemConfigStorage')
        callBack(power)
      }).catch(error => {
        reject(error)
      })
    })
  },
  setPower(state, obj) {
  },
  // 清除缓存
  clearPower(state) {
    state.power = []
    state.adminPower = []
    state.config = {}
    state.projectTypePower = []
    state.projectTypeList = []
  },
  // 设置全局参数缓存
  /*
  通过value 获取系统参数label
  group 分组参数
  value 参数编码
  this.$getLabelFromArg(group, value)
  */
  setSystemConfigStorage(state) {
    return new Promise((resolve, reject) => {
      const params = {
        module: 'construction-2.0'
      }
      roleApi.queryTreeArg(params).then(result => {
        const datas = result.data || []
        const list = {}
        datas.map(items => {
          const listItems = {
            id: items.id,
            label: items.argText,
            value: items.argCode,
            argGroup: items.argGroup,
            children: []
          }
          if (items.children) {
            items.children.map(item => {
              const newItem = {
                label: item.argText,
                value: item.argCode,
                argGroup: item.argGroup,
                deleteFlag: item.deleteFlag
              }
              if (item.argGroup === 'projectType') {
                if (state.projectTypePower.includes(item.argCode)) {
                  listItems.children.push(newItem)
                }
              } else {
                listItems.children.push(newItem)
              }
            })
          }
          list[items.argCode] = listItems
        })
        localStorage.setItem('systemConfig', JSON.stringify(list))
        state.config = list
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 跳转工地2.0后台
  toProject(state, { projectItem, taskItem }) {
    const processDefinitionCategory = taskItem && taskItem.processDefinitionCategory ? taskItem.processDefinitionCategory : ''
    const index = taskItem ? taskItem.index : 1
    const targetId = taskItem ? taskItem.targetId : ''
    const token = this.state.user.token
    const projectTypePower = this.state.userPower.projectTypeList
    const origin = location.origin
    const lastOrigin = parseInt(origin[origin.length - 1]) + 1
    const newOrigin = origin.substring(0, origin.length - 1) + lastOrigin
    const title = _.find(projectTypePower, { id: projectItem.type }).name
    const url = `${newOrigin}/#`
    location.href = `${url}/to-admin?token=${token}&id=${projectItem.id}&type=${projectItem.type}&processDefinitionCategory=${processDefinitionCategory}&targetId=${targetId}&index=${index}&title=${title}`
  },
  // 任务详情中转逻辑
  toTaskDetails(state, obj) {
    const { processDefinitionCategory, projectId, targetId, index } = obj
    return new Promise((resolve, reject) => {
      projectApi.getProject(projectId).then(result => {
        const datas = result.data || []
        console.log(2222, datas)
        this.commit('toProject', {
          projectItem: datas,
          taskItem: {
            processDefinitionCategory,
            targetId,
            index
          }
        })
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  }
}
const actions = {

}

export default {
  state,
  mutations,
  actions
}

