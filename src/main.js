import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './assets/css/global.css'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import './assets/fonts/iconfont.css'
import tree from 'vue-table-with-tree-grid'


Vue.config.productionTip = false
Vue.use(ElementUI);
Vue.component('tree-table', tree)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
