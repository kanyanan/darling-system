<template>
	<el-row class="container">
		<el-col :span="24" class="header">
			<el-col :span="10" class="logo" :class="collapsed?'logo-collapse-width':'logo-width'">
				{{collapsed?'':sysName}}
			</el-col>
			<el-col :span="10">
				<div class="tools" @click.prevent.stop="collapse">
					<i class="el-icon-custom-fold"></i>
				</div>
			</el-col>
			<el-col :span="6" class="userinfo">
				<span class="el-dropdown-link userinfo-inner">
					<span class="m-r-15"><i class="el-icon-custom-user p-r-5"></i>{{employeeName}}（{{employeeID}}）</span>
					<span class="point-type" @click="fnExitLogin"><i class="el-icon-custom-exit p-r-5"></i>退出</span>
				</span>
			</el-col>
		</el-col>
		
		<el-col :span="24" class="main">
			<aside :class="collapsed?'menu-collapsed':'menu-expanded'">
				<!--导航菜单-->
				<el-menu :default-active="$route.path" class="el-menu-vertical-demo" unique-opened router v-if="!collapsed">
					<template v-for="(item,index) in $router.options.routes" v-if="!item.hidden">
						<el-submenu :index="index+''" v-if="!item.leaf">
							<template slot="title"><i :class="item.iconCls"></i>{{item.name}}</template>
							<el-menu-item v-for="child in item.children" :index="child.path" :key="child.path" v-if="!child.hidden">{{child.name}}</el-menu-item>
						</el-submenu>
						<el-menu-item v-if="item.leaf&&item.children.length>0" :index="item.children[0].path">
							<i :class="item.iconCls"></i>
							{{item.children[0].name}}
						</el-menu-item>
					</template>
				</el-menu>
				<!--导航菜单-折叠后-->
				<ul class="el-menu el-menu-vertical-demo collapsed" v-if="collapsed" ref="menuCollapsed">
					<li v-for="(item,index) in $router.options.routes" v-if="!item.hidden" class="el-submenu item">
						<template v-if="!item.leaf">
							<div class="el-submenu__title" style="padding-left: 20px;" @mouseover="showMenu(index,true)" @mouseout="showMenu(index,false)"><i :class="item.iconCls"></i></div>
							<ul class="el-menu submenu" :class="'submenu-hook-'+index" @mouseover="showMenu(index,true)" @mouseout="showMenu(index,false)"> 
								<li v-for="child in item.children" v-if="!child.hidden" :key="child.path" class="el-menu-item" style="padding-left: 40px;" :class="$route.path==child.path?'is-active':''" @click="$router.push(child.path)">{{child.name}}</li>
							</ul>
						</template>
						<template v-else>
							<li class="el-submenu">
								<div class="el-submenu__title el-menu-item" style="padding-left: 20px;height: 56px;line-height: 56px;padding: 0 20px;min-width: 0;" :class="$route.path==item.children[0].path?'is-active':''" @click="$router.push(item.children[0].path)"><i :class="item.iconCls"></i></div>
							</li>
						</template>
					</li>
				</ul>
			</aside>
			<section class="content-container">
				<div class="grid-content bg-purple-light">
					<el-col :span="24" class="breadcrumb-container">
						<strong class="title">{{$route.name}}</strong>
						<el-breadcrumb separator="/" class="breadcrumb-inner">
							<el-breadcrumb-item v-for="item in $route.matched" :key="item.path">
								{{ item.name }}
							</el-breadcrumb-item>
						</el-breadcrumb>
					</el-col>
					<el-col :span="24" class="content-wrapper">
						<transition name="fade" mode="out-in">
							<router-view></router-view>
						</transition>
					</el-col>
				</div>
			</section>
		</el-col>
	</el-row>
</template>

