import Vue from 'vue'  
import Vuex from 'vuex'  
import * as actions from './actions'  
import * as getters from './getters'  
  
Vue.use(Vuex)


const state = {
	//菜单
  items: [] 
}  
  
const mutations = {  
  addMenu(state, menuItems) {  
    if (menuItems.length === 0) {  
      state.items = []  
    } else {
    	//组装路由
      state.items = generateMenuItems(menuItems) 
    }
  } 
}  
  
export default new Vuex.Store({  
  state,
  mutations,
  actions,  
  getters
})

//组装路由
function fnAssemble (temp){
	var item = {
		"path" : temp.Link,
		"component" : resolve => require([`../views/` + temp.Value + `.vue`], resolve),
		"name" : temp.Title,
		"iconCls" : temp.Icon
	}
	
	return item
}

function generateMenuItems(menuItems) {
	var newMenus = []
	for(var i = 0; i < menuItems.length; i++) {
		var item = menuItems[i]
		var menuItem = {children:[]}
		//设置子菜单
		for(var j = 0; j < item.SubMenus.length; j++) {
			menuItem.children.push(fnAssemble(item.SubMenus[j]))
		}
		//设置父级菜单
		menuItem = Object.assign(menuItem,fnAssemble(item))
		newMenus.push(menuItem)
	}
	
	return newMenus
}