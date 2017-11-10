<template>
	<section>
		<!--Alert提示框-->
        <el-alert type="warning" class="alert-style" v-show="hasAlert" @close="fnAlertClose">{{alertMsg}}</el-alert>
		
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;height: 56px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.name" placeholder="用户姓名"></el-input>
				</el-form-item>
				<el-form-item>
					<el-select v-model="filters.status" placeholder="请选择状态">
						<el-option v-for="item in allStatus" :key="item.value" :label="item.label" :value="item.value">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-select v-model="filters.role" placeholder="请选择角色">
						<el-option v-for="item in allRoles" :key="item.ID" :label="item.RoleName" :value="item.ID">
							<span style="float: left">{{ item.RoleName }}</span>
							<span style="float: right; color: #8492a6; font-size: 13px">{{ item.Desc }}</span>
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="fnGetUsers">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="warning" @click="handleAdd">新增用户</el-button>
				</el-form-item>
			</el-form>
		</el-col>
		
		<!--列表-->
		<el-table :data="users" border style="width: 100%" v-loading="usersLoading" element-loading-text="拼命加载中">
			<el-table-column fixed prop="Account" label="账号" width="150">
			</el-table-column>
			<el-table-column prop="Name" label="姓名" width="120">
			</el-table-column>
			<el-table-column prop="Title" label="职务" min-width="130">
			</el-table-column>
			<el-table-column prop="Gender" label="性别" :formatter="fnGenderFont" width="80">
			</el-table-column>
			<el-table-column prop="Mobile" label="电话" width="140">
			</el-table-column>
			<el-table-column prop="Email" label="邮件" min-width="220">
			</el-table-column>
			<el-table-column prop="Status" label="状态" min-width="80">
			</el-table-column>
			<el-table-column prop="CreatedTime" label="创建时间" :formatter="fnDateFormat" min-width="180">
			</el-table-column>
			<el-table-column prop="Createdby" label="创建者" min-width="120">
			</el-table-column>
			<el-table-column fixed="right" label="操作" width="185">
				<template scope="scope">
					<el-tooltip class="item" effect="dark" content="重置密码" placement="bottom">
				      	<el-button size="mini" icon="custom-edit" @click="fnResetPwd(scope.row.ID)"></el-button>
				    </el-tooltip>
				    <el-tooltip class="item" effect="dark" content="冻结用户" placement="bottom" v-show="scope.row.Status == '已激活'">
				      	<el-button type="warning" size="mini" icon="custom-lock" @click="fnLockUser(scope.row.ID)"></el-button>
				    </el-tooltip>
			    	<el-tooltip class="item" effect="dark" content="解冻用户" placement="bottom" v-show="scope.row.Status == '已冻结'">
				      	<el-button type="danger" size="mini" icon="custom-unlock" @click="fnUnLockUser(scope.row.ID)"></el-button>
				    </el-tooltip>
				    <el-tooltip class="item" effect="dark" content="角色维护" placement="bottom">
				      	<el-button type="info" size="mini" icon="custom-distribution" @click="fnDistributionRole(scope.row.ID)"></el-button>
				    </el-tooltip>
				    <el-tooltip class="item" effect="dark" content="工艺授权" placement="bottom">
				      	<el-button type="success" size="mini" icon="custom-authorize" @click="fnManufAuthorize(scope.row.ID)"></el-button>
				    </el-tooltip>
				</template>
			</el-table-column>
		</el-table>
		
		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-pagination layout="total, prev, pager, next" @current-change="fnPaginationChange" :page-size="size" :total="total" style="float:right;">
			</el-pagination>
		</el-col>
		
		<!--新增用户界面-->
		<el-dialog title="新增用户" v-model="addFormVisible" :close-on-click-modal="false">
			<el-form :inline="true" :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
				<el-form-item label="账号" prop="account">
					<el-input v-model="addForm.account" auto-complete="off" maxlength="20"></el-input>
				</el-form-item>
				<el-form-item label="姓名" prop="name">
					<el-input v-model="addForm.name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="职务" prop="title">
					<el-input v-model="addForm.title" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="性别">
					<el-radio-group v-model="addForm.gender">
						<el-radio class="radio" label="M">男性</el-radio>
						<el-radio class="radio" label="F">女性</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="电话" prop="mobile">
					<el-input v-model="addForm.mobile" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="邮件" prop="email">
					<el-input v-model="addForm.email" auto-complete="off"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="fnAddUser">提交</el-button>
			</div>
		</el-dialog>
		
		<!--分配角色界面-->
		<el-dialog title="分配角色" v-model="roleFormVisible" :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false">
			<div style="padding: 30px 75px;">
				<el-transfer v-model="selectedRoles" :data="roles" :titles="['所有角色', '已分配角色']" :button-texts="['撤回', '分配']"></el-transfer>
			</div>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="fnNoAssignRole">取消</el-button>
				<el-button type="primary" @click.native="fnAssignRole">提交</el-button>
			</div>
		</el-dialog>
		
		<!--工艺授权界面-->
		<el-dialog title="工艺授权" v-model="authorizeFormVisible" size="tiny" :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false">
			<el-tree :data="authorizes" ref="tree" show-checkbox node-key="Code" :props="authorizeProps">
			</el-tree>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="authorizeFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="fnAssignAuthorize">提交</el-button>
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
				usersLoading:false,
				allStatus : [{
					label : '所有状态',
					value : 99
				},{
					label : '已创建',
					value : 0
				},{
					label : '已激活',
					value : 1
				},{
					label : '已冻结',
					value : 2
				},{
					label : '已注销',
					value : 3
				}],
				allRoles:[{
					RoleName : '所有角色',
					ID : 0
				}],
				//分配界面用所有角色
				distributRoles:[],
				filters: {
					name: '',
					status: 99,
					role: 0
				},
				users: [],
				total: 0,
				skip: 0,
				size: 10,
				addFormVisible: false,//新增用户界面是否显示
				addFormRules: {
					account: [
						{ required: true, message: '请输入账号', trigger: 'blur' }
					],
					name: [
						{ required: true, message: '请输入姓名', trigger: 'blur' }
					],
					mobile: [
						{ required: true, message: '请输入电话号码', trigger: 'blur' }
					],
					email: [
						{ required: true, message: '请输入邮箱', trigger: 'blur' }
					]
				},
				//新增界面数据
				addForm: {
					account:'',
					name: '',
					title:'',
					gender: "M",
					mobile:'',
					email:''
				},
				//当前用户id
				curUserID:'',
				roleFormVisible: false, //分配角色界面是否显示
				roles : [],
				selectedRoles : [],
				authorizeFormVisible: false, //工艺授权界面是否显示
				//工艺授权
				authorizes : [],
		        authorizeProps: {
		          children: 'Items',
		          label: 'Value'
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
            //格式化性别
            fnGenderFont: function (row, column) {
				return row.Gender == 'M' ? '男' : row.Gender == 'F' ? '女' : '未知';
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
			//分页
			fnPaginationChange : function(val) {
				this.skip = val-1;
				this.fnGetUsers();
			},
			//获取用户列表
			fnGetUsers : function() {
				var that = this
				that.usersLoading = true
				//skip代表数据下标，从0开始
				var params = {
					Skip: that.skip*that.size,
					Size: that.size,
					Name: that.filters.name,
					Status: that.filters.status,
					Role: that.filters.role
				};
				
				//获取已存在的用户
	            Svc.fnPostData('/api/sysmanage/searchuser',params,function(res){
	            	if (res.body.ErrCode == 0){
	            		that.users = res.body.Data.Users
	            		that.total = res.body.Data.Total
	            		that.usersLoading = false
	            	} else {
	            		that.alertMsg = "用户列表获取失败！"
	            		that.hasAlert = true
	            	}
	            },function(res){
	            	that.alertMsg = "网络错误，请重新！"
	            	that.hasAlert = true
	            })
			},
			//获取角色列表
			fnGetRoles : function() {
				var that = this
				//获取已存在的角色
	            Svc.fnGetData('/api/sysmanage/roles',{},function(res){
	            	if (res.body.ErrCode == 0){
	            		//角色分配
	            		that.distributRoles = res.body.Data
	            		//过滤条件 -> 按角色过滤
	            		that.allRoles = that.allRoles.concat(res.body.Data)
	            	} else {
	            		that.alertMsg = "角色列表获取失败！"
	            		that.hasAlert = true
	            	}
	            },function(res){
	            	that.alertMsg = "网络错误，请重新！"
	            	that.hasAlert = true
	            })
			},
			//获取用户已拥有角色
			fnGetUserRoles : function(userID) {
				var that = this
				//获取用户已拥有角色
	            Svc.fnGetData('/api/sysmanage/roles/'+userID,{},function(res){
	            	if (res.body.ErrCode == 0){
	            		//用户已拥有角色格式化
	            		var data = res.body.Data || []
	            		for(var i=0;i<data.length;i++){
	            			that.selectedRoles.push(data[i].ID)
	            		}
	            	} else {
	            		that.alertMsg = "用户已拥有角色获取失败！"
	            		that.hasAlert = true
	            	}
	            },function(res){
	            	that.alertMsg = "网络错误，请重新！"
	            	that.hasAlert = true
	            })
			},
			//获取制造工艺列表
			fnGetManufacture : function() {
				var that = this
				//获取制造工艺列表
	            Svc.fnGetData('/api/manuf/all',{},function(res){
	            	if (res.body.ErrCode == 0){
	            		that.authorizes = res.body.Data
	            	} else {
	            		that.alertMsg = "制造工艺列表获取失败！"
	            		that.hasAlert = true
	            	}
	            },function(res){
	            	that.alertMsg = "网络错误，请重新！"
	            	that.hasAlert = true
	            }) 
			},
			//获取用户已拥有的制造工艺
			fnGetUserManufacture : function(userID) {
				var that = this
				//获取用户已拥有的制造工艺
	            Svc.fnGetData('/api/sysmanage/usermanuf/'+userID,{},function(res){
	            	if (res.body.ErrCode == 0){
	            		that.$refs.tree.setCheckedKeys(res.body.Data);
	            	} else {
	            		that.alertMsg = "用户已拥有工艺获取失败！"
	            		that.hasAlert = true
	            	}
	            },function(res){
	            	that.alertMsg = "网络错误，请重新！"
	            	that.hasAlert = true
	            })
			},
			//显示新增界面
			handleAdd: function () {
				this.addFormVisible = true;
			},
			//新增用户
			fnAddUser : function(){
				var that = this
				//新增用户
				that.$refs.addForm.validate((valid) => {
					if (valid) {
						//判断账号是否存在
						Svc.fnGetData('/api/sysmanage/checkaccount/'+that.addForm.account,{},function(res){
			            	if (res.body.ErrCode == 0){
					            Svc.fnPostData('/api/sysmanage/createuser',that.addForm,function(res){
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
			            	} else {
			            		that.openMessage(res.body.ErrMsg,'error')
			            	}
			            })
					} else {
		            	return false
		          }
				});
			},
			//显示分配角色界面
			fnDistributionRole: function(userID){
				var that = this
				that.curUserID = userID
				//展示分配页面
				that.roleFormVisible = true;
				//获取所有角色
        		that.roles = that.fnGetRolesData(that.distributRoles)
				//获取用户已拥有角色
				that.fnGetUserRoles(userID)
			},
			//分配角色数据格式化
		    fnGetRolesData: function(roles){
		        var data = [];
		        for (var i = 0; i < roles.length; i++) {
		        	var item = roles[i]
		          	data.push({
		            	key: item.ID,
		            	label: item.RoleName + "-" + item.Desc
		         	});
		        }
		        return data
		    },
		    //分配角色
		    fnAssignRole : function(){
		    	var that = this
		    	var params = {
	    			UserID:that.curUserID,
					RoleIDs:that.selectedRoles
		    	}
		    	
				Svc.fnPostData('/api/sysmanage/assignrole',params,function(res){
	            	if (res.body.ErrCode == 0){
						//隐藏分配页面
						that.roleFormVisible = false;
						that.selectedRoles = [];
						that.roles = [];
	            		that.openMessage("角色分配成功！","success")
	            	} else {
	            		that.openMessage(res.body.ErrMsg,'error')
	            	}
	            })
		    },
		    //取消分配角色
		    fnNoAssignRole : function(){
		    	var that = this
		    	that.roleFormVisible = false
		    	//清除数据
				that.selectedRoles = [];
				that.roles = [];
		    },
		    //重置密码
		    fnResetPwd : function(userID){
		    	var that = this
				that.$confirm('确认要重置该用户的登录密码吗?', '提示', {
					type: 'warning'
				}).then(function(){
					Svc.fnGetData('/api/sysmanage/resetpwd/'+userID,{},function(res){
						if (res.body.ErrCode == 0) {
							that.openMessage("用户登录密码重置成功！","success")
						} else {
							that.openMessage(res.body.ErrMsg,'error')
						}
					})
				});
		   	},
		   	//冻结密码
		   	fnLockUser : function(userID){
		   		var that = this
				that.$confirm('确认要冻结该用户吗?', '提示', {
					type: 'warning'
				}).then(function(){
					Svc.fnPostData('/api/sysmanage/freezeuser',{"UserID":userID},function(res){
						if (res.body.ErrCode == 0) {
							setTimeout(function () {
			         			//刷新当前组件
	            				that.$router.go(0)
				          	},1500);
						} else {
							that.openMessage(res.body.ErrMsg,'error')
						}
					})
				});
		   	},
		   	//解冻用户
		   	fnUnLockUser : function(userID){
		   		var that = this
				that.$confirm('确认要将该用户解冻吗?', '提示', {
					type: 'warning'
				}).then(function(){
					Svc.fnPostData('/api/sysmanage/unfreezeuser',{"UserID":userID},function(res){
						if (res.body.ErrCode == 0) {
							setTimeout(function () {
			         			//刷新当前组件
	            				that.$router.go(0)
				          	},1500);
						} else {
							that.openMessage(res.body.ErrMsg,'error')
						}
					})
				});
		   },
		   //展示工艺授权页面
		   fnManufAuthorize : function(id){
		   		var that = this
		   		that.authorizeFormVisible = true
		   		that.curUserID = id
		   		//获取用户已拥有的制造工艺
		   		that.fnGetUserManufacture(id)
		   	},
   		    //分配制造工艺
		    fnAssignAuthorize : function(){
		    	var that = this
		    	//获取被选择的工艺（解决只选择子级，不选择父级的问题）
		    	var checkedKeys = that.$refs.tree.getCheckedKeys();
		    	var authorizeKeys = [];
		    	for (var i = 0;i<checkedKeys.length;i++) {
			    	for (var j = 0;j<that.authorizes.length;j++) {
			    		var item = that.authorizes[j];
			    		//当前ID是父级ID
		    			if (checkedKeys[i] == item.Code) {
		    				//跳过本次选好，不保存父级ID
		    				continue;
		    			}
		    			
		    			//循环未跳过，则当前ID为子级ID,保存子级ID
	    				if (authorizeKeys.indexOf(checkedKeys[i]) == -1) {
    						authorizeKeys.push(checkedKeys[i]);
    					};
		    		}
		    	}
		    	
		    	var params = {
	    			UserID:that.curUserID,
					Codes:authorizeKeys
		    	}
		    	
				Svc.fnPostData('/api/sysmanage/usermanuf',params,function(res){
	            	if (res.body.ErrCode == 0){
						//隐藏工艺授权页面
						that.authorizeFormVisible = false;
	            		that.openMessage("工艺授权成功！","success")
	            	} else {
	            		that.openMessage(res.body.ErrMsg,'error')
	            	}
	            })
		    }
		},
		mounted() {
			//用户列表
			this.fnGetUsers()
			//角色列表
			this.fnGetRoles()
			//工艺列表
			this.fnGetManufacture()
		}
	}
</script>

<style scoped>
	.toolbar {
	    background: #f2f2f2;
	    padding: 10px;
	    margin: 10px 0;
	}
	
	.alert-style{
	    font-size: 15px;
    	margin-top: 10px;
	}
	
	.err-msg{
		font-size: 13px;
	    color: red;
	    text-align: center;
	    padding-bottom: 10px;
	    letter-spacing: 1px;
	}
</style>