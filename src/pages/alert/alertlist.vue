<template>
	<section>
		<!--工具条-->
		<!--el-col :span="24" class="toolbar">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.mac" placeholder="MAC"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getAlerts">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="handleAdd">新增</el-button>
				</el-form-item>
			</el-form>
		</el-col-->

		<!--列表-->
		<template>
			<el-table :data="alerts" border stripe highlight-current-row v-loading="listLoading" style="width: 100%;">
				<!--el-table-column type="index" width="60">
				</el-table-column-->
				<el-table-column prop="productName" label="产品名称" min-width="140" sortable>
				</el-table-column>
				<el-table-column prop="alertContent" label="告警内容" min-width="120" sortable>
				</el-table-column>
				<el-table-column prop="reportTime" label="上报时间" :formatter="formatReportDate" min-width="180" sortable>
				</el-table-column>
				<el-table-column prop="wasRead" label="应用类型" :formatter="formatRead" min-width="100" sortable>
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
			<el-form-item label="应用ID" prop="uid" :show-message="false" v-if="isUidShow">
				<el-input v-model="editForm.uid" auto-complete="off" placeholder="" :disabled="isUidReadOnly"></el-input>
			</el-form-item>
			<el-form-item label="应用名称" prop="name">
				<el-input v-model="editForm.name" auto-complete="off" placeholder="英文、数字或下划线" :disabled="isIdReadOnly"></el-input>
			</el-form-item>
			<el-form-item label="应用平台类型" prop="platform">
				<el-select v-model="editForm.platform" @change="handlePlatformChanged">
						<el-option v-for="item in options" :label="item.label" :value="item.value"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="消息通知" prop="apn_on" v-if="isIosPlatformShow">
				<el-checkbox v-model="editForm.apn_on">启用苹果APN服务</el-checkbox>
			</el-form-item>
			<el-form-item label="APN授权文件" prop="p12" v-if="isIosPlatformShow">
				<el-upload
				  class="upload-demo"
					:multiple="false"
					:show-file-list="false"
					:headers="getAccessTokenMethod(editForm.uid)"
				  :action="getApnUploadRequestUrl()"
					>
				  <el-button size="small" type="primary">上传p12文件</el-button>
				  <div slot="tip" class="el-upload__tip">只能上传p12文件，且不超过500kb</div>
				</el-upload>
			</el-form-item>
			<el-form-item label="文件密码" prop="p12passwd" v-if="isIosPlatformShow">
				<el-input v-model="editForm.p12passwd" placeholder="请输入授权文件的密码"></el-input>
			</el-form-item>
			<el-form-item label="" prop="production" v-if="isIosPlatformShow">
				<el-checkbox v-model="editForm.production">正式发布APN密匙文件</el-checkbox>
			</el-form-item>
			<el-form-item label="消息通知" prop="googleplay_on" v-if="isAndroidPlatformShow">
				<el-checkbox v-model="editForm.googleplay_on">启用GooglePlay服务</el-checkbox>
			</el-form-item>
			<el-form-item label="Server API Key" prop="server_api_key" v-if="isAndroidPlatformShow">
				<el-input v-model="editForm.server_api_key" auto-complete="off" placeholder="请输入授权文件的密码" ></el-input>
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
	import { getAccessToken, getAlertList, getYYYYMMDDHHmmssFromTimestamp } from '../../api/api';

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
			var checkP12Passwd = (rule, value, callback) => {
				if (this.editForm.apn_on==true) {
					if (null==value || value=='') {
						return callback(new Error('文件密匙不能为空'));
					}
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
				 label: 'iOS'
			 }, {
				 value: 1,
				 label: 'Android'
			 }, {
				 value: 2,
				 label: 'Web'
			 }, {
				 value: 3,
				 label: '微信'
			 }],
			 	theAccessToken: {"Access-Token":"sessionStorage.getItem('user').access_token"},
				alerts: [],
				devices: [],
				total: 0,
				page: 1,
				pageSize: 20,
				listLoading: false,
				editFormVisible: false,//编辑界面显是否显示
				editFormTitle: '编辑',//编辑界面标题
				isIndexReadOnly: false,
				isIdReadOnly: false,
				isUidReadOnly: true,
				isUidShow:false,
				isIosPlatformShow:false,
				isAndroidPlatformShow:false,
				isUpoadP12ReadOnly: true,
				//编辑界面数据
				editForm: {
					uid: '',
					name: '',
					platform: 0,
					apn_on: false,
					p12passwd: '',
					production: false,
					googleplay_on: false,
					server_api_key: ''
				},
				editLoading: false,
				btnEditText: '提 交',
				editFormRules: {
					name: [
						{ required: true, message: '请输入应用名称', trigger: 'blur' }
					],
					p12passwd: [
						{ validator: checkP12Passwd, trigger: 'blur' }
					],
					platform: [
            { type: 'number', required: true, message: '请选择一个应用平台', trigger: 'change' }
          ]
				}
			}
		},
		methods: {
			//性别显示转换
			formatRead: function (row, column) {
				return true==row.wasRead ? '已读' : '未读';
			},

			// 格式化时间显示
			formatReportDate: function(row, column) {
				return getYYYYMMDDHHmmssFromTimestamp('YYYY-MM-DD HH:mm:SS', row.reportTime);
			},

			// 格式化数据端点类型
			formatPlatform: function(row, column) {
				var typeDesc = "未知类型";
				for (var n=0; n<this.options.length; ++n) {
					var aType = this.options[n];
					if (aType.value === row.platform) {
						typeDesc = aType.label;
						break;
					}
				}
				return typeDesc;
			},

			// 是否在线状态
			formatOnlineState: function(row, column) {
				return row.online === true ? '在线' : row.online === false ? '离线' : '未知状态';
			},

			handleCurrentChange(val) {
				this.page = val;
				this.getAlerts();
			},

			handleSizeChange(val) {
				this.pageSize = val;
				this.getAlerts();
			},

			handlePlatformChanged(val) {
			console.log('handlePlatformChanged:'+val);
				if (0===val) {
					this.isIosPlatformShow = true;
					this.isAndroidPlatformShow = false;
				}
				else if (1===val) {
					this.isIosPlatformShow = false;
					this.isAndroidPlatformShow = true;
				}
			},

			getAccessTokenMethod(uid) {
				var user = sessionStorage.getItem('user');
				if (user) {
					user = JSON.parse(user);
					let ret = '{"Access-Token":"' + user.access_token + '", "uid":"' + uid + '"}';
					console.log('headers='+ret);
					return JSON.parse(ret);
				}
				let ret = '{"Access-Token":""}';
				return JSON.parse(ret);
			},

			getApnUploadRequestUrl() {
				return apnUploadRequestUrl();
			},

			// 获取应用列表
			getAlerts() {
				let param = {
					page: this.page,
					page_size : this.pageSize
				};
				console.log("getAlerts start.");
				this.listLoading = true;
				NProgress.start();
				getAlertList(param, getAccessToken()).then((res) => {
					console.log("getAlerts total:"+res.data.total);
					this.total = res.data.total;
					this.alerts = res.data.items;
					this.listLoading = false;
					NProgress.done();
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
					delApplication(para, getAccessToken()).then((res) => {
						_this.listLoading = false;
						NProgress.done();
						_this.$notify({
							title: '成功',
							message: '删除成功',
							type: 'success'
						});
						_this.getAlerts();
					});

				}).catch(() => {

				});
			},
			//显示编辑界面
			handleEdit: function (row) {
				this.isIdReadOnly = true;
				this.isIndexReadOnly = true;
				this.editFormVisible = true;
				this.editFormTitle = '编辑应用程序';
				this.editForm.editing = true;

				this.isIosPlatformShow = false;
				this.isAndroidPlatformShow = false;
				if (0==row.platform) {
					this.isIosPlatformShow = true;
				}
				else if (1==row.platform) {
					this.isAndroidPlatformShow = true;
				}

				this.editForm.uid = row.uid;
				this.editForm.name = row.name;
				this.editForm.platform = row.platform;
				this.editForm.apn_on = row.apn_on;
				this.editForm.p12passwd = row.p12passwd;
				this.editForm.production = row.production;
				this.editForm.googleplay_on = row.googleplay_on;
				this.editForm.server_api_key = row.server_api_key;
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
									name: _this.editForm.name,
									platform: _this.editForm.platform,
									apn_on: _this.editForm.apn_on,
									p12passwd: _this.editForm.p12passwd,
									production: _this.editForm.production,
									googleplay_on: _this.editForm.googleplay_on,
									server_api_key: _this.editForm.server_api_key
								};
								addApplication(para, getAccessToken()).then((res) => {
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
									_this.getAlerts();
								});
							} else {
								//编辑
								let para = {
									uid: _this.editForm.uid,
									name: _this.editForm.name,
									platform: _this.editForm.platform,
									apn_on: _this.editForm.apn_on,
									p12passwd: _this.editForm.p12passwd,
									production: _this.editForm.production,
									googleplay_on: _this.editForm.googleplay_on,
									server_api_key: _this.editForm.server_api_key
								};
								updateApplication(para, getAccessToken()).then((res) => {
									_this.editLoading = false;
									NProgress.done();
									_this.btnEditText = '提 交';
									_this.$notify({
										title: '成功',
										message: '提交成功',
										type: 'success'
									});
									_this.editFormVisible = false;
									_this.getAlerts();
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
				this.isUidReadOnly = true;
				this.editFormVisible = true;
				this.editFormTitle = '添加应用';
				this.editForm.editing = false;

				this.isIosPlatformShow = false;
				this.isAndroidPlatformShow = false;

				_this.editForm.uid = '';
				_this.editForm.name = '';
				_this.editForm.platform = 0;
				_this.editForm.apn_on = false;
				_this.editForm.p12passwd = '';
				_this.editForm.production = false;
				_this.editForm.googleplay_on = false;
				_this.editForm.server_api_key = '';
			}
		},
		mounted() {
			this.getAlerts();
		}
	}
</script>

<style scoped>
</style>
