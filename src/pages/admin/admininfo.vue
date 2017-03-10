<template>
<el-form ref="form" label-width="80px" @submit.prevent="onSubmit" style="margin:8px;width:60%;min-width:600px;">
	<el-form-item label="账号:">
		<div><span class="admininfo_itemvalue">{{adminAccount}}</span></div>
	</el-form-item>
	<el-form-item label="名称:">
		<div><span class="admininfo_itemvalue">{{adminName}}</span></div>
	</el-form-item>
	<el-form-item label="ID:">
		<div><span class="admininfo_itemvalue">{{adminId}}</span></div>
	</el-form-item>
</el-form>
</template>
<script>
	import { getUserList } from '../../api/api';
	import NProgress from 'nprogress'
	export default {
		data() {
			return {
        adminAccount: '',
        adminName: '',
        adminId: '',

				filters: {
					name: ''
				},
				loading: false,
				users: [
				]
			}
		},
		methods: {
			//性别显示转换
			formatSex: function (row, column) {
				return row.sex == 1 ? '男' : row.sex == 0 ? '女' : '未知';
			},
			//获取用户列表
			getUser: function () {
				let para = {
					name: this.filters.name
				};
				this.loading = true;
				NProgress.start();
				getUserList(para).then((res) => {
					this.users = res.data.users;
					this.loading = false;
					NProgress.done();
				});
			}
		},
		mounted() {
			//this.getUser();
  		var user = sessionStorage.getItem('user');
  		if (user) {
  			user = JSON.parse(user);
  			this.adminAccount = user.user_account || '';
  			this.adminName = user.user_name || '';
        this.adminId = user.user_id || '';
  		}
		},
    onSubmit() {
      console.log('submit!');
    }
	};
</script>

<style>
.el-row {
  margin-bottom: 8px;
  &:last-child {
    margin-bottom: 0;
  }
}
.el-col {
  border-radius: 4px;
}
.admininfo_itemtitle {
  margin: 4px auto auto 8px;
  text-align:left;
  color: #505458;
  font-size: 12px;
	font-weight: bold
}
.admininfo_itemvalue {
  margin: 4px auto auto auto;
  text-align:left;
  color: #505458;
  font-size: 12px;
}

</style>
