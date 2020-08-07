import { login } from '@/views/system/api/user'
import { userApi } from '@/views/system/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'

const state = {
  token: getToken(),
  name: '',
  avatar: '',
  companyId: localStorage.getItem('companyId') || '',
  adminFlag: false, // 是否是管理员
  raw: {}
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_COMPANY_ID: (state, companyId) => {
    state.companyId = companyId
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_RAW: (state, user) => {
    state.raw = user
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password }).then(response => {
        const { data } = response
        commit('SET_TOKEN', data.token)
        setToken(data.token)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 获取当前登录用户信息
  getUserInfo({ commit, state }, callBack = () => {}) {
    return new Promise((resolve, reject) => {
      userApi.getCurrentUser(state.token).then(response => {
        const { data } = response
        if (!data) {
          reject('Verification failed, please Login again.')
        }
        const adminFlag = data.companyAdminFlag === 1 || data.superAdminFlag === 1
        localStorage.setItem('adminFlag', adminFlag)
        state.adminFlag = adminFlag
        commit('SET_NAME', data.nickName || data.loginName)
        commit('SET_AVATAR', data.headImage)
        commit('SET_COMPANY_ID', data.companyId)
        commit('SET_RAW', data)

        callBack()
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    commit('SET_TOKEN', '')
    removeToken()
    resetRouter()
    localStorage.clear()
    this.commit('clearPower')
    this.commit('system/clearProjectTemp')
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      removeToken()
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

