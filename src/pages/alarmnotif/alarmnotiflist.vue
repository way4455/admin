<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-form :inline="true" :model="filters">
				<!--el-form-item>
					<el-input v-model="filters.mac" placeholder="MAC"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getItems">查询</el-button>
				</el-form-item-->
				<el-form-item>
					<el-button type="primary" @click="handleAdd">新增</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<template>
			<el-table :data="items" border highlight-current-row v-loading="listLoading" style="width: 100%;">
				<el-table-column prop="name" label="规则名称" min-width="100" sortable>
				</el-table-column>
				<el-table-column prop="condition_type" label="告警类型" :formatter="formatDataType" min-width="60" sortable>
				</el-table-column>
				<el-table-column prop="alarm_content" label="告警内容" min-width="180" sortable>
				</el-table-column>
				<el-table-column prop="notification_type" label="通知类型" min-width="60" sortable>
				</el-table-column>
				<el-table-column prop="status" width="80" label="状态" :formatter="formatStatus">
				</el-table-column>
				<el-table-column inline-template :context="_self" label="操作" min-width="160">
					<span>
									<el-button size="small" @click="handleEdit(row)">编辑</el-button>
									<!--el-button type="danger" size="small" @click="handleDel(row)">删除</el-button-->
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
		<el-form :model="editForm" label-width="100px" :rules="editFormRules" ref="editForm" >
			<el-form-item label="索引" prop="index" v-if="isUidShow">
				<el-input v-model.number="editForm.uid" auto-complete="off" :disabled="isUidReadOnly"></el-input>
			</el-form-item>
			<el-form-item label="规则名称" prop="name">
				<el-input v-model.number="editForm.name" auto-complete="off" placeholder="请输入规则名称" :disabled="isIdReadOnly"></el-input>
			</el-form-item>
			<el-form-item label="告警条件" prop="condition_type">
				<el-select v-model="editForm.condition_type" >
						<el-option v-for="item in options" :label="item.label" :value="item.value"></el-option>
				</el-select>
				<el-input v-model.number="editForm.condition_option" auto-complete="off" placeholder="请输入规则名称"></el-input>
				<el-select v-model="editForm.condition_operator" >
						<el-option v-for="item in operator_options" :label="item.label" :value="item.value"></el-option>
				</el-select>
				<el-input v-model.number="editForm.condition_value" auto-complete="off" placeholder="请输入规则名称"></el-input>
			</el-form-item>
			<el-form-item label="告警内容" prop="alarm_content">
				<el-input type="textarea" :rows="2" v-model="editForm.alarm_content" placeholder="请输入告警内容"></el-input>
			</el-form-item>
			<el-form-item label="通知类型">
				<el-select v-model="editForm.notification_type" >
						<el-option v-for="item in notification_options" :label="item.label" :value="item.value"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="标签" prop="label">
				<el-input type="textarea" :rows="2" v-model="editForm.label" placeholder="请填写应用标签"></el-input>
			</el-form-item>
			<el-form-item label="通知方式" prop="notification_method">
				<el-checkbox-group v-model="editForm.notification_method">
				 <el-checkbox label="0">短信</el-checkbox>
				 <el-checkbox label="1">邮箱</el-checkbox>
				 <el-checkbox label="2">应用内推送</el-checkbox>
				 <br>
				 <el-checkbox label="3" @change="onApnAppShow">APN推送</el-checkbox>
					 <el-checkbox-group v-model="editForm.apn_apps" v-if="isApnSelectAppsShow">
						<el-checkbox v-for="app in iosapps" :label="app.uid">{{app.name}}</el-checkbox>
					 </el-checkbox-group>
				 <br>

				 <el-checkbox label="4" @change="onGoogleAppShow">Google推送</el-checkbox>
					 <el-checkbox-group v-model="editForm.google_apps" v-if="isGoogleSelectAppsShow">
						<el-checkbox v-for="app in androidapps" :label="app.uid">{{app.name}}</el-checkbox>
					 </el-checkbox-group>
				 <br>
				</el-checkbox-group>
			</el-form-item>
			<el-form-item label="可见范围" prop="visibility">
				<el-radio-group v-model="editForm.visibility">
					<el-radio :label="0">企业可见</el-radio>
					<el-radio :label="1">用户可见</el-radio>
					<el-radio :label="2">全部可见</el-radio>
				</el-radio-group>
			</el-form-item>
			<el-form-item label="状态" prop="status">
				<el-radio-group v-model="editForm.status">
					<el-radio :label="0">禁用</el-radio>
					<el-radio :label="1">启用</el-radio>
				</el-radio-group>
			</el-form-item>
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
	import { getAccessToken, getAlarmNotiList, addAlarmNoti, delAlarmNoti, updateAlarmNoti, getiOSApplicationList, getAndroidApplicationList } from '../../api/api';
	import { checkTokenInvliad, constErrorProcess } from '../../err/err.js';

	export default {
		data() {
			var checkIndex = (rule, value, callback) => {
				if (null==value) {
					return callback(new Error('端点索引不能为空'));
				}
				setTimeout(() => {
					if (!Number.isInteger(value)) {
						callback(new Error('请输入数字值'));
					} else {
						if (value < 0 || value > 128) {
							callback(new Error('数据端点索引大小必须在0到128之间'));
						} else {
							callback();
						}
					}
				}, 1000);
			};
			var checkId = (rule, value, callback) => {
				if (null==value) {
					return callback(new Error('端点ID不能为空'));
				}
				if (value !== this.editForm.index) {
					return callback(new Error('端点ID要与数据索引相同'));
				}
				callback();
			};
			return {
				filters: {
					index: '',
					id: '',
					type: '',
					unit: '',
					desc: ''
				},
				options: [{
				 value: 0,
				 label: '数据端点'
			 }, {
				 value: 1,
				 label: '设备状态'
			 }],
			 notification_options: [{
			 		value: 0,
				  label: '通知类型'
				}, {
					value: 1,
					label: '报警类型'
				}],
				operator_options: [{
 			 		value: 0,
 				  label: '等于'
 				}, {
 					value: 1,
 					label: '大于'
 				}, {
					value: 2,
					label: '小于'
				}, {
					value: 3,
					label: '大于等于'
				}, {
					value: 4,
					label: '小于等于'
				}, {
					value: 5,
					label: '不等于'
				}],
				iosapps: [],
				androidapps: [],
				items: [],
				total: 0,
				page: 1,
				pageSize: 20,
				listLoading: false,
				editFormVisible: false,//编辑界面显是否显示
				editFormTitle: '编辑',//编辑界面标题
				isIndexReadOnly: false,
				isIdReadOnly: false,
				isUidShow: false,
				isUidReadOnly: true,
				isApnSelectAppsShow: false,
				isGoogleSelectAppsShow: false,
				//编辑界面数据
				editForm: {
					editing: false,
					uid: '',
					name: '',
					condition_type: 0,
					condition_option: 0,
					condition_operator: 0,
					condition_value: 0,
					alarm_content: '',
					notification_type: 0,
					label: '',
					notification_method: [],
					apn_apps: [],
					google_apps: [],
					visibility: 0,
					status: 0
				},
				editLoading: false,
				btnEditText: '提 交',
				editFormRules: {
					name: [
						{ required: true, message: '请输入规则名称', trigger: 'blur' }
					],
					//condition_type: [
					//	{ required: true, message: '请选择告警条件', trigger: 'blur' }
					//],
					condition_option: [
						{ required: true, message: '请输入数据端点', trigger: 'blur' }
					],
					condition_value: [
						{ required: true, message: '请输入数据端点', trigger: 'blur' }
					],
					alarm_content: [
						{ required: true, message: '请输入告警内容', trigger: 'blur' }
					]
				}
			}
		},
		methods: {
			//性别显示转换
			formatSex: function (row, column) {
				return row.sex == 1 ? '男' : row.sex == 0 ? '女' : '未知';
			},

			// 格式化数据端点类型
			formatDataType: function(row, column) {
				var typeDesc = "未知类型";
				for (var n=0; n<this.options.length; ++n) {
					var aType = this.options[n];
					if (aType.value === row.condition_type) {
						typeDesc = aType.label;
						break;
					}
				}
				return typeDesc;
			},

			// 是否在线状态
			formatStatus: function(row, column) {
				return row.status === true ? '启用' : row.status === false ? '停用' : '未知状态';
			},

			handleCurrentChange(val) {
				this.page = val;
				this.getItems();
			},

			handleSizeChange(val) {
				this.pageSize = val;
				this.getItems();
			},

			// 显示或者隐藏APN选择APP
			onApnAppShow(val) {
				if (true === this.isApnSelectAppsShow) {
					this.isApnSelectAppsShow = false;
				}
				else {
					this.isApnSelectAppsShow = true;
				}
			},

			// 显示或者隐藏Google选择APP
			onGoogleAppShow(val) {
				if (true === this.isGoogleSelectAppsShow) {
					this.isGoogleSelectAppsShow = false;
				}
				else {
					this.isGoogleSelectAppsShow = true;
				}
			},

			// 获取iOS应用列表
			getiOSApplications() {
				let param = {
					page: 1,
					page_size : 100
				};
				this.listLoading = true;
				NProgress.start();
				getiOSApplicationList(param, getAccessToken()).then((res) => {
					this.iosapps = res.data.applications;
					this.listLoading = false;
					NProgress.done();
				}).catch(err => {
					this.logining = false;
                	NProgress.done();
					var errcode = err.response.data.error.code;
					constErrorProcess(errcode, this);
				});
			},
			// 获取Android应用列表
			getAndroidApplications() {
				let param = {
					page: 1,
					page_size : 100
				};
				this.listLoading = true;
				NProgress.start();
				getAndroidApplicationList(param, getAccessToken()).then((res) => {
					this.androidapps = res.data.applications;
					this.listLoading = false;
					NProgress.done();
				}).catch(err => {
					this.logining = false;
                	NProgress.done();
					var errcode = err.response.data.error.code;
					constErrorProcess(errcode, this);
				});
			},
			// 获取列表
			getItems() {
				let param = {
					page: this.page,
					page_size : this.pageSize
				};
				console.log("getItems start.");
				this.listLoading = true;
				NProgress.start();
				getAlarmNotiList(param, getAccessToken()).then((res) => {
					console.log("getItems total:"+res.data.total);
					this.total = res.data.total;
					this.items = res.data.items;
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
						uid: row.uid
					};
					delAlarmNoti(para, getAccessToken()).then((res) => {
						_this.listLoading = false;
						NProgress.done();
						_this.$notify({
							title: '成功',
							message: '删除成功',
							type: 'success'
						});
						_this.getItems();
					});

				}).catch(err => {
					this.logining = false;
                	NProgress.done();
					var errcode = err.response.data.error.code;
					constErrorProcess(errcode, this);
				})
			},
			mustShowApn() {
				var b = false;
				for (var m=0; m<this.editForm.notification_method.length; ++m) {
					if (this.editForm.notification_method[m] === '3') {
						b = true;
						break;
					}
				}
				return b;
			},
			mustShowGoogle() {
				var b = false;
				for (var m=0; m<this.editForm.notification_method.length; ++m) {
					if (this.editForm.notification_method[m] === '4') {
						b = true;
						break;
					}
				}
				return b;
			},
			method_translate(methods) {
				var str_methods = [];
				for (var n=0; n<methods.length; ++n) {
					str_methods.push(''+methods[n]);
				}
				return str_methods;
			},
			//显示编辑界面
			handleEdit: function (row) {
				this.isIdReadOnly = true;
				this.isIndexReadOnly = true;
				this.editFormVisible = true;
				this.editFormTitle = '编辑规则';
				this.editForm.editing = true;

				this.isUidShow = true;
				this.isUidReadOnly = true;

				this.editForm.uid = row.uid;
				this.editForm.name = row.name;
				this.editForm.condition_type = row.condition_type;
				this.editForm.condition_option = row.condition_option;
				this.editForm.condition_operator = row.condition_operator;
				this.editForm.condition_value = row.condition_value;
				this.editForm.alarm_content = row.alarm_content;
				this.editForm.notification_type = row.notification_type;
				this.editForm.label = row.label;
				this.editForm.notification_method = this.method_translate(row.notification_method);
				this.editForm.apn_apps = row.apnapps;
				this.editForm.google_apps = row.googleapps;
				this.editForm.visibility = row.visibility;
				this.editForm.status = (true===row.status)?1:0;

				this.isApnSelectAppsShow = this.mustShowApn();
				this.isGoogleSelectAppsShow = this.mustShowGoogle();
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

							if (false == _this.editForm.editing) {
								//新增
								let para = {
									uid: _this.editForm.uid,
									name: _this.editForm.name,
									condition_type: _this.editForm.condition_type,
									condition_option: _this.editForm.condition_option,
									condition_operator: _this.editForm.condition_operator,
									condition_value: _this.editForm.condition_value,
									alarm_content: _this.editForm.alarm_content,
									notification_type: _this.editForm.notification_type,
									label: _this.editForm.label,
									notification_method: _this.editForm.notification_method,
									apnapps: _this.editForm.apn_apps,
									googleapps: _this.editForm.google_apps,
									visibility: _this.editForm.visibility,
									status: _this.editForm.status
								};
								addAlarmNoti(para, getAccessToken()).then((res) => {
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
									_this.getItems();
								}).catch(err => {
									this.logining = false;
									NProgress.done();
									var errcode = err.response.data.error.code;
									constErrorProcess(errcode, this);
								});
							} else {
								//编辑
								let para = {
									uid: _this.editForm.uid,
									name: _this.editForm.name,
									condition_type: _this.editForm.condition_type,
									condition_option: _this.editForm.condition_option,
									condition_operator: _this.editForm.condition_operator,
									condition_value: _this.editForm.condition_value,
									alarm_content: _this.editForm.alarm_content,
									notification_type: _this.editForm.notification_type,
									label: _this.editForm.label,
									notification_method: _this.editForm.notification_method,
									apnapps: _this.editForm.apn_apps,
									googleapps: _this.editForm.google_apps,
									visibility: _this.editForm.visibility,
									status: _this.editForm.status
								};
								updateAlarmNoti(para, getAccessToken()).then((res) => {
									_this.editLoading = false;
									NProgress.done();
									_this.btnEditText = '提 交';
									_this.$notify({
										title: '成功',
										message: '提交成功',
										type: 'success'
									});
									_this.editFormVisible = false;
									_this.getItems();
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

				this.isIdReadOnly = false;
				this.isIndexReadOnly = false;

				this.editFormVisible = true;
				this.editFormTitle = '添加新规则';
				this.editForm.editing = false;

				this.isUidShow = false;
				this.isUidReadOnly = true;

				this.editForm.uid = '';
				this.editForm.name = '';
				this.editForm.condition_type = 0;
				this.editForm.condition_option = 0;
				this.editForm.condition_operator = 0;
				this.editForm.condition_value = 0;
				this.editForm.alarm_content = '';
				this.editForm.notification_type = 0;
				this.editForm.label = '';
				this.editForm.notification_method = [];
				this.editForm.apn_apps = [];
				this.editForm.google_apps = [];
				this.editForm.visibility = 0;
				this.editForm.status = 0;
			}
		},
		mounted() {
			this.getItems();
			this.getiOSApplications();
			this.getAndroidApplications();
		}
	}
</script>

<style scoped>
</style>
