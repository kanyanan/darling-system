<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;height: 56px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.agentName" placeholder="代理名称"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="">查询</el-button>
				</el-form-item>
			</el-form>
		</el-col>
		
		<!--代理列表-->
		<el-table :data="agents" border v-loading="agentsLoading" class="agent-list">
			<el-table-column type="index" width="60">
			</el-table-column>
			<el-table-column prop="Applicant" label="代理ID" min-width="140">
			</el-table-column>
			<el-table-column prop="VisitorDept" label="代理姓名" min-width="140">
			</el-table-column>
			<el-table-column prop="VisitorDept" label="单位名称" min-width="140">
			</el-table-column>
			<el-table-column prop="VisitorNames" label="返点比例" min-width="100">
			</el-table-column>
			<el-table-column prop="VisitorLevel" label="电话" min-width="100">
			</el-table-column>
			<el-table-column prop="VisitorNum" label="微信" min-width="100">
			</el-table-column>
			<el-table-column prop="VisitorNum" label="地址" min-width="200">
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-pagination layout="total, prev, pager, next" @current-change="fnPaginationChange" :page-size="size" :total="total" style="float:right;">
			</el-pagination>
		</el-col>
	</section>
</template>

<script>
	export default {
		data() {
			return {
				filters:{
					agentName:''
				},
				total:0,
				skip:0,
				size:20,
				agents:[],
				agentsLoading:false
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
            //分页
			fnPaginationChange(val) {
				this.skip = val-1;
				//this.fnGetMyApplys();
			}
		},
		mounted() {}
	}
</script>

<style scoped>
	.agent-list{
		width: 100%;
		margin-top: 20px;
	}

	.toolbar {
	    background: #f2f2f2;
	    padding: 10px;
	    margin: 10px 0;
	}
</style>