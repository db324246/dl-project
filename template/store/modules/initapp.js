// 这个文件作为应用如果 一开始需要自己的初始化信息，
// 如无特殊需求，只有initialAppCode应用初始化code不同
const appCode = process.env.VUE_APP_ENV_CONFIG === 'dev' ? '22' : process.env.VUE_APP_ENV_CONFIG === 'prod' ? 'AmY9tz8VsJk78McE' : 'AmY9tz8VsJk78McE'

const appMoudle = {
  // namespaced: true,
  state: {
    ready: false, // 就绪状态
    initialAppCode: appCode
  },
  mutations: {
    SET_READY: (state, status) => {
      state.ready = status
    }
  },
  actions: {
    APPINIT({ dispatch, state, commit, getters, rootGetters }) {
      return new Promise((resolve, reject) => {
        document.title = '模板库'
        commit('SET_READY', true)
        resolve()
      })
    }
  }
}

export default appMoudle
