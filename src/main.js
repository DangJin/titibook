// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuex from 'vuex'
import App from './App'
import router from './router'
import store from './store/index'
import axios from 'axios'
import VueAxios from 'vue-axios'
import VueAMap from 'vue-amap'
import qs from 'qs'
import ElementUI from 'element-ui'
import VueQuillEditor from 'vue-quill-editor'
import 'element-ui/lib/theme-chalk/index.css'

/**
 * 注册组件
 */

Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.use(Vuex)
Vue.use(VueAxios, axios)
Vue.use(qs)
Vue.use(VueAMap)
Vue.use(VueQuillEditor)

// 初始化vue-amap
VueAMap.initAMapApiLoader({
  // 申请的高德key
  key: '3eb9d200eb4a52109a03510cb07c6cee',
  // 插件集合
  plugin: ['AMap.Scale', 'AMap.OverView', 'AMap.ToolBar', 'AMap.MapType', 'AMap.Geocoder']
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: {App}
})
