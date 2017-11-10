<template>
	<section>
		<!--Alert提示框-->
        <el-alert type="warning" class="alert-style" v-show="hasAlert" @close="fnAlertClose">{{alertMsg}}</el-alert>
		
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom:0px;height: 56px;">
			<el-form :inline="true" :model="filters">
				<!--<el-form-item>
					<el-input v-model="filters.name" placeholder="操作名"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary">查询</el-button>
				</el-form-item>-->
				<el-form-item>
					<el-button type="warning" @click="handleAdd">新增资源</el-button>
				</el-form-item>
			</el-form>
		</el-col>
		
		<!--列表-->
		 <el-table :data="actions" border style="width: 100%" v-loading="actionsLoading" element-loading-text="拼命加载中">
		 	<el-table-column prop="Name" label="操作名称" width="160">
			</el-table-column>
			<el-table-column prop="URLPath" label="操作URL" width="200">
			</el-table-column>
			<el-table-column prop="Method" label="请求方式" width="100">
			</el-table-column>
			<el-table-column prop="Remark" label="操作描述" width="273">
			</el-table-column>
			<el-table-column prop="CreatedTime" label="创建时间" :formatter="fnDateFormat" width="180">
			</el-table-column>
			<el-table-column prop="Createdby" label="创建者" width="100">
			</el-table-column>
			<el-table-column label="操作" width="65">
				<template scope="scope">
					<!--<el-tooltip class="item" effect="dark" content="编辑操作" placement="bottom">
				      	<el-button size="mini" icon="custom-edit" @click="handleAdd"></el-button>
				    </el-tooltip>-->
				    <el-tooltip class="item" effect="dark" content="删除操作" placement="bottom">
				      	<el-button type="danger" size="mini" icon="custom-delete"  @click="fnDelAction(scope.row.ID)"></el-button>
				    </el-tooltip>
				</template>
			</el-table-column>
		</el-table>
		
		<!--工具条-->
		<!--<el-col :span="24" class="toolbar">
			<el-pagination layout="prev, pager, next" :page-size="10" :total="total" style="float:right;">
			</el-pagination>
		</el-col>-->
		
		<!--新增资源界面-->
		<el-dialog title="新增资源" v-model="addFormVisible" :close-on-click-modal="false">
			<el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
				<el-form-item label="资源名称" prop="name">
					<el-input v-model="addForm.name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="资源URL" prop="urlpath">
					<el-input v-model="addForm.urlpath" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="请求方式" prop="method">
					<el-input v-model="addForm.method" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="资源描述">
				    <el-input type="textarea" rows="5" v-model="addForm.remark" auto-complete="off"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="fnAddAction">提交</el-button>
			</div>
		</el-dialog>
		
	</section>
</template>

<script>
	import Svc from '../../service/index.js'
	export default {
		data() {
			return {
//				filters: {
//					name: ''
//				},
				alertMsg:'',
				hasAlert:false,
				actionsLoading:false,
				actions: [],
//				total: 20,
				addFormVisible: false,//新增资源界面是否显示
				addFormRules: {
					name: [
						{ required: true, message: '请输入资源名称', trigger: 'blur' }
					],
					urlpath: [
						{ required: true, message: '请输入资源URL', trigger: 'blur' }
					],
					method: [
						{ required: true, message: '请输入请求方式', trigger: 'blur' }
					]
				},
				//新增界面数据
				addForm: {
					name:'',
					urlpath:'',
					method:'',
					remark:''
				},
				actionFormVisible: false //分配角色界面是否显示
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
            openMessage : function(msg){
    	        this.$message({
		          	showClose: true,
		          	message: msg,
		          	type: 'error'
		        });
            },
            //获取资源列表
			fnGetActions : function() {
				var that = this
				that.actionsLoading = true
				//获取已存在的资源
	            Svc.fnGetData('/api/sysmanage/actions',{},function(res){
	            	if (res.body.ErrCode == 0){
	            		that.actions = res.body.Data
	            		that.actionsLoading = false
	            	} else {
	            		that.alertMsg = "资源列表获取失败！"
	            		that.hasAlert = true
	            	}
	            },function(res){
	            	that.alertMsg = "网络错误，请重新！"
	            	that.hasAlert = true
	            })
			},
			//显示新增资源界面
			handleAdd: function () {
				this.addFormVisible = true;
			},
			//新增资源
			fnAddAction : function(){
				var that = this
				//新增资源
				that.$refs.addForm.validate((valid) => {
					if (valid) {
			            Svc.fnPostData('/api/sysmanage/createaction',that.addForm,function(res){
			            	if (res.body.ErrCode == 0){
			            		that.addFormVisible = false
			            		setTimeout(function () {
				         			//刷新当前组件
		            				that.$router.go(0)
					          	},1500);
			            	} else {
			            		that.openMessage(res.body.ErrMsg)
			            	}
			            },function(res){
			            	that.alertMsg = "网络错误，请重新！"
			            	that.hasAlert = true
			            })
			        }
				});
			},
			//删除资源
			fnDelAction : function(actionID) {
		   		var that = this
				that.$confirm('确认要删除此条操作吗?', '提示', {
					type: 'warning'
				}).then(function(){
					Svc.fnPostData('/api/sysmanage/delaction',{"ActionID":actionID},function(res){
						if (res.body.ErrCode == 0) {
							setTimeout(function () {
			         			//刷新当前组件
	            				that.$router.go(0)
				          	},1500);
						} else {
							that.openMessage(res.body.ErrMsg)
						}
					})
				});
			}
		},
		mounted() {
			//资源列表
			this.fnGetActions()
		}
	}

</script>

<style scoped>
	.toolbar {
	    background: #f2f2f2;
	    padding: 10px 10px 0 10px;
	    margin: 10px 0;
	}
</style>