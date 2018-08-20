import Vue from 'vue'
import Router from 'vue-router'
import Train from '@/page/train'

Vue.use(Router)

const Login = r => require.ensure([], () => r(require('@/page/login.vue')), 'login')//登入

export default new Router({
    routes: [
        {
            path: '/',
            name: 'Train',
            component: Train
        },
        {
            path: '/train',
            name: 'Train',
            component: Train
        },
        {
            path: '/login',
            name: 'login',
            component: Login,
            meta: {title: '系统登入', guest: true},
        }
    ]
})
