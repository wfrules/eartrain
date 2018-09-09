import Vue from 'vue'
import Router from 'vue-router'
import Train from '@/page/train'

Vue.use(Router)

const Login = r => require.ensure([], () => r(require('@/page/login.vue')), 'login')//登入
const Setting = r => require.ensure([], () => r(require('@/page/setting.vue')), 'setting')//设置
const Stat = r => require.ensure([], () => r(require('@/page/stat/stat.vue')), 'stat')//统计
const Chart = r => require.ensure([], () => r(require('@/page/chart/chart.vue')), 'chart')//图表

export default new Router({
  routes: [
    {
      path: '/',
      name: '/',
      component: Train,
      meta: {title: '训练中心'},
    },
    {
      path: '/train',
      name: 'Train',
      component: Train,
      meta: {title: '训练中心'},
    },
    {
      path: '/setting',
      name: 'setting',
      component: Setting,
      meta: {title: '系统设置'},
    },
    {
      path: '/stat',
      name: 'stat',
      component: Stat,
      meta: {title: '统计中心'},
      // children: [
      //     {
      //         path: 'full',
      //         // component: funcBody,
      //         meta: {title:'完整统计'},
      //     },
      // ]
    },
    {
      path: '/chart',
      name: 'chart',
      component: Chart,
      meta: {title: '图表'},
      // children: [
      //     {
      //         path: 'full',
      //         // component: funcBody,
      //         meta: {title:'完整统计'},
      //     },
      // ]
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
      meta: {title: '系统登入', guest: true},
    }
  ]
})
