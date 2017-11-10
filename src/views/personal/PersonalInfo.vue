<template>
	<el-form ref="personalInfoForm" :model="personalInfoForm" label-width="80px" class="personal-info">
	  	<el-form-item label="账号">
	    	<el-input v-model="personalInfoForm.Account" :disabled="true"></el-input>
	  	</el-form-item>
	  	<el-form-item label="姓名">
	    	<el-input v-model="personalInfoForm.Name"></el-input>
	  	</el-form-item>
	  	<el-form-item label="职务">
	    	<el-input v-model="personalInfoForm.Title"></el-input>
	  	</el-form-item>
	  	<el-form-item label="性别">
			<el-radio-group v-model="personalInfoForm.Gender">
				<el-radio class="radio" label="M">男性</el-radio>
				<el-radio class="radio" label="F">女性</el-radio>
			</el-radio-group>
		</el-form-item>
	  	<el-form-item label="电话">
	    	<el-input v-model="personalInfoForm.Mobile"></el-input>
	  	</el-form-item>
	  	<el-form-item label="邮件">
	    	<el-input v-model="personalInfoForm.Email"></el-input>
	  	</el-form-item>
	  	<el-form-item>
	    	<el-button type="primary" @click.native="fnUpdateUser">保存更新</el-button>
	  	</el-form-item>
	</el-form>
</template>

<script>
    import Svc from '../../service/index.js'
	export default {
		data() {
			return {
				alertMsg:'',
				hasAlert:false,
				//用户信息数据
				personalInfoForm: {
					Account:'',
					Name: '',
					Title:'',
					Gender: "M",
					Mobile:'',
					Email:''
				}
			}
		},
		methods: {
            //显示message提示框
            openMessage : function(msg,type){
    	        this.$message({
		          	showClose: true,
		          	message: msg,
		          	type: type
		        });
            },
			//获取当前用户信息
			fnGetCurUserInfo : function() {
				var that = this
	            Svc.fnGetData('/api/account/detail',{},function(res){
	            	if (res.body.ErrCode == 0){
	            		that.personalInfoForm = res.body.Data
	            	} else {
	            		that.alertMsg = "用户信息获取失败！"
	            		that.hasAlert = true
	            	}
	            },function(res){
	            	that.alertMsg = "网络错误，请重新！"
	            	that.hasAlert = true
	            })
			},
			//保存更新
			fnUpdateUser : function() {
				var that = this
				var params = {
					Name: that.personalInfoForm.Name,
					Title:that.personalInfoForm.Title,
					Gender: that.personalInfoForm.Gender,
					Mobile:that.personalInfoForm.Mobile,
					Email:that.personalInfoForm.Email
				}
				
	            Svc.fnPostData('/api/account/editprofile',params,function(res){
	            	if (res.body.ErrCode == 0){
	            		that.openMessage('个人信息更新成功！','success')
	            	} else {
	            		that.openMessage(res.body.ErrMsg,'error')
	            	}
	            },function(res){
	            	that.alertMsg = "网络错误，请重新！"
	            	that.hasAlert = true
	            })
			}
		},
		mounted() {
			//获取当前用户信息
			this.fnGetCurUserInfo()
		}
	}

</script>

<style scoped>
.personal-info{
	margin:20px;
	width:40%;
	min-width:500px;
}
</style>