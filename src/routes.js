import Login from './views/Login.vue'
import Home from './views/Home.vue'
//迎宾服务
import FaceRecognition from './views/welcomingsvc/FaceRecognition.vue'
//医疗诊断
import Clinic from './views/medical/Clinic.vue'
//系统管理
import Member from './views/system/Member.vue'
import Sale from './views/system/Sale.vue'
import Agent from './views/system/Agent.vue'
import ProductQRCode from './views/system/ProductQRCode.vue'
//import Report from './views/system/Report.vue'
//系统权限管理
import User from './views/sysmanager/User.vue'
import Role from './views/sysmanager/Role.vue'
import Action from './views/sysmanager/Action.vue'
import Menu from './views/sysmanager/Menu.vue'
//个人中心
import PersonalInfo from './views/personal/PersonalInfo.vue'
import ModifyPassword from './views/personal/ModifyPassword.vue'


let routes = [
    {
        path: '/',
        component: Login,
        name: '',
        hidden: true
    },
    ...generateRoutesFromMenu(store.state.items)
];

export default routes;

// Menu should have 2 levels.  
function generateRoutesFromMenu (menu = [], routes = []) {  
	for (let i = 0, l = menu.length; i < l; i++) {  
	    let item = menu[i] 
	    if (item.path) {
	        routes.push(item)  
	    }
	}
	return routes  
}
