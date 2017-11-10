import "babel-polyfill"; //兼容IE浏览器
import Vue from 'vue'
import App from './App.vue'
//引入VueRouter
import VueRouter from 'vue-router'
import routes from './routes'
//引入vuex
import Vuex from 'vuex'
import store from './vuex/store.js'
//引入elementUI
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
//引入字符图标
import './icon/iconfont.css'

Vue.use(ElementUI)
Vue.use(VueRouter)
Vue.use(Vuex)

//创建一个router实例
const router = new VueRouter({
	routes
})

router.beforeEach((to, from, next) => {
  	if (to.path === '/') {
    	sessionStorage.removeItem('user');
  	}
  
  	let user = JSON.parse(sessionStorage.getItem('user'));
//	if (!user && to.path !== '/') {
		if (user && to.path !== '/') {
    	next({ path: '/' })
  	} else {
    	next()
  	}
})

new Vue({
	router,
  render: h => h(App)
}).$mount('#app')
