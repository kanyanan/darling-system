<template>
	<section>
		<!--Alert提示框-->
        <el-alert type="warning" class="alert-style" v-show="hasAlert" @close="fnAlertClose">{{alertMsg}}</el-alert>
		
		<!--列表-->
		<tree-table :columns="columns" :tree-structure="true" :data-source="dataSource" :tree-type="false" class="m-t-12" v-loading="menusLoading" element-loading-text="拼命加载中"></tree-table>
	</section>
</template>

<script>
	import Svc from '../../service/index.js'
	import TreeTable from '../components/treeTable'
	export default {
		data() {
			return {
				menusLoading:false,
			    columns: [
			          {
			            text: '菜单名',
			            dataIndex: 'Title'
			          },
			          {
			            text: '图标',
			            dataIndex: 'Icon'
			          },
			          {
			            text: '跳转地址',
			            dataIndex: 'Link'
			          }
			        ],
			    dataSource: [],
				alertMsg:'',
				hasAlert:false
		    }  
		},
		components:{
			TreeTable
		},
		methods:{
            //关闭alert
            fnAlertClose : function(){
            	this.hasAlert = false
            },
            //获取菜单
			fnGetMenus : function() {
				var that = this
				that.menusLoading = true
				//获取菜单
	            Svc.fnGetData('/api/sysmanage/menus',{},function(res){
	            	if (res.body.ErrCode == 0){
	            		var data = res.body.Data || []
	            		for (var i = 0; i < data.length; i++) {
	            			data[i].Items = data[i].SubMenus
	            			delete data[i].SubMenus
	            		}
	            		that.dataSource = data
	            		that.menusLoading = false
	            	} else {
	            		that.alertMsg = "菜单列表获取失败！"
	            		that.hasAlert = true
	            	}
	            },function(res){
	            	that.alertMsg = "网络错误，请重新！"
	            	that.hasAlert = true
	            })
			}
		},
		mounted() {
			//菜单列表
			this.fnGetMenus()
		}
	}

</script>

<style scoped>
	.m-t-12{
		margin-top: 12px;
	}
</style>