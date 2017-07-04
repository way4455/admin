import axios from 'axios';

// let base = '';
//let base = 'http://127.0.0.1:8080';
let base = 'http://127.0.0.1/OraAPIServer/v2';
//let base = 'http://192.168.1.22/OraAPIServer/v2';
//let base = 'http://192.168.1.88:8080/OraAPIServer/v2';
// let base = 'http://47.93.49.250:23780/OraAPIServer/v2';

// 登录请求
export const requestLogin = params => { return axios.post(`${base}/admin/login`, params).then(res => res.data).catch(err => {return {code:-2,msg:"服务不可用"}}); };

// 获取概览
export const getOverViewDetails = (params, headers) => { return axios.get(`${base}/admin/overview`, { params: params, headers:headers }); };
//export const getOverViewDetails = (params, headers) => { return axios.get(`${base}/admin/overview`, { params: params, headers:headers }).then(res => res.data).catch(err => {return {ret:-2,msg:"服务不可用"}}); };
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

// 获取应用信息
export const getApplicationList = (params, headers) => { return axios.get(`${base}/application/list`, { params: params, headers:headers }); };
export const getiOSApplicationList = (params, headers) => { return axios.get(`${base}/application/ioslist`, { params: params, headers:headers }); };
export const getAndroidApplicationList = (params, headers) => { return axios.get(`${base}/application/androidlist`, { params: params, headers:headers }); };
export const addApplication = (params, headers) => { return axios.post(`${base}/application/add`, params, {headers:headers}).then(res => res.data).catch(err => {return {ret:-2,msg:"服务不可用"}}); };
export const delApplication = (params, headers) => { return axios.post(`${base}/application/del`, params, {headers:headers}).then(res => res.data).catch(err => {return {ret:-2,msg:"服务不可用"}}); };
export const updateApplication = (params, headers) => { return axios.post(`${base}/application/update`, params, {headers:headers}).then(res => res.data).catch(err => {return {ret:-2,msg:"服务不可用"}}); };

// 获取报警通知信息
export const getAlarmNotiList = (params, headers) => { return axios.get(`${base}/alarmnoti/list`, { params: params, headers:headers }); };
export const addAlarmNoti = (params, headers) => { return axios.post(`${base}/alarmnoti/add`, params, {headers:headers}).then(res => res.data).catch(err => {return {ret:-2,msg:"服务不可用"}}); };
export const delAlarmNoti = (params, headers) => { return axios.post(`${base}/alarmnoti/del`, params, {headers:headers}).then(res => res.data).catch(err => {return {ret:-2,msg:"服务不可用"}}); };
export const updateAlarmNoti = (params, headers) => { return axios.post(`${base}/alarmnoti/update`, params, {headers:headers}).then(res => res.data).catch(err => {return {ret:-2,msg:"服务不可用"}}); };

// 获取报警信息
export const getAlertList = (params, headers) => { return axios.get(`${base}/alert/list`, { params: params, headers:headers }); };


export const getUserList = params => { return axios.get(`${base}/user/list`, { params: params }); };

export const getUserListPage = params => { return axios.get(`${base}/user/listpage`, { params: params }); };

export const removeUser = params => { return axios.get(`${base}/user/remove`, { params: params }); };

export const editUser = params => { return axios.get(`${base}/user/edit`, { params: params }); };

export const addUser = params => { return axios.get(`${base}/user/add`, { params: params }); };

// APN P12 upload url.
export const apnUploadRequestUrl = () => { return `${base}/apn/upload`; };

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

/**
 * 获取AccessToken Headers object
 */
export const getAccessTokenHeaders = (uid) => {
  var user = sessionStorage.getItem('user');
  if (user) {
    user = JSON.parse(user);
    let ret = '{"Access-Token":"' + user.access_token + '", "uid":"' + uid + '"}';
    console.log('headers='+ret);
    return JSON.parse(ret);
  }
  let ret = '{"Access-Token":""}';
  return JSON.parse(ret);
}

/**
 * 和PHP一样的时间戳格式化函数
 * @param {string} format 格式
 * @param {int} timestamp 要格式化的时间 默认为当前时间
 * @return {string}   格式化的时间字符串
 */
function add0(m){return m<10?'0'+m:m }
export const getYYYYMMDDHHmmssFromTimestamp = (format, timestamp) => {
  var time = new Date(timestamp);
  var y = time.getFullYear();
  var m = time.getMonth()+1;
  var d = time.getDate();
  var h = time.getHours();
  var mm = time.getMinutes();
  var s = time.getSeconds();
  return y+'-'+add0(m)+'-'+add0(d)+' '+add0(h)+':'+add0(mm)+':'+add0(s);
}
