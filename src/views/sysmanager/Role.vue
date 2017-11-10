<template>
	<section>
		<!--Alert提示框-->
        <el-alert type="warning" class="alert-style" v-show="hasAlert" @close="fnAlertClose">{{alertMsg}}</el-alert>
		
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom:0px;height: 56px;">
			<el-form :inline="true" :model="filters">
				<!--<el-form-item>
					<el-input v-model="filters.name" placeholder="角色名称"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary">查询</el-button>
				</el-form-item>-->
				<el-form-item>
					<el-button type="warning" @click="handleAdd('new')">新增角色</el-button>
				</el-form-item>
			</el-form>
		</el-col>
		
		<!--列表-->
		 <el-table :data="roles" border class="m-t-10" style="width: 100%" v-loading="rolesLoading" element-loading-text="拼命加载中">
			<el-table-column prop="RoleName" label="角色名称" width="180">
			</el-table-column>
			<el-table-column prop="Desc" label="角色描述" width="408">
			</el-table-column>
			<el-table-column prop="CreatedTime" label="创建时间" :formatter="fnDateFormat" width="190">
			</el-table-column>
			<el-table-column prop="Createdby" label="创建者" width="150">
			</el-table-column>
			<el-table-column label="操作" width="150">
				<template scope="scope">
					<el-tooltip class="item" effect="dark" content="编辑角色" placement="bottom">
				      	<el-button size="mini" icon="custom-edit" @click="handleAdd('edit',scope.row.ID)"></el-button>
				    </el-tooltip>
				    <el-tooltip class="item" effect="dark" content="资源维护" placement="bottom">
				      	<el-button type="info" size="mini" icon="custom-distribution" @click="fnDistributionAction(scope.row.ID)"></el-button>
				    </el-tooltip>
				    <el-tooltip class="item" effect="dark" content="菜单维护" placement="bottom">
				      	<el-button type="warning" size="mini" icon="custom-classification" @click="fnDistributionMenu(scope.row.ID)"></el-button>
				    </el-tooltip>
				</template>
			</el-table-column>
		</el-table>
		
		<!--工具条-->
		<!--<el-col :span="24" class="toolbar">
			<el-pagination layout="prev, pager, next" :page-size="10" :total="total" style="float:right;">
			</el-pagination>
		</el-col>-->
		
		<!--新增/编辑角色界面-->
		<el-dialog title="新增/编辑角色" v-model="addFormVisible" :close-on-click-modal="false">
			<el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
				<el-form-item label="角色名称" prop="rolename">
					<el-input v-model="addForm.rolename" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="角色描述">
				    <el-input type="textarea" rows="2" v-model="addForm.remark" auto-complete="off"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="fnAddRole(hasEdit)">提交</el-button>
			</div>
		</el-dialog>
		
		<!--分配资源界面-->
		<el-dialog title="分配资源" v-model="actionFormVisible" :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false">
			<div style="padding: 30px 75px;">
				<!--<el-transfer v-model="selectedActions" :data="actions" :titles="['所有资源', '已分配资源']" :button-texts="['撤回', '分配']" :render-content="fnRender"></el-transfer>-->
				<el-transfer v-model="selectedActions" :data="actions" :titles="['所有资源', '已分配资源']" :button-texts="['撤回', '分配']"></el-transfer>
			</div>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="fnNoAssignAction">取消</el-button>
				<el-button type="primary" @click.native="fnAssignAction">提交</el-button>
			</div>
		</el-dialog>
		
		<!--分配菜单界面-->
		<el-dialog title="分配菜单" v-model="menuFormVisible" size="tiny" :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false">
			<el-tree :data="menus" ref="tree" show-checkbox node-key="ID" :props="menuProps" default-expand-all="true">
			</el-tree>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="fnNoAssignMenu">取消</el-button>
				<el-button type="primary" @click.native="fnAssignMenu">提交</el-button>
			</div>
		</el-dialog>
		
	</section>
</template>

