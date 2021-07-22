import Vue from 'vue'
import App from './App.vue'
import router from './router/index'
import './plugins/element.js'
// import './assets/css/global.css'
// import './assets/fonts/iconfont.css'



Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  router
}).$mount('#app')
