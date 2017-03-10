<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.mac" placeholder="MAC"></el-input>
				</el-form-item>
				<el-form-item>
						<el-date-picker type="datetime" format="yyyy-MM-dd HH:mm:ss" placeholder="起始时间" v-model="filters.datetime"></el-date-picker>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getLogs">查询</el-button>
				</el-form-item>
				<!--el-form-item>
					<el-button type="primary" @click="handleAdd">新增</el-button>
				</el-form-item-->
			</el-form>
		</el-col>

		<!--列表-->
		<template>
			<el-table :data="logs" border highlight-current-row v-loading="listLoading" style="width: 100%;">
				<!--el-table-column type="index" width="60">
				</el-table-column-->
				<el-table-column prop="devid" label="设备ID号码" width="180" sortable>
				</el-table-column>
				<el-table-column prop="time" label="时间" width="200" sortable>
				</el-table-column>
				<el-table-column prop="content" label="内容" min-width="300">
				</el-table-column>
			</el-table>
		</template>

	<!--分页-->
	<el-col :span="24" class="toolbar" style="padding-bottom:10px;">
		<el-pagination layout="total, sizes, prev, pager, next, jumper" @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-size="pageSize" :total="total" style="float:right;">
		</el-pagination>
	</el-col>

</section>
</template>

<script>
	import util from '../../common/util'
	import NProgress from 'nprogress'
	import { getAccessToken, getLogcatList } from '../../api/api';

	export default {
		data() {
			return {
				filters: {
          mac: '',
					datetime: ''
				},
				logs: [],
				total: 0,
				page: 1,
				pageSize: 20,
				listLoading: false
			}
		},
		methods: {
			// 是否激活显示描述
			//formatActivated: function(row, column) {
			//	return row.activated === true ? '已激活' : row.activated === false ? '未激活' : '未知状态';
			//},

			handleCurrentChange(val) {
				this.page = val;
				this.getLogs();
			},

			handleSizeChange(val) {
				this.pageSize = val;
				this.getLogs();
			},

			// 获取设备列表
			getLogs() {
				let param = {
					page: this.page,
					page_size : this.pageSize,
					mac: this.filters.mac,
					begintime: this.filters.datetime
				};
				console.log("getLogs start: " + this.filters.datetime);
				this.listLoading = true;
				NProgress.start();
				getLogcatList(param, getAccessToken()).then((res) => {
					console.log("getLogs total:"+res.data.total);
					this.total = res.data.total;
					this.logs = res.data.logs;
					this.listLoading = false;
					NProgress.done();
				});
			},
    },
		mounted() {
			this.getLogs();
		}
	}
</script>

<style scoped>
</style>
