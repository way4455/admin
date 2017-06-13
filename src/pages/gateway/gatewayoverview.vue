<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-button type="primary" v-on:click="getOverView">刷新</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<template>
			<el-table :data="overviewinfo" border highlight-current-row v-loading="listLoading" style="width: 100%;">
				<!--el-table-column type="index" width="60">
				</el-table-column-->
				<el-table-column prop="total_devices" label="总设备数量" min-width="130">
				</el-table-column>
				<el-table-column prop="activated_devices" label="激活数" min-width="130">
				</el-table-column>
				<el-table-column prop="online_devices" label="当前在线" min-width="130">
				</el-table-column>
				<el-table-column prop="total_users" label="用户数" min-width="130">
				</el-table-column>
			</el-table>
		</template>

</section>
</template>

<script>
	import util from '../../common/util'
	import NProgress from 'nprogress'
	import { getAccessToken, getOverViewDetails } from '../../api/api';

	export default {
		data() {
			return {
				listLoading: false,
				total_devices: 0,
				activated_devices: 0,
				online_devices: 0,
				total_users: 0,
				overviewinfo:[]
			}
		},
		methods: {
			getOverView() {
				let param = {
				};
				console.log("Get over view start.");
				this.listLoading = true;
				NProgress.start();
				getOverViewDetails(param, getAccessToken()).then((res) => {
					this.devices = res.data;
					//this.total_devices = res.data.total_devices;
					//this.activated_devices = res.data.activated_devices;
					//this.online_devices = res.data.activated_devices;
					//this.total_users = res.data.activated_devices;
					this.overviewinfo = res.data;
					this.listLoading = false;
					NProgress.done();
				});
			}
		},
		mounted() {
			this.getOverView();
		}
	}
</script>

<style scoped>
</style>
