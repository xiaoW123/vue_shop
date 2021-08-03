import Vue from 'vue'
import App from './App.vue'
import router from './router/router'
import './plugins/element.js'
// import './assets/css/global.css'
// import './assets/fonts/iconfont.css'
import TreeTable from 'vue-table-with-tree-grid'
Vue.component('tree-table' ,TreeTable)

import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme
Vue.use(VueQuillEditor, /* { default global options } */)




Vue.config.productionTip = false

// 自定义格式化时间的全局过滤器
Vue.filter('dateFormat', function(originVal) {
  const dt = new Date(originVal)
  const y = dt.getFullYear() //年
  const m = (dt.getMonth() + 1 + '').padStart(2, '0') //月
  const d = (dt.getDate() + 1 + '').padStart(2, '0') //日
  const hh = (dt.getHours() + 1 + '').padStart(2, '0')
  const mm = (dt.getMinutes() + 1 + '').padStart(2, '0')
  const ss = (dt.getSeconds() + 1 + '').padStart(2, '0')
  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

new Vue({
  render: h => h(App),
  router
}).$mount('#app')
