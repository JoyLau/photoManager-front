import Vue from 'vue'

import 'normalize.css/normalize.css'// A modern alternative to CSS resets
import './theme/index.css'
import ElementUI from 'element-ui'
import './styles/index.scss' // global css

//引用zTree插件
import "./js/jquery.min.js";
import "../plugins/zTree/js/jquery.ztree.core-3.5.min.js";
import "../plugins/zTree/js/jquery.ztree.excheck-3.5.min.js";
import "../plugins/zTree/css/zTreeStyle.css";

import App from './App'
import router from './router'
import store from './store'
import axios from 'axios'

import './icons' // icon
import './permission' // permission control
//import './validate'//validate
import draggable from 'vuedraggable'

import * as filters from './filters' // global filters

Vue.prototype.$http = axios;


Vue.use(ElementUI, {
  size: 'medium' // set element-ui default size
})

// register global utility filters.
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