<script>
    import Svc from '../../service/index.js'
	export default {
		data() {
			return {
				alertMsg:'',
				hasAlert:false,
				rolesLoading:false,
				filters: {
					name: ''
				},
				roles: [],
				total: 20,
				hasEdit: 'new',//判断当前是否为编辑角色状态
				addFormVisible: false,//新增角色界面是否显示
				addFormRules: {
					rolename: [
						{ required: true, message: '请输入角色名称', trigger: 'blur' }
					],
					remark: [
						{ required: true, message: '请输入角色描述', trigger: 'blur' }
					]
				},
				//新增界面数据
				addForm: {
					rolename:'',
					remark:''
				},
				//当前角色id
				curRoleID:'',
				//所有资源
				allActions : [],
				actionFormVisible: false, //分配资源界面是否显示
				menuFormVisible: false, //分配菜单界面是否显示
				actions : [],
				selectedActions : [],
//		        fnRender(h, option) {
//		        	var labels = option.label.split(",")
//    	          	return (
//			            <div>
//				            <p style="margin: 0;line-height: 12px;font-size: 12px;">{ labels[0] }</p>
//			          		<p style="margin: 0;line-height: 13px;font-size: 12px;">{ labels[1] }</p>
//			            </div>
//			        )
//		        },
		        
		        //所有菜单
           	 	menus: [],
		        menuProps: {
		          children: 'SubMenus',
		          label: 'Title'
		        }
			}
		},
		methods: {
            //时间格式化  
            fnDateFormat:function(row, column) {
            	var moment = require('moment');
                var date = row[column.property];  
	          	if (date == undefined) {  
	             	return "";  
	          	}  
	          	return moment(date).format("YYYY-MM-DD HH:mm:ss");  
            },
            //关闭alert
            fnAlertClose : function(){
            	this.hasAlert = false
            },
        	//显示message提示框
            openMessage : function(msg,type){
    	        this.$message({
		          	showClose: true,
		          	message: msg,
		          	type: type
		        });
            },
            //获取角色列表
			fnGetRoles : function() {
				var that = this
				that.rolesLoading = true
				//获取已存在的角色
	            Svc.fnGetData('/api/sysmanage/roles',{},function(res){
	            	if (res.body.ErrCode == 0){
	            		that.roles = res.body.Data
	            		that.rolesLoading = false
	            	} else {
	            		that.alertMsg = "角色列表获取失败！"
	            		that.hasAlert = true
	            	}
	            },function(res){
	            	that.alertMsg = "网络错误，请重新！"
	            	that.hasAlert = true
	            })
			},
            //获取菜单
			fnGetMenus : function() {
				var that = this
				//获取菜单
	            Svc.fnGetData('/api/sysmanage/menus',{},function(res){
	            	if (res.body.ErrCode == 0){
	            		that.menus = res.body.Data
	            	} else {
	            		that.alertMsg = "菜单列表获取失败！"
	            		that.hasAlert = true
	            	}
	            },function(res){
	            	that.alertMsg = "网络错误，请重新！"
	            	that.hasAlert = true
	            })
			},
            //获取角色已拥有菜单
			fnGetRoleMenus : function(roleID) {
				var that = this
				//获取角色已拥有菜单
	            Svc.fnGetData('/api/sysmanage/menus/'+roleID,{},function(res){
	            	if (res.body.ErrCode == 0){
	            		var checkedMenu = []
	            		var data = res.body.Data || []
	            		for (var i=0;i<data.length;i++) {
	            			var item = data[i].SubMenus || []
	            			for (var j=0;j<item.length;j++) {
	            				checkedMenu.push(item[j].ID)
	            			}
	            		}
	            		
	            		that.$refs.tree.setCheckedKeys(checkedMenu);
	            	} else {
	            		that.alertMsg = "角色已拥有菜单获取失败！"
	            		that.hasAlert = true
	            	}
	            },function(res){
	            	that.alertMsg = "网络错误，请重新！"
	            	that.hasAlert = true
	            })
			},
			//获取资源列表
			fnGetActions : function() {
				var that = this
				//获取已存在的资源
	            Svc.fnGetData('/api/sysmanage/actions',{},function(res){
	            	if (res.body.ErrCode == 0){
	            		that.allActions = res.body.Data
	            	} else {
	            		that.alertMsg = "资源列表获取失败！"
	            		that.hasAlert = true
	            	}
	            },function(res){
	            	that.alertMsg = "网络错误，请重新！"
	            	that.hasAlert = true
	            })
			},
			//获取角色已拥有资源
			fnGetUserActions : function(roleID) {
				var that = this
				//获取角色已拥有资源
	            Svc.fnGetData('/api/sysmanage/actions/'+roleID,{},function(res){
	            	if (res.body.ErrCode == 0){
	            		//角色已拥有资源格式化
	            		var data = res.body.Data || []
	            		for(var i=0;i<data.length;i++){
	            			that.selectedActions.push(data[i].ID)
	            		}
	            	} else {
	            		that.alertMsg = "角色已拥有资源获取失败！"
	            		that.hasAlert = true
	            	}
	            },function(res){
	            	that.alertMsg = "网络错误，请重新！"
	            	that.hasAlert = true
	            })
			},
			//显示新增或编辑界面
			handleAdd: function (type,roleID) {
				var that = this;
				that.curRoleID = roleID;
				that.hasEdit = 'new';
				that.addFormVisible = true;
				if (type == 'edit') {
					that.hasEdit = 'edit';
					//获取当前roleID所对应的role对象
					for (var i=0;i<that.roles.length;i++) {
						var item = that.roles[i]
						if (roleID == item.ID) {
							that.addForm.rolename = item.RoleName;
							that.addForm.remark = item.Desc;
							break;
						}
					}
				}
			},
			//新增或编辑角色
			fnAddRole : function(type){
				var that = this
				var url = '/api/sysmanage/createrole';
				var params = that.addForm
				if (type == 'new') {
					url = '/api/sysmanage/createrole';
					params = that.addForm
				} else if (type == 'edit') {
					url = '/api/sysmanage/editrole';
					params = {
				        RoleID:that.curRoleID,
        				RoleName:that.addForm.rolename,
						Remark:that.addForm.remark
					}
				}
				
				//新增或编辑角色
				that.$refs.addForm.validate((valid) => {
					if (valid) {
			            Svc.fnPostData(url,params,function(res){
			            	if (res.body.ErrCode == 0){
			            		that.addFormVisible = false
			            		setTimeout(function () {
				         			//刷新当前组件
		            				that.$router.go(0)
					          	},1500);
			            	} else {
			            		that.openMessage(res.body.ErrMsg,'error')
			            	}
			            },function(res){
			            	that.alertMsg = "网络错误，请重新！"
			            	that.hasAlert = true
			            })
			        }
				});
			},
			//分配资源数据格式化
		    fnGetActionsData: function(actions){
		        var data = [];
		        for (var i = 0; i < actions.length; i++) {
		        	var item = actions[i]
		          	data.push({
		            	key: item.ID,
//		            	label: item.Method+","+item.URLPath,
						label:item.Name
		         	});
		        }
		        return data
		    },
			//显示分配资源界面
			fnDistributionAction: function(roleID){
				var that = this
				that.curRoleID = roleID
				//展示分配资源页面
				that.actionFormVisible = true;
				//获取所有资源
        		that.actions = that.fnGetActionsData(that.allActions)
				//获取角色已拥有资源
				that.fnGetUserActions(roleID)
			},
		    //分配资源
		    fnAssignAction : function(){
		    	var that = this
		    	var params = {
	    			RoleID:that.curRoleID,
					ActionIDs:that.selectedActions
		    	}
		    	
				Svc.fnPostData('/api/sysmanage/assignaction',params,function(res){
	            	if (res.body.ErrCode == 0){
						//隐藏分配页面
						that.actionFormVisible = false;
						that.selectedActions = [];
						that.actions = [];
	            		that.openMessage("资源分配成功！","success")
	            	} else {
	            		that.openMessage(res.body.ErrMsg,'error')
	            	}
	            })
		    },
		    //取消分配资源
		    fnNoAssignAction : function(){
		    	var that = this
		    	that.actionFormVisible = false
		    	//清除数据
				that.selectedActions = [];
				that.actions = [];
		    },
		    //显示分配菜单界面
		    fnDistributionMenu:function(roleID){
		    	var that = this
		    	that.curRoleID = roleID
		    	that.menuFormVisible = true
				//菜单列表
				that.fnGetMenus()
		    	//获取角色已拥有的菜单
		    	that.fnGetRoleMenus(roleID)
		    },
		    //分配菜单
		    fnAssignMenu : function(){
		    	var that = this
		    	
		    	//获取被选择的菜单（解决只选择个别子菜单时，父菜单不选中的问题）
		    	var checkedKeys = that.$refs.tree.getCheckedKeys();
		    	var menuKeys = [];
		    	for (var i = 0;i<checkedKeys.length;i++) {
		    		var flag = false;
			    	for (var j = 0;j<that.menus.length;j++) {
			    		var item = that.menus[j];
			    		//当前ID是父级ID
		    			if (checkedKeys[i] == item.ID) {
		    				if (menuKeys.indexOf(checkedKeys[i]) == -1) {
		    					menuKeys.push(checkedKeys[i]);
		    				};
		    				flag = true;
		    				continue;
		    			}
		    			
		    			//当前ID是子级ID
		    			for (var k = 0;k<item.SubMenus.length;k++) {
		    				if (checkedKeys[i] == item.SubMenus[k].ID) {
		    					//保存子级ID
			    				if (menuKeys.indexOf(checkedKeys[i]) == -1) {
		    						menuKeys.push(checkedKeys[i]);
		    					};
		    					//保存父级ID
		    					if (menuKeys.indexOf(item.ID) == -1) {
		    						menuKeys.push(item.ID);
		    					};
		    					
		    					flag = true;
		    					break;
			    			}
		    			}
		    			
		    			if (flag) {
		    				break;
		    			}
		    		}
		    	}
		    	
		    	console.log("*************"+menuKeys)
		    	
		    	var params = {
	    			RoleID:that.curRoleID,
					MenuIDs:menuKeys
		    	}
		    	
				Svc.fnPostData('/api/sysmanage/assignmenu',params,function(res){
	            	if (res.body.ErrCode == 0){
						//隐藏分配菜单页面
						that.menuFormVisible = false;
	            		that.openMessage("菜单分配成功！","success")
	            	} else {
	            		that.openMessage(res.body.ErrMsg,'error')
	            	}
	            })
		    },
		    //取消分配菜单
		    fnNoAssignMenu : function(){
		    	var that = this
		    	that.menuFormVisible = false
		    }
		},
		mounted() {
			//角色列表
			this.fnGetRoles()
			//资源列表
			this.fnGetActions()
		}
	}

</script>

<style scoped>
	.m-t-10{
		margin-top: 10px;
	}

	.toolbar {
	    background: #f2f2f2;
	    padding: 10px 10px 0 10px;
	    margin: 10px 0;
	}
	
	.alert-style{
	    font-size: 15px;
    	margin-top: 10px;
	}
</style>