import Vue from 'vue'
import App from './App.vue'
//引入elementUI
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'

Vue.use(ElementUI)

new Vue({
  render: h => h(App)
}).$mount('#app')
