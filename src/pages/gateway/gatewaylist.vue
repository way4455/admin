<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.mac" placeholder="MAC"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getDevices">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="handleAdd">新增</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<template>
			<el-table :data="devices" border highlight-current-row v-loading="listLoading" style="width: 100%;">
				<!--el-table-column type="index" width="60">
				</el-table-column-->
				<el-table-column prop="mac" label="网关设备地址" min-width="170" sortable>
				</el-table-column>
				<el-table-column prop="id" label="网关ID号码" min-width="140" sortable>
				</el-table-column>
				<el-table-column prop="name" label="网关名称" min-width="140" sortable>
				</el-table-column>
				<el-table-column prop="activated" label="是否激活" :formatter="formatActivated" min-width="120" sortable>
				</el-table-column>
				<el-table-column prop="activated_at" label="激活时间" min-width="180" sortable>
				</el-table-column>
				<el-table-column prop="online" label="在线状态" :formatter="formatOnlineState" min-width="120" sortable>
				</el-table-column>
				<el-table-column inline-template :context="_self" label="操作" min-width="160">
					<span>
									<el-button size="small" @click="handleEdit(row)">编辑</el-button>
									<el-button type="danger" size="small" @click="handleDel(row)">删除</el-button>
								</span>
				</el-table-column>
			</el-table>
		</template>

	<!--分页-->
	<el-col :span="24" class="toolbar" style="padding-bottom:10px;">
		<el-pagination layout="total, sizes, prev, pager, next, jumper" @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-size="pageSize" :total="total" style="float:right;">
		</el-pagination>
	</el-col>

	<!--编辑界面-->
	<el-dialog :title="editFormTitle" size="tiny" v-model="editFormVisible" :close-on-click-modal="false">
		<el-form :model="editForm" label-width="100px" :rules="editFormRules" ref="editForm">
			<el-form-item label="MAC地址" prop="mac">
				<el-input v-model="editForm.mac" auto-complete="off" placeholder="请输入MAC地址" :disabled="isMacReadOnly"></el-input>
			</el-form-item>
			<el-form-item label="网关名称" prop="name">
				<el-input v-model="editForm.name" auto-complete="off" placeholder="请输入网关名称"></el-input>
			</el-form-item>
			<!--el-form-item label="性别">
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
			</el-form-item-->
		</el-form>
		<div slot="footer" class="dialog-footer">
			<el-button @click.native="editFormVisible = false">取 消</el-button>
			<el-button type="primary" @click.native="editSubmit" :loading="editLoading">{{btnEditText}}</el-button>
		</div>
	</el-dialog>
</section>
</template>

