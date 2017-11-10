<template>
	<el-form :model="loginForm" :rules="loginRules" ref="loginForm" label-position="left" label-width="0px" class="login-container">
	    <h3 class="title">登录Darling体验中心管理系统</h3>
	    <el-form-item prop="EmployeeID">
	      	<el-input type="text" v-model="loginForm.EmployeeID" auto-complete="off" placeholder="工号"></el-input>
	    </el-form-item>
	    <el-form-item prop="Password">
	      	<el-input type="password" v-model="loginForm.Password" auto-complete="off" placeholder="密码"></el-input>
	    </el-form-item>
	    <el-checkbox v-model="rembAccount" checked class="remember" @click.native.prevent="fnRembAccount">记住密码</el-checkbox>
	    <el-form-item style="width:100%;">
	      	<el-button type="primary" style="width:100%;" @click.native.prevent="fnBtnLogin" :loading="logining">登录</el-button>
	    </el-form-item>
	</el-form>
</template>

<script>
  	import Svc from '../service/index.js'
  	export default {
	    data() {
	      return {
	        logining: false,
	        loginForm: {
	          EmployeeID: '',
	          Password: ''
	        },
	        loginRules: {
	          EmployeeID: [
	            { required: true, message: '请输入员工账号', trigger: 'blur' }
	          ],
	          Password: [
	            { required: true, message: '请输入密码', trigger: 'blur' }
	          ]
	        },
	        //记住账号
	        rembAccount : true
	      };
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
			//记住密码
			fnRembAccount : function(){
				this.rembAccount = !this.rembAccount
			},
			//登录
		    fnBtnLogin(){
		    	var that = this
		        that.$refs.loginForm.validate((valid) => {
		          if (valid) {
			            that.logining = true;
			            that.$router.push({ path: '/member' });
			            //请求登录操作
//			            Svc.fnPostData('/api/account/login', that.loginForm,function(res){
//			            	if (res.body.ErrCode == 0){
//			            		//记住账号
//			            		if (that.rembAccount) {
//			            			localStorage.setItem('rembAccount',that.loginForm.EmployeeID);
//			            		} else {
//			            			localStorage.setItem('rembAccount','');
//			            		}
//			            		//登录成功后跳转并保存用户信息
//			            		sessionStorage.setItem('user', JSON.stringify(res.body.Data));
//			                	that.$router.push({ path: '/mealmanagement' });
//			            	} else {
//			            		that.openMessage(res.body.ErrMsg,'error')
//			            	}
//			            },function(res){
//			            	that.openMessage("网络错误，请重新！",'error')
//			            })
		          	} else {
			          	that.openMessage("账号及密码必须填写！",'error')
			            return false;
			        }
		        });
		    }
	    },
		mounted() {
			//记住密码是否勾选
			var employeeID = localStorage.getItem('rembAccount')
			if (employeeID) {
				this.rembAccount = true
				this.loginForm.EmployeeID = employeeID
			} else {
				this.rembAccount = false
			}
		}
	}

</script>

<style scoped>
    .login-container {
	    -webkit-border-radius: 5px;
	    border-radius: 5px;
	    -moz-border-radius: 5px;
	    background-clip: padding-box;
	    margin: 10% auto;
	    width: 350px;
	    padding: 35px 35px 15px 35px;
	    background: #fff;
	    border: 1px solid #eaeaea;
	    box-shadow: 0 0 25px #cac6c6;
    }
  
	.login-container .title {
	   margin: 0px auto 40px auto;
	   text-align: center;
	   color: #505458;
	}
	.login-container .remember {
	   margin: 0px 0px 35px 0px;
	}
</style>