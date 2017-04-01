import Login from './pages/Login.vue'
import NotFound from './pages/404.vue'
import AdminInfo from './pages/admin/admininfo.vue'
import GateWayList from './pages/gateway/gatewaylist.vue'
import AppUserList from './pages/appuser/appuserlist.vue'
import AppList from './pages/app/applist.vue'
import DataPointList from './pages/datapoint/datapointlist.vue'
import AlarmNotifList from './pages/alarmnotif/alarmnotiflist.vue'
import LogcatList from './pages/logcat/logcatlist.vue'
import Home from './pages/Home.vue'
import Main from './pages/Main.vue'
import Table from './pages/nav1/Table.vue'
import Form from './pages/nav1/Form.vue'
import user from './pages/nav1/user.vue'
import Page4 from './pages/nav2/Page4.vue'
import Page5 from './pages/nav2/Page5.vue'
import Page6 from './pages/nav3/Page6.vue'
import echarts from './pages/charts/echarts.vue'

let routes = [
    {
        path: '/login',
        component: Login,
        name: '',
        hidden: true
    },
    {
        path: '/404',
        component: NotFound,
        name: '',
        hidden: true
    },
    {
      path: '/',
      component: Home,
      name: '账号信息',
      iconCls: 'el-icon-message',
      leaf: true, // 只有一个节点
      children:[
        {path:'/admininfo', component: AdminInfo, name:'账号信息', hidden:false}
      ]
    },
    {
      path: '/gateway',
      component: Home,
      name: '网关设备',
      iconCls: 'el-icon-message',
      leaf: true, // 只有一个节点
      children:[
        {path:'/gateway', component: GateWayList, name:'设备列表', hidden:false}
      ]
    },
    {
      path: '/',
      component: Home,
      name: '用户列表',
      iconCls: 'el-icon-message',
      leaf: true, // 只有一个节点
      children:[
        {path:'/appuser', component: AppUserList, name:'用户列表', hidden:false}
      ]
    },
    {
      path: '/',
      component: Home,
      name: '应用列表',
      iconCls: 'el-icon-message',
      leaf: true, // 只有一个节点
      children:[
        {path:'/app', component: AppList, name:'应用列表', hidden:false}
      ]
    },
    {
      path: '/',
      component: Home,
      name: '数据端点',
      iconCls: 'el-icon-message',
      leaf: true, // 只有一个节点
      children:[
        {path:'/datapoints', component: DataPointList, name:'数据端点', hidden:false}
      ]
    },
    {
      path: '/',
      component: Home,
      name: '报警通知列表',
      iconCls: 'el-icon-message',
      leaf: true, // 只有一个节点
      children:[
        {path:'/alarmnotif', component: AlarmNotifList, name:'报警通知列表', hidden:false}
      ]
    },
    {
      path: '/',
      component: Home,
      name: '日志信息',
      iconCls: 'el-icon-message',
      leaf: true, // 只有一个节点
      children:[
        {path:'/logcat', component: LogcatList, name:'日志信息', hidden:false}
      ]
    },
    //{ path: '/main', component: Main },
    {
        path: '/',
        component: Home,
        name: '导航一',
        hidden: true,
        iconCls: 'el-icon-message',//图标样式class
        children: [
            { path: '/main', component: Main, name: '主页', hidden: true },
            { path: '/table', component: Table, name: 'Table' },
            { path: '/form', component: Form, name: 'Form' },
            { path: '/user', component: user, name: '列表' },
        ]
    },
    {
        path: '/',
        component: Home,
        name: '导航二',
        hidden: true,
        iconCls: 'fa fa-id-card-o',
        children: [
            { path: '/page4', component: Page4, name: '页面4' },
            { path: '/page5', component: Page5, name: '页面5' }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '',
        hidden: true,
        iconCls: 'fa fa-address-card',
        leaf: true,//只有一个节点
        children: [
            { path: '/page6', component: Page6, name: '导航三' }
        ]
    },
    {
        path: '/',
        component: Home,
        name: 'Charts',
        hidden: true,
        iconCls: 'fa fa-bar-chart',
        children: [
            { path: '/echarts', component: echarts, name: 'echarts' }
        ]
    },
    {
        path: '*',
        hidden: true,
        redirect: { path: '/404' }
    }
];

export default routes;
