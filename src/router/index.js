import Vue from 'vue'
import Router from 'vue-router'
import Train from '@/page/train'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Train',
      component: Train
    }
  ]
})
