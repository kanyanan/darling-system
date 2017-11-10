<template>
	<el-form :model="passwordForm" :rules="passwordRules" ref="passwordForm" label-width="100px" class="psw-reset">
	  	<el-form-item label="旧密码" prop="oldPassword">
	    	<el-input type="password" v-model="passwordForm.oldPassword" auto-complete="off"></el-input>
	  	</el-form-item>
	  	<el-form-item label="新密码" prop="newPassword">
	    	<el-input type="password" v-model="passwordForm.newPassword" auto-complete="off"></el-input>
	  	</el-form-item>
	  	<el-form-item label="确认密码" prop="checkPassword">
	    	<el-input type="password" v-model="passwordForm.checkPassword" auto-complete="off"></el-input>
	  	</el-form-item>
	  	<el-form-item>
	    	<el-button type="primary" @click="fnModifyPwd">确认修改</el-button>
	  	</el-form-item>
	</el-form>
</template>

<script>
    import Svc from '../../service/index.js'
	export default {
		data() {
			//比较旧密码跟新密码是否相同
	      	var checkOldNewPwd = (rule, value, callback) => {
	        	if (value === '') {
          			callback(new Error('请输入新密码!'));
        		} else if (value === this.passwordForm.oldPassword) {
	          		callback(new Error('旧密码与新密码不能相同!'));
	        	} else {
	          		callback();
	        	}
	      	};
	      	
			//比较新密码跟确认密码是否相同
	      	var checkPwd = (rule, value, callback) => {
	        	if (value === '') {
          			callback(new Error('请再次输入新密码!'));
        		} else if (value !== this.passwordForm.newPassword) {
	          		callback(new Error('两次输入密码不一致!'));
	        	} else {
	          		callback();
	        	}
	      	};
      
			return {
				passwordRules: {
					oldPassword: [
						{ required: true, message: '请输入旧密码!', trigger: 'blur' }
					],
					newPassword: [
						{ required: true, validator: checkOldNewPwd,  trigger: 'blur' }
					],
					checkPassword: [
						{ required: true, validator: checkPwd, trigger: 'blur' }
					]
				},
				//密码数据
				passwordForm:{
					oldPassword :'',
					newPassword :'',
					checkPassword :''
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
		    //确认修改
		    fnModifyPwd : function(){
		    	var that = this
		    	var params = {
		    		 OldPwd:that.passwordForm.oldPassword,
		    		 NewPwd:that.passwordForm.newPassword
		    	}
				
				that.$refs.passwordForm.validate((valid) => {
					if (valid) {
						Svc.fnPostData('/api/account/changepwd',params,function(res){
			            	if (res.body.ErrCode == 0){
			            		that.openMessage("密码修改成功！","success")
			            	} else {
			            		that.openMessage("密码修改失败！",'error')
			            	}
			            })
					} else {
		            	return false
		          }
				});
		    }
		}
	}

</script>

<style scoped>
	.psw-reset{
		margin:20px;
		width:40%;
		min-width:500px;
	}
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