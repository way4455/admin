<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-form :inline="true" :model="filters">
				<!--el-form-item>
					<el-input v-model="filters.mac" placeholder="MAC"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getDataPoints">查询</el-button>
				</el-form-item-->
				<el-form-item>
					<el-button type="primary" @click="handleAdd">新增</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<template>
			<el-table :data="datapoints" border highlight-current-row v-loading="listLoading" style="width: 100%;">
				<!--el-table-column type="index" width="60">
				</el-table-column-->
				<el-table-column prop="index" label="索引" min-width="100" sortable>
				</el-table-column>
				<el-table-column prop="id" label="端点ID" min-width="140" sortable>
				</el-table-column>
				<el-table-column prop="type" label="数据类型" :formatter="formatDataType" min-width="140" sortable>
				</el-table-column>
				<el-table-column prop="unit" label="单位符号" min-width="120" sortable>
				</el-table-column>
				<el-table-column prop="desc" label="描述" min-width="180" sortable>
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
			<el-form-item label="索引" prop="index">
				<el-input v-model.number="editForm.index" auto-complete="off" placeholder="数据端点索引不能重复" :disabled="isIndexReadOnly"></el-input>
			</el-form-item>
			<el-form-item label="端点ID" prop="id">
				<el-input v-model.number="editForm.id" auto-complete="off" placeholder="英文、数字或下划线" :disabled="isIdReadOnly"></el-input>
			</el-form-item>
			<el-form-item label="数据类型">
				<el-select v-model="editForm.type" prop="type">
						<el-option v-for="item in options" :label="item.label" :value="item.value"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="单位符号" prop="unit">
				<el-input type="textarea" :rows="2" v-model="editForm.unit" placeholder="例如: ℃"></el-input>
			</el-form-item>
			<el-form-item label="描述" prop="desc">
				<el-input type="textarea" :rows="2" v-model="editForm.desc" placeholder="请填写数据端点描述"></el-input>
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
	import { getAccessToken, getDataPointList, addDataPoint, delDataPoint, updateDataPoint } from '../../api/api';

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
				 label: '字符串'
			 }, {
				 value: 1,
				 label: '布尔类型'
			 }, {
				 value: 3,
				 label: '整形'
			 }, {
				 value: 4,
				 label: '浮点型'
			 }],
				datapoints: [],
				devices: [],
				total: 0,
				page: 1,
				pageSize: 20,
				listLoading: false,
				editFormVisible: false,//编辑界面显是否显示
				editFormTitle: '编辑',//编辑界面标题
				isIndexReadOnly: false,
				isIdReadOnly: false,
				//编辑界面数据
				editForm: {
					editing: false,
					index: 0,
					id: 0,
					type: 0,
					unit: '',
					desc: ''
				},
				editLoading: false,
				btnEditText: '提 交',
				editFormRules: {
					index: [
						{ validator: checkIndex, trigger: 'blur' }
					],
					id: [
						{ validator: checkId, trigger: 'blur' }
					],
					type: [
            { type: 'array', required: true, message: '请至少选择一个端点数据类型', trigger: 'change' }
          ],
					unit: [
						{ required: true, message: '请输入端点单位，如摄氏度', trigger: 'blur' }
					],
					desc: [
						{ required: true, message: '请输入端点描述', trigger: 'blur' }
					],
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
					if (aType.value === row.type) {
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
				this.getDataPoints();
			},

			handleSizeChange(val) {
				this.pageSize = val;
				this.getDataPoints();
			},

			// 获取数据端点列表
			getDataPoints() {
				let param = {
					page: this.page,
					page_size : this.pageSize
				};
				console.log("getDataPoints start.");
				this.listLoading = true;
				NProgress.start();
				getDataPointList(param, getAccessToken()).then((res) => {
					console.log("getDataPoints total:"+res.data.total);
					this.total = res.data.total;
					this.datapoints = res.data.datapoints;
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
						index: row.index
					};
					delDataPoint(para, getAccessToken()).then((res) => {
						_this.listLoading = false;
						NProgress.done();
						_this.$notify({
							title: '成功',
							message: '删除成功',
							type: 'success'
						});
						_this.getDataPoints();
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
				this.isIdReadOnly = true;
				this.isIndexReadOnly = true;
				this.editFormVisible = true;
				this.editFormTitle = '编辑数据端点';
				this.editForm.editing = true;
				this.editForm.id = row.id;
				this.editForm.index = row.index;
				this.editForm.type = row.type;
				this.editForm.unit = row.unit;
				this.editForm.desc = row.desc;
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
									id: _this.editForm.id,
									index: _this.editForm.index,
									type: _this.editForm.type,
									unit: _this.editForm.unit,
									desc: _this.editForm.desc
								};
								addDataPoint(para, getAccessToken()).then((res) => {
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
									_this.getDataPoints();
								}).catch(err => {
									this.logining = false;
									NProgress.done();
									var errcode = err.response.data.error.code;
									constErrorProcess(errcode, this);
								});
							} else {
								//编辑
								let para = {
									id: _this.editForm.id,
									index: _this.editForm.index,
									type: _this.editForm.type,
									unit: _this.editForm.unit,
									desc: _this.editForm.desc
								};
								updateDataPoint(para, getAccessToken()).then((res) => {
									_this.editLoading = false;
									NProgress.done();
									_this.btnEditText = '提 交';
									_this.$notify({
										title: '成功',
										message: '提交成功',
										type: 'success'
									});
									_this.editFormVisible = false;
									_this.getDataPoints();
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
				this.editFormTitle = '添加数据端点';
				this.editForm.editing = false;
				this.editForm.index = null;
				this.editForm.id = null;
				this.editForm.type = 0;
				this.editForm.unit = '';
				this.editForm.desc = '';
			}
		},
		mounted() {
			this.getDataPoints();
		}
	}
</script>

<style scoped>
</style>
