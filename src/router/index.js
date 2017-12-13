import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import SJFNo from '@/components/SJFNo'
import SJF from '@/components/SJF'
import RR from '@/components/RR'
import File from '@/components/MyFile'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld,
      children: [
        {
          path: 'sjfno',
          component: SJFNo
        },
        {
          path: 'sjf',
          component: SJF
        },
        {
          path: 'rr',
          component: RR
        },
        {
          path: '/file',
          component: File
        }
      ]
    }
  ]
})
