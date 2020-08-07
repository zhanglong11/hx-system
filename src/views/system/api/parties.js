import axios from '@/utils/request'
export default {
  // 获取参与方配置列表
  getPartiesRecordList: data => {
    return axios.system({
      url: `projectParticipant/listAll`,
      method: 'post',
      data
    })
  },
  // 获取参与方配置列表
  getIsUpdateRole: data => {
    return axios.system({
      url: `projectParticipant/isUpdateRole`,
      method: 'POST',
      data
    })
  },
  // 获取参与方配置列表
  getRoleInfo: data => {
    return axios.system({
      url: `projectParticipant/get`,
      method: 'POST',
      data
    })
  },
  // 添加参与方配置
  getPartiesAdd: data => {
    return axios.system({
      url: `projectParticipant/add`,
      method: 'POST',
      data
    })
  },
  // 添加参与方配置
  getPartiesUpdate: data => {
    return axios.system({
      url: `projectParticipant/update`,
      method: 'POST',
      data
    })
  },
  // 修改参与方人员分布姓名
  gePartiesRecordAdd: data => {
    return axios.system({
      url: 'projectParticipantDispatchRecord/add',
      method: 'POST',
      data
    })
  },
  // 获取参与方人员分布列表
  getPartiesPersonRecordList: data => {
    return axios.system({
      url: `projectParticipantDispatchRecord/listAll`,
      method: 'POST',
      data
    })
  }

}