<script>
	import util from '../../common/util'
	import NProgress from 'nprogress'
	import { getAccessToken, getGateWayList, addGateWayDevice, delGateWayDevice, updateGateWayDevice } from '../../api/api';
	import { checkTokenInvliad, constErrorProcess } from '../../err/err.js';

	export default {
		data() {
			return {
				filters: {
					mac: '',
					name: ''
				},
				users: [],
				devices: [],
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
			//性别显示转换
			formatSex: function (row, column) {
				return row.sex == 1 ? '男' : row.sex == 0 ? '女' : '未知';
			},

			// 是否激活显示描述
			formatActivated: function(row, column) {
				return row.activated === true ? '已激活' : row.activated === false ? '未激活' : '未知状态';
			},

			// 是否在线状态
			formatOnlineState: function(row, column) {
				return row.online === true ? '在线' : row.online === false ? '离线' : '未知状态';
			},

			handleCurrentChange(val) {
				this.page = val;
				this.getDevices();
			},

			handleSizeChange(val) {
				this.pageSize = val;
				this.getDevices();
			},

			//获取用户列表
			/*getUsers() {
				let para = {
					page: this.page,
					name: this.filters.name
				};
				this.listLoading = true;
				NProgress.start();
				getUserListPage(para).then((res) => {
					this.total = res.data.total;
					this.users = res.data.users;
					this.listLoading = false;
					NProgress.done();
				});
			},*/
			// 获取用户信息
			/*getAccessToken() {
				var user = sessionStorage.getItem('user');
				if (user) {
					user = JSON.parse(user);
					let ret = '{"Content-Type":"application/json", "Access-Token":"' + user.access_token + '"}';
					console.log('ret='+ret);
					return JSON.parse(ret);
				}
				let ret = '{"Content-Type":"application/json", "Access-Token":""}';
				return JSON.parse(ret);
			},*/
			// 获取设备列表
			getDevices() {
				let param = {
					page: this.page,
					page_size : this.pageSize,
					mac: this.filters.mac
				};
				console.log("getDevices start.");
				this.listLoading = true;
				NProgress.start();
				getGateWayList(param, /*this.*/getAccessToken()).then((res) => {
					console.log("getDevices total:"+res.data.total);
					this.total = res.data.total;
					this.devices = res.data.devices;
					this.listLoading = false;
					NProgress.done();
				}).catch(err => {
					this.logining = false;
                	NProgress.done();
					var errcode = err.response.data.error.code;
					constErrorProcess(errcode, this);
				});
			},
			//删除
			handleDel: function (row) {
				//console.log(row);
				var _this = this;
				this.$confirm('确认删除该记录吗?', '提示', {
					//type: 'warning'
				}).then(() => {
					_this.listLoading = true;
					NProgress.start();
					let para = {
						id: row.id,
						mac: row.mac,
						name: row.name
					};
					delGateWayDevice(para, getAccessToken()).then((res) => {
						_this.listLoading = false;
						NProgress.done();
						_this.$notify({
							title: '成功',
							message: '删除成功',
							type: 'success'
						});
						_this.getDevices();
					}).catch(err => {
						this.logining = false;
						NProgress.done();
						var errcode = err.response.data.error.code;
						constErrorProcess(errcode, this);
					});

				}).catch(() => {

				});
			},
			//显示编辑界面
			handleEdit: function (row) {
				this.isMacReadOnly = true;
				this.editFormVisible = true;
				this.editFormTitle = '编辑';
				this.editForm.id = row.id;
				this.editForm.mac = row.mac;
				this.editForm.name = row.name;
				//this.editForm.sex = row.sex;
				//this.editForm.age = row.age;
				//this.editForm.birth = row.birth;
				//this.editForm.addr = row.addr;
			},
			//编辑 or 新增
			editSubmit: function () {
				var _this = this;

				_this.$refs.editForm.validate((valid) => {
					if (valid) {

						_this.$confirm('确认提交吗？', '提示', {}).then(() => {
							_this.editLoading = true;
							NProgress.start();
							_this.btnEditText = '提交中';

							if (_this.editForm.id == 0) {
								//新增
								let para = {
									id: 0,
									mac: _this.editForm.mac,
									name: _this.editForm.name
								};
								addGateWayDevice(para, getAccessToken()).then((res) => {
									_this.editLoading = false;
									NProgress.done();
									_this.btnEditText = '提 交';

									let {ret, msg} = res;
									_this.$notify({
										title: ret===0 ? '成功' : '失败',
										message: msg,
										type: ret===0 ? 'success' : 'error'
									});
									_this.editFormVisible = false;
									_this.getDevices();
								}).catch(err => {
									this.logining = false;
									NProgress.done();
									var errcode = err.response.data.error.code;
									constErrorProcess(errcode, this);
								});
							} else {
								//编辑
								let para = {
									//id: _this.editForm.id,
									mac: _this.editForm.mac,
									name: _this.editForm.name//,
									//sex: _this.editForm.sex,
									//age: _this.editForm.age,
									//birth: _this.editForm.birth == '' ? '' : util.formatDate.format(new Date(_this.editForm.birth), 'yyyy-MM-dd'),
									//addr: _this.editForm.addr,
								};
								updateGateWayDevice(para, getAccessToken()).then((res) => {
									_this.editLoading = false;
									NProgress.done();
									_this.btnEditText = '提 交';
									_this.$notify({
										title: '成功',
										message: '提交成功',
										type: 'success'
									});
									_this.editFormVisible = false;
									_this.getDevices();
								}).catch(err => {
									this.logining = false;
									NProgress.done();
									var errcode = err.response.data.error.code;
									constErrorProcess(errcode, this);
								});

							}

						});

					}
				});

			},
			//显示新增界面
			handleAdd: function () {
				var _this = this;

				this.isMacReadOnly = false;
				this.editFormVisible = true;
				this.editFormTitle = '添加设备';

				this.editForm.id = 0;
				this.editForm.name = '';
				this.editForm.sex = 1;
				this.editForm.age = 0;
				this.editForm.birth = '';
				this.editForm.addr = '';
			}
		},
		mounted() {
			this.getDevices();
		}
	}
</script>

<style scoped>
</style>
