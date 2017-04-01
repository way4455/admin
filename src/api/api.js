import axios from 'axios';

// let base = '';
//let base = 'http://127.0.0.1:8080/RestDemo/v2';
let base = 'http://192.168.1.88:8080/OraAPIServer/v2';

// 登录请求
export const requestLogin = params => { return axios.post(`${base}/admin/login`, params).then(res => res.data).catch(err => {return {code:-2,msg:"服务不可用"}}); };

// 获取网关列表数据
//export const getGateWayList = params => { return axios.get(`${base}/gateway/list`, { params: params }); };
export const getGateWayList = (params, headers) => { return axios.get(`${base}/gateway/list`, { params: params, headers:headers }); };
// 增加网关设备
//export const addGateWayDevice = params => { return axios.post(`${base}/gateway/add`, params).then(res => res.data).catch(err => {return {ret:-2,msg:"服务不可用"}}); };
export const addGateWayDevice = (params, headers) => { return axios.post(`${base}/gateway/add`, params, {headers:headers}).then(res => res.data).catch(err => {return {ret:-2,msg:"服务不可用"}}); };
// 删除网关设备
//export const delGateWayDevice = params => { return axios.post(`${base}/gateway/del`, params).then(res => res.data).catch(err => {return {ret:-2,msg:"服务不可用"}}); };
export const delGateWayDevice = (params, headers) => { return axios.post(`${base}/gateway/del`, params, {headers:headers}).then(res => res.data).catch(err => {return {ret:-2,msg:"服务不可用"}}); };
// 更新网关设备
//export const updateGateWayDevice = params => { return axios.post(`${base}/gateway/update`, params).then(res => res.data).catch(err => {return {ret:-2,msg:"服务不可用"}}); };
export const updateGateWayDevice = (params, headers) => { return axios.post(`${base}/gateway/update`, params, {headers:headers}).then(res => res.data).catch(err => {return {ret:-2,msg:"服务不可用"}}); };

// 获取用户列表
export const getAppUserList = (params, headers) => { return axios.get(`${base}/appuser/list`, { params: params, headers:headers }); };

// 获取LogcatList
export const getLogcatList = (params, headers) => { return axios.get(`${base}/logcat/list`, { params: params, headers:headers }); };

// 获取数据端点
export const getDataPointList = (params, headers) => { return axios.get(`${base}/datapoint/list`, { params: params, headers:headers }); };
export const addDataPoint = (params, headers) => { return axios.post(`${base}/datapoint/add`, params, {headers:headers}).then(res => res.data).catch(err => {return {ret:-2,msg:"服务不可用"}}); };
export const delDataPoint = (params, headers) => { return axios.post(`${base}/datapoint/del`, params, {headers:headers}).then(res => res.data).catch(err => {return {ret:-2,msg:"服务不可用"}}); };
export const updateDataPoint = (params, headers) => { return axios.post(`${base}/datapoint/update`, params, {headers:headers}).then(res => res.data).catch(err => {return {ret:-2,msg:"服务不可用"}}); };

export const getUserList = params => { return axios.get(`${base}/user/list`, { params: params }); };

export const getUserListPage = params => { return axios.get(`${base}/user/listpage`, { params: params }); };

export const removeUser = params => { return axios.get(`${base}/user/remove`, { params: params }); };

export const editUser = params => { return axios.get(`${base}/user/edit`, { params: params }); };

export const addUser = params => { return axios.get(`${base}/user/add`, { params: params }); };


/**
 * 获取accessToken
 */
export const getAccessToken = () => {
  var user = sessionStorage.getItem('user');
  if (user) {
    user = JSON.parse(user);
    let ret = '{"Content-Type":"application/json", "Access-Token":"' + user.access_token + '"}';
    console.log('ret='+ret);
    return JSON.parse(ret);
  }
  let ret = '{"Content-Type":"application/json", "Access-Token":""}';
  return JSON.parse(ret);
}
