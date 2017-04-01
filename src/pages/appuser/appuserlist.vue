<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.tel" placeholder="用户手机号码"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getAppUsers">查询</el-button>
				</el-form-item>
				<!--el-form-item>
					<el-button type="primary" @click="handleAdd">新增</el-button>
				</el-form-item-->
			</el-form>
		</el-col>

		<!--列表-->
		<template>
			<el-table :data="users" border highlight-current-row v-loading="listLoading" style="width: 100%;">
				<!--el-table-column type="index" width="60">
				</el-table-column-->
				<el-table-column prop="tel" label="手机登录号码" width="180" sortable>
				</el-table-column>
				<el-table-column prop="id" label="用户ID号码" width="180" sortable>
				</el-table-column>
				<el-table-column prop="nick" label="用户昵称" width="200" sortable>
				</el-table-column>
				<el-table-column prop="enable" label="是否激活" :formatter="formatActivated" width="120" sortable>
				</el-table-column>
				<el-table-column prop="register_at" label="注册时间" min-width="160" sortable>
				</el-table-column>
				<el-table-column prop="online" label="在线状态" :formatter="formatOnlineState" min-width="100" sortable>
				</el-table-column>
				<!--el-table-column inline-template :context="_self" label="操作" width="150">
					<span>
									<el-button size="small" @click="handleEdit(row)">编辑</el-button>
									<el-button type="danger" size="small" @click="handleDel(row)">删除</el-button>
								</span>
				</el-table-column-->
			</el-table>
		</template>

	<!--分页-->
	<el-col :span="24" class="toolbar" style="padding-bottom:10px;">
		<el-pagination layout="total, sizes, prev, pager, next, jumper" @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-size="pageSize" :total="total" style="float:right;">
		</el-pagination>
	</el-col>

	<!--编辑界面-->
	<!--el-dialog :title="editFormTitle" size="tiny" v-model="editFormVisible" :close-on-click-modal="false">
		<el-form :model="editForm" label-width="100px" :rules="editFormRules" ref="editForm">
			<el-form-item label="MAC地址" prop="mac">
				<el-input v-model="editForm.mac" auto-complete="off" placeholder="请输入MAC地址" :disabled="isMacReadOnly"></el-input>
			</el-form-item>
			<el-form-item label="网关名称" prop="name">
				<el-input v-model="editForm.name" auto-complete="off" placeholder="请输入网关名称"></el-input>
			</el-form-item>
			<el-form-item label="性别">
				<el-radio-group v-model="editForm.sex">
					<el-radio class="radio" :label="1">男</el-radio>
					<el-radio class="radio" :label="0">女</el-radio>
				</el-radio-group>
			</el-form-item>
			<el-form-item label="年龄">
				<el-input-number v-model="editForm.age" :min="0" :max="200"></el-input-number>
			</el-form-item>
			<el-form-item label="生日">
				<el-date-picker type="date" placeholder="选择日期" v-model="editForm.birth"></el-date-picker>
			</el-form-item>
			<el-form-item label="地址">
				<el-input type="textarea" v-model="editForm.addr"></el-input>
			</el-form-item>
		</el-form>
		<div slot="footer" class="dialog-footer">
			<el-button @click.native="editFormVisible = false">取 消</el-button>
			<el-button type="primary" @click.native="editSubmit" :loading="editLoading">{{btnEditText}}</el-button>
		</div>
	</el-dialog-->
</section>
</template>

<script>
	import util from '../../common/util'
	import NProgress from 'nprogress'
	import { getAccessToken, getAppUserList } from '../../api/api';

	export default {
		data() {
			return {
				filters: {
					tel: '',
					nick: ''
				},
				users: [],
				total: 0,
				page: 1,
				pageSize: 20,
				listLoading: false,
				editFormVisible: false,//编辑界面显是否显示
				editFormTitle: '编辑',//编辑界面标题
				isMacReadOnly: false,
				//编辑界面数据
				editForm: {
					id: 0,
					mac: ''//,
					//sex: -1,
					//age: 0,
					//birth: '',
					//addr: ''
				},
				editLoading: false,
				btnEditText: '提 交',
				editFormRules: {
					mac: [
						{ required: true, message: '请输入MAC地址,如0c00203a01', trigger: 'blur' }
					],
					name: [
						{ required: true, message: '请输入网关名称', trigger: 'blur' }
					]
				}

			}
		},
		methods: {
			// 是否激活显示描述
			formatActivated: function(row, column) {
				return row.enable === true ? '已激活' : row.enable === false ? '未激活' : '未知状态';
			},

			// 是否在线状态
			formatOnlineState: function(row, column) {
				return row.online === true ? '在线' : row.online === false ? '离线' : '未知状态';
			},

			handleCurrentChange(val) {
				this.page = val;
				this.getAppUsers();
			},

			handleSizeChange(val) {
				this.pageSize = val;
				this.getAppUsers();
			},

			//获取用户列表
			getAppUsers() {
				let param = {
					page: this.page,
					page_size : this.pageSize,
					tel: this.filters.tel
				};
				console.log("getAppUsers start.");
				this.listLoading = true;
				NProgress.start();
				getAppUserList(param, getAccessToken()).then((res) => {
					console.log("getAppUserList total:"+res.data.total);
					this.total = res.data.total;
					this.users = res.data.users;
					this.listLoading = false;
					NProgress.done();
				});
			},
		},
		mounted() {
			this.getAppUsers();
		}
	}
</script>

<style scoped>
</style>