<script>
  	import Svc from '../service/index.js'
	export default {
		data() {
			return {
				sysName:'Darling体验中心管理系统',
				collapsed:false,
				employeeName: '',
				employeeID: ''
			}
		},
//		beforeMount() {
//			//设置定时器，每3秒刷新一次
//	     	var that = this;
//	     	setInterval(function () {
//	     		that.fnGetPendingTask()
//        	},10000)
//		},  
		methods: {
            //显示message提示框
            openMessage : function(msg,type){
    	        this.$message({
		          	showClose: true,
		          	message: msg,
		          	type: type
		        });
            },
			//折叠导航栏
			collapse:function(){
				this.collapsed = !this.collapsed;
			},
			showMenu(i,status){
				this.$refs.menuCollapsed.getElementsByClassName('submenu-hook-'+i)[0].style.display=status?'block':'none';
			},
			//退出登录
			fnExitLogin : function(){
				this.$router.push({ path: '/' });
			},
			//获取当前的待办事项数
//			fnGetPendingTask(){
//				var that = this
//	            Svc.fnPostData('/api/account/pendingtask',{"EmpID" : that.employeeID},function(res){
//	            	if (res.body.ErrCode == 0){
//	            		that.pendingTask = res.body.Data
//	            	} else {
//	            		that.openMessage("待办事项总数获取失败！ ",'error')
//	            	}
//	            },function(res){
//	            	that.openMessage("网络错误，请重新！ ",'error')
//	            })
//			}
		},
		mounted() {
			var user = sessionStorage.getItem('user');
			if (user) {
				user = JSON.parse(user);
				this.employeeName = user.Name || '';
				this.employeeID = user.EmployeeID || '';
			}
			
			//待办事项总数
//			this.fnGetPendingTask()
		}
	}

</script>

<style scoped>
	.m-r-15{
		margin-right: 15px;
	}
	
	.p-r-5{
		padding-right: 5px;
	}
	
	.point-type{
		cursor: pointer;
	}

	.container {
		position: absolute;
		top: 0px;
		bottom: 0px;
		width: 100%;
	}
	
	.header {
		height: 60px;
		line-height: 60px;
		background:#20a0ff;
		color:#fff;
  		font-family: Microsoft YaHei;
	}
	
	.header .userinfo {
		text-align: right;
		padding-right: 35px;
		float: right;
	}
	
	/*.header .userinfo .userinfo-inner {
		cursor: pointer;
		color:#fff;
	}
	
	.header .userinfo .userinfo-inner img {
		width: 40px;
		height: 40px;
		border-radius: 20px;
		margin: 10px 0px 10px 10px;
		float: right;
	}*/
	
	.header .userinfo .userinfo-inner {
		font-size: 14px;
		color:#fff;
	}
	
	.header .logo {
		height:60px;
		font-size:16px;
		padding-left:20px;
		padding-right:20px;
		border-color: rgba(238,241,146,0.3);
		border-right-width: 1px;
		border-right-style: solid;
	}
	
	.header .logo img {
		width: 40px;
		float: left;
		margin: 10px 10px 10px 18px;
	}
	
	.header .logo .txt {
		color:#fff;
	}
	
	.header .logo-width{
		width:230px;
	}
	
	.header .logo-collapse-width{
		width:60px
	}
	
	.header .tools{
		padding: 0px 23px;
		width:14px;
		height: 60px;
		line-height: 60px;
		cursor: pointer;
	}
	
	.main {
		display: flex;
		position: absolute;
		top: 60px;
		bottom: 0px;
		overflow: hidden;
		font-family: Microsoft YaHei;
	}
	
	.main aside {
		flex:0 0 230px;
		width: 230px;
	}
	
	.main aside .el-menu{
		height: 100%;
	}
	.main aside .collapsed{
		width:60px;
	}
	
	.main aside .collapsed .item{
		position: relative;
	}
	.main aside .collapsed .submenu{
		position:absolute;
		top:0px;
		left:60px;
		z-index:99999;
		height:auto;
		display:none;
	}
	
	.main .menu-collapsed{
		flex:0 0 60px;
		width: 60px;
	}
	
	.main .menu-expanded{
		flex:0 0 230px;
		width: 230px;
	}
	
	.main .content-container {
		flex:1;
		overflow-y: scroll;
		padding: 20px;
	}
	
	.main .content-container .breadcrumb-container .title {
		width: 200px;
		font-size: 15px;
		float: left;
		color: #475669;
	}
	
	.main .content-container .breadcrumb-container .breadcrumb-inner {
		float: right;
	}
	
	.main .content-container .content-wrapper {
		background-color: #fff;
		box-sizing: border-box;
	}
	
	.el-badge{
	    margin-bottom: 5px;
	}
</style>