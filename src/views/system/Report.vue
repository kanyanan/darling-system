<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;height: 56px;">
			<el-form :inline="true" :model="filters">
				<el-form-item label="开始时间">
				    <el-date-picker v-model="filters.startDate" type="date" placeholder="选择开始日期">
					</el-date-picker>
				</el-form-item>
				<el-form-item label="结束时间">
				    <el-date-picker v-model="filters.endDate" type="date" placeholder="选择开始日期">
					</el-date-picker>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="">查询</el-button>
				</el-form-item>
			</el-form>
		</el-col>
		
		<!--报表列表-->
		<el-table :data="members" border v-loading="membersLoading" class="member-list">
			<el-table-column type="index" width="60">
			</el-table-column>
			<el-table-column prop="Applicant" label="会员ID" min-width="140">
			</el-table-column>
			<el-table-column prop="VisitorDept" label="会员姓名" min-width="140">
			</el-table-column>
			<el-table-column prop="VisitorNames" label="生日" min-width="140">
			</el-table-column>
			<el-table-column prop="VisitorLevel" label="电话" min-width="140">
			</el-table-column>
			<el-table-column prop="VisitorNum" label="代理" min-width="150">
			</el-table-column>
			<el-table-column label="消费记录" min-width="80">
				<template slot-scope="scope">
					<el-button size="small" @click="">查看</el-button>
				</template>
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
					startDate : '',
					endDate : ''
				}
			}
		},
		methods: {},
		mounted() {}
	}
</script>

<style scoped>
	.toolbar {
	    background: #f2f2f2;
	    padding: 10px;
	    margin: 10px 0;
	}
</style>