import 'babel-polyfill'
import Vue from 'vue'
import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import Element from 'element-ui'
import '@/theme-var/blue-light-theme/element-variables.scss' // 引入blue-light-theme主题

// import '@/theme-var/blue-light-theme/eleUI/index.css' // 引入blue-light-theme主题

import '@/styles/BAM-Layout-1/index.scss' // global css
import '@/styles/edu-expand-style/index.scss' // global css

import App from './App'
import router from './router'
import store from './store'

import axios from 'axios'
Vue.prototype.$axios = axios

import './icons' // icon
import '@/errorLog' // error log
import './permission' // permission control
// import './mock' // simulation data

import * as filters from '@/filters' // global filters

// 图片预览
import preview from 'vue-photo-preview'
import 'vue-photo-preview/dist/skin.css'
Vue.use(preview)

import $Moment from 'moment'
Vue.prototype.$Moment = $Moment

// 标题
import EduTitle from '@/components/EduTitle/index'
Vue.use(EduTitle)

Vue.use(Element, {
  size: 'medium' // set element-ui default size
})

// 图片裁剪组件
import VueCropper from 'vue-cropper'
Vue.use(VueCropper)

// register global utility filters.
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false

// 全局混入
import globalMixin from '@/mixins/globalMixin'
Vue.mixin(globalMixin)

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
