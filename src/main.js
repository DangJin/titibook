// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuex from 'vuex'
import App from './App'
import router from './router'
import store from './store/index'
import axios from 'axios'
import VueAxios from 'vue-axios'
import qs from 'qs'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

/**
 * 注册组件
 */

Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.use(Vuex)
Vue.use(VueAxios, axios)
Vue.use(qs)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: {App}
})
