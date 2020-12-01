import Vue from 'vue'
import Vuex from 'vuex'
import app from '@/storeGlobalModule/app'
import permission from '@/storeGlobalModule/permission'
import tagsView from '@/storeGlobalModule/tagsView'
import user from '@/storeGlobalModule/user'
import globalUpload from '@/storeGlobalModule/globalUpload'
import errorLog from '@/storeGlobalModule/errorLog'
import initapp from './modules/initapp'
import getters from './getters'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    permission,
    tagsView,
    user,
    globalUpload,
    errorLog,
    initapp
  },
  getters
})

export default store
